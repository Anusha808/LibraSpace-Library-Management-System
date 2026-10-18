
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PaymentHistory.css";

const API_URL = "http://localhost:5000/api/payments/my";

const TOKEN_KEYS = [
    "token",
    "authToken",
    "accessToken",
    "jwt",
    "userToken"
];

const formatDate = (dateValue) => {
    if (!dateValue) return "Date unavailable";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Date unavailable";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

const formatAmount = (amount) => {
    const value = Number(amount);

    return `₹${(Number.isFinite(value) ? value : 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;
};

const getStoredToken = () => {
    for (const key of TOKEN_KEYS) {
        const storedValue = localStorage.getItem(key);

        if (!storedValue) continue;

        // Handle applications that save a token directly.
        const directToken = storedValue.trim();

        if (
            directToken &&
            directToken !== "null" &&
            directToken !== "undefined"
        ) {
            try {
                // Also support a JSON-stringified token.
                const parsed = JSON.parse(directToken);

                if (typeof parsed === "string" && parsed.trim()) {
                    return parsed.trim();
                }

                // Support an object saved under a token-related key.
                if (parsed && typeof parsed === "object") {
                    const nestedToken =
                        parsed.token ||
                        parsed.accessToken ||
                        parsed.authToken;

                    if (typeof nestedToken === "string" && nestedToken.trim()) {
                        return nestedToken.trim();
                    }
                }
            } catch {
                // A normal JWT is not JSON, so use it as-is.
                return directToken;
            }
        }
    }

    return null;
};

const getStatus = (status) => {
    const value = String(status || "").trim().toLowerCase();

    if (["successful", "success", "completed", "paid"].includes(value)) {
        return "Successful";
    }

    if (["pending", "created", "processing", "initiated"].includes(value)) {
        return "Pending";
    }

    if (["failed", "failure", "cancelled", "canceled", "rejected"].includes(value)) {
        return "Failed";
    }

    if (["refunded", "refund"].includes(value)) {
        return "Refunded";
    }

    return value
        ? value.charAt(0).toUpperCase() + value.slice(1)
        : "Unknown";
};

const getPaymentId = (payment) =>
    payment.razorpayPaymentId ||
    payment.transactionId ||
    payment.razorpayOrderId ||
    payment._id ||
    "Transaction ID unavailable";

const getPaymentDescription = (payment) =>
    payment.description ||
    payment.membership?.planId?.name ||
    payment.membership?.plan?.name ||
    payment.planId?.name ||
    "Library Membership Payment";

const getPaymentDate = (payment) =>
    payment.paymentDate || payment.createdAt || payment.updatedAt;

const getPaymentMethod = (payment) =>
    payment.method ||
    (payment.razorpayPaymentId ? "Razorpay" : "Online Payment");

const getPaymentDuration = (payment) =>
    payment.duration ||
    payment.membership?.duration ||
    payment.membership?.planId?.duration ||
    "Membership";

const normalizePayments = (result) => {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.payments)) return result.payments;
    if (Array.isArray(result?.data?.payments)) return result.data.payments;
    if (Array.isArray(result?.data)) return result.data;

    return null;
};

const getErrorMessage = async (response) => {
    const result = await response.json().catch(() => null);

    if (response.status === 401) {
        return {
            message:
                result?.message ||
                "Your login session is missing or expired. Please log in again.",
            authenticationError: true
        };
    }

    if (response.status === 403) {
        return {
            message:
                result?.message ||
                "You do not have permission to view these payments.",
            authenticationError: true
        };
    }

    return {
        message:
            result?.message ||
            result?.error ||
            `Unable to load payment history (HTTP ${response.status}).`,
        authenticationError: false
    };
};

function PaymentHistory() {
    const navigate = useNavigate();

    const [payments, setPayments] = useState([]);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [authenticationError, setAuthenticationError] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const fetchPayments = useCallback(async (signal) => {
        setLoading(true);
        setError("");
        setAuthenticationError(false);

        try {
            const token = getStoredToken();

            if (!token) {
                setPayments([]);
                setAuthenticationError(true);
                setError(
                    "No authentication token was found in localStorage. Please log in again. If this continues, update your login page to save the token returned by the backend."
                );
                return;
            }

            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`
                },
                signal
            });

            if (!response.ok) {
                const failure = await getErrorMessage(response);

                setPayments([]);
                setAuthenticationError(failure.authenticationError);
                setError(failure.message);
                return;
            }

            const result = await response.json();
            const records = normalizePayments(result);

            if (!records) {
                throw new Error(
                    "The server response did not contain a payment list. Check the GET /api/payments/my response in your backend."
                );
            }

            const normalizedPayments = records.map((payment) => ({
                ...payment,
                displayId: getPaymentId(payment),
                displayDescription: getPaymentDescription(payment),
                displayDate: getPaymentDate(payment),
                displayMethod: getPaymentMethod(payment),
                displayStatus: getStatus(payment.status),
                displayAmount: Number(payment.amount) || 0,
                displayDuration: getPaymentDuration(payment)
            }));

            normalizedPayments.sort((a, b) => {
                const dateA = new Date(a.displayDate || 0).getTime();
                const dateB = new Date(b.displayDate || 0).getTime();

                return dateB - dateA;
            });

            setPayments(normalizedPayments);
        } catch (err) {
            if (err.name !== "AbortError") {
                setPayments([]);
                setError(
                    err.message ||
                    "Something went wrong while loading payment history."
                );
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        fetchPayments(controller.signal);

        return () => controller.abort();
    }, [fetchPayments, reloadKey]);

    const successfulPayments = useMemo(
        () =>
            payments.filter(
                (payment) => payment.displayStatus === "Successful"
            ),
        [payments]
    );

    const totalPaid = useMemo(
        () =>
            successfulPayments.reduce(
                (total, payment) => total + payment.displayAmount,
                0
            ),
        [successfulPayments]
    );

    const filteredPayments = useMemo(() => {
        if (filter === "all") return payments;

        return payments.filter(
            (payment) =>
                payment.displayStatus.toLowerCase() === filter.toLowerCase()
        );
    }, [payments, filter]);

    const latestPayment = payments[0];

    const handleRetry = () => {
        setReloadKey((previous) => previous + 1);
    };

    const handleLogout = () => {
        TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));

        localStorage.removeItem("user");
        localStorage.removeItem("currentUser");

        navigate("/login");
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="payment-history-page">
            {/* SIDEBAR */}
            <aside className="payment-sidebar">
                <div className="payment-sidebar-logo">
                    <div className="payment-logo-icon">📚</div>
                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>
                </div>

                <div className="payment-menu-title">MAIN MENU</div>

                <nav className="payment-sidebar-nav">
                    <Link to="/dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link to="/seats">
                        <span>💺</span>
                        Reserve Seat
                    </Link>

                    <Link to="/reservations">
                        <span>▣</span>
                        My Reservations
                    </Link>

                    <Link to="/membership">
                        <span>♛</span>
                        Membership
                    </Link>
                </nav>

                <div className="payment-menu-title">ACCOUNT</div>

                <nav className="payment-sidebar-nav">
                    <Link to="/profile">
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link to="/payment-history" className="active">
                        <span>▤</span>
                        Payment History
                    </Link>
                </nav>

                <div className="payment-sidebar-bottom">
                    <div className="payment-library-status">
                        <span className="payment-status-dot"></span>
                        <div>
                            <strong>Library Open</strong>
                            <small>8:00 AM - 10:00 PM</small>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="payment-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="payment-content">
                <header className="payment-topbar">
                    <div>
                        <span className="payment-top-label">STUDENT PORTAL</span>
                        <h1>Payment History</h1>
                    </div>

                    <Link to="/profile" className="payment-user">
                        <div className="payment-user-avatar">A</div>
                        <div className="payment-user-info">
                            <strong>Library Member</strong>
                            <span>LibraSpace Account</span>
                        </div>
                    </Link>
                </header>

                <main className="payment-main">
                    <div className="payment-breadcrumb">
                        <Link to="/dashboard">Dashboard</Link>
                        <span>/</span>
                        <strong>Payment History</strong>
                    </div>

                    <section className="payment-page-header">
                        <div>
                            <span>TRANSACTION HISTORY</span>
                            <h2>Payment History</h2>
                            <p>
                                View your actual membership payments and
                                transaction details.
                            </p>
                        </div>

                        <div className="payment-secure-badge">
                            🔒 Secure Payments
                        </div>
                    </section>

                    {/* SUMMARY CARDS */}
                    <section className="payment-summary-grid">
                        <div className="payment-stat-card">
                            <div className="payment-stat-icon">₹</div>
                            <div>
                                <span>TOTAL PAID</span>
                                <strong>{formatAmount(totalPaid)}</strong>
                                <small>Successful payments only</small>
                            </div>
                        </div>

                        <div className="payment-stat-card">
                            <div className="payment-stat-icon success">✓</div>
                            <div>
                                <span>SUCCESSFUL</span>
                                <strong>{successfulPayments.length}</strong>
                                <small>Completed transactions</small>
                            </div>
                        </div>

                        <div className="payment-stat-card">
                            <div className="payment-stat-icon membership">♛</div>
                            <div>
                                <span>MEMBERSHIP PAYMENTS</span>
                                <strong>{payments.length}</strong>
                                <small>Records returned by the server</small>
                            </div>
                        </div>

                        <div className="payment-stat-card">
                            <div className="payment-stat-icon latest">📅</div>
                            <div>
                                <span>LATEST PAYMENT</span>
                                <strong>
                                    {latestPayment
                                        ? formatAmount(latestPayment.displayAmount)
                                        : "₹0.00"}
                                </strong>
                                <small>
                                    {latestPayment
                                        ? formatDate(latestPayment.displayDate)
                                        : "No payments yet"}
                                </small>
                            </div>
                        </div>
                    </section>

                    {/* TRANSACTIONS */}
                    <section className="payment-history-card">
                        <div className="payment-card-header">
                            <div>
                                <span>YOUR TRANSACTIONS</span>
                                <h3>Payment Transactions</h3>
                            </div>

                            <select
                                value={filter}
                                onChange={(event) => setFilter(event.target.value)}
                                aria-label="Filter payments by status"
                            >
                                <option value="all">All Payments</option>
                                <option value="successful">Successful</option>
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>

                        <div className="payment-table-header">
                            <span>TRANSACTION</span>
                            <span>DATE</span>
                            <span>PAYMENT METHOD</span>
                            <span>AMOUNT</span>
                            <span>STATUS</span>
                            <span>ACTION</span>
                        </div>

                        <div className="payment-list">
                            {loading ? (
                                <div className="payment-empty-state">
                                    Loading payment history from your account...
                                </div>
                            ) : error ? (
                                <div className="payment-error-state">
                                    <strong>Unable to load payment history</strong>
                                    <p>{error}</p>

                                    {authenticationError ? (
                                        <Link
                                            to="/login"
                                            className="receipt-button"
                                        >
                                            Go to Login
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            className="receipt-button"
                                            onClick={handleRetry}
                                        >
                                            Try Again
                                        </button>
                                    )}
                                </div>
                            ) : filteredPayments.length === 0 ? (
                                <div className="payment-empty-state">
                                    {payments.length === 0
                                        ? "No payment records were found for your account."
                                        : "No payments match the selected filter."}
                                </div>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <div
                                        className="payment-row"
                                        key={payment._id || payment.displayId}
                                    >
                                        <div className="payment-transaction">
                                            <div className="payment-transaction-icon">
                                                ₹
                                            </div>
                                            <div>
                                                <strong>
                                                    {payment.displayDescription}
                                                </strong>
                                                <span>
                                                    {payment.displayId} ·{" "}
                                                    {payment.displayDuration}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="payment-date">
                                            <span>
                                                {formatDate(payment.displayDate)}
                                            </span>
                                        </div>

                                        <div className="payment-method">
                                            <span className="razorpay-icon">R</span>
                                            <span>{payment.displayMethod}</span>
                                        </div>

                                        <div className="payment-amount">
                                            {formatAmount(payment.displayAmount)}
                                        </div>

                                        <div>
                                            <span
                                                className={`payment-status-badge payment-status-${payment.displayStatus.toLowerCase()}`}
                                            >
                                                {payment.displayStatus === "Successful"
                                                    ? "✓ "
                                                    : ""}
                                                {payment.displayStatus}
                                            </span>
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                className="receipt-button"
                                                onClick={() =>
                                                    setSelectedPayment(payment)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* PAYMENT INFORMATION */}
                    <section className="payment-information">
                        <div className="payment-information-icon">💡</div>
                        <div>
                            <strong>Payment Information</strong>
                            <p>
                                This page displays payment records returned by
                                the LibraSpace backend for your logged-in account.
                                Only successful transactions are included in the
                                Total Paid amount.
                            </p>
                        </div>
                    </section>

                    {/* SECURITY */}
                    <section className="payment-security">
                        <div className="payment-security-icon">🔐</div>
                        <div>
                            <strong>Your payments are secure</strong>
                            <p>
                                Payment details are retrieved from your account.
                                Sensitive card and banking information is not
                                displayed here.
                            </p>
                        </div>
                    </section>
                </main>

                <footer className="payment-footer">
                    <div>
                        <strong>📚 LibraSpace</strong>
                        <span>
                            Smart Library Seat Reservation &amp; Membership System
                        </span>
                    </div>
                    <span>© 2026 LibraSpace</span>
                </footer>
            </div>

            {/* TRANSACTION DETAILS MODAL */}
            {selectedPayment && (
                <div
                    className="payment-modal-overlay"
                    onClick={() => setSelectedPayment(null)}
                    role="presentation"
                >
                    <section
                        className="payment-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="payment-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="payment-modal-header">
                            <div>
                                <span>LIBRASPACE TRANSACTION</span>
                                <h3 id="payment-modal-title">Payment Details</h3>
                            </div>

                            <button
                                type="button"
                                className="payment-modal-close"
                                onClick={() => setSelectedPayment(null)}
                                aria-label="Close payment details"
                            >
                                ×
                            </button>
                        </div>

                        <div className="payment-modal-amount">
                            {formatAmount(selectedPayment.displayAmount)}
                        </div>

                        <div className="payment-modal-details">
                            <div>
                                <span>Description</span>
                                <strong>
                                    {selectedPayment.displayDescription}
                                </strong>
                            </div>

                            <div>
                                <span>Transaction ID</span>
                                <strong>{selectedPayment.displayId}</strong>
                            </div>

                            <div>
                                <span>Razorpay Order ID</span>
                                <strong>
                                    {selectedPayment.razorpayOrderId ||
                                        "Not available"}
                                </strong>
                            </div>

                            <div>
                                <span>Payment ID</span>
                                <strong>
                                    {selectedPayment.razorpayPaymentId ||
                                        "Not available"}
                                </strong>
                            </div>

                            <div>
                                <span>Date</span>
                                <strong>
                                    {formatDate(selectedPayment.displayDate)}
                                </strong>
                            </div>

                            <div>
                                <span>Payment Method</span>
                                <strong>{selectedPayment.displayMethod}</strong>
                            </div>

                            <div>
                                <span>Membership Duration</span>
                                <strong>{selectedPayment.displayDuration}</strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>{selectedPayment.displayStatus}</strong>
                            </div>
                        </div>

                        <div className="payment-modal-actions">
                            <button
                                type="button"
                                className="receipt-button"
                                onClick={handlePrint}
                            >
                                Print Details
                            </button>

                            <button
                                type="button"
                                className="payment-modal-done"
                                onClick={() => setSelectedPayment(null)}
                            >
                                Close
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default PaymentHistory;
