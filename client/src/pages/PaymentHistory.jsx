import { Link } from "react-router-dom";
import "./PaymentHistory.css";

function PaymentHistory() {

    const payments = [
        {
            id: "PAY-001",
            date: "12 Sep 2026",
            description: "Premium Reader Membership",
            duration: "1 Month",
            method: "Razorpay",
            amount: 499,
            status: "Successful"
        },
        {
            id: "PAY-002",
            date: "12 Aug 2026",
            description: "Premium Reader Membership",
            duration: "1 Month",
            method: "Razorpay",
            amount: 499,
            status: "Successful"
        },
        {
            id: "PAY-003",
            date: "12 Jul 2026",
            description: "Premium Reader Membership",
            duration: "1 Month",
            method: "Razorpay",
            amount: 499,
            status: "Successful"
        },
        {
            id: "PAY-004",
            date: "12 Jun 2026",
            description: "Premium Reader Membership",
            duration: "1 Month",
            method: "Razorpay",
            amount: 499,
            status: "Successful"
        }
    ];

    const handleReceipt = (paymentId) => {
        alert(`Receipt for ${paymentId} will be available after payment integration.`);
    };

    return (
        <div className="payment-history-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="payment-sidebar">

                <div className="payment-sidebar-logo">

                    <div className="payment-logo-icon">
                        📚
                    </div>

                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>

                </div>

                <div className="payment-menu-title">
                    MAIN MENU
                </div>

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

                <div className="payment-menu-title">
                    ACCOUNT
                </div>

                <nav className="payment-sidebar-nav">

                    <Link to="/profile">
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link
                        to="/payment-history"
                        className="active"
                    >
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

                    <Link
                        to="/"
                        className="payment-logout"
                    >
                        ↪ Logout
                    </Link>

                </div>

            </aside>


            {/* ================= MAIN CONTENT ================= */}

            <div className="payment-content">

                {/* TOPBAR */}

                <header className="payment-topbar">

                    <div>

                        <span className="payment-top-label">
                            STUDENT PORTAL
                        </span>

                        <h1>
                            Payment History
                        </h1>

                    </div>

                    <Link
                        to="/profile"
                        className="payment-user"
                    >

                        <div className="payment-user-avatar">
                            A
                        </div>

                        <div className="payment-user-info">

                            <strong>
                                Student
                            </strong>

                            <span>
                                Library Member
                            </span>

                        </div>

                    </Link>

                </header>


                {/* ================= MAIN ================= */}

                <main className="payment-main">

                    {/* BREADCRUMB */}

                    <div className="payment-breadcrumb">

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span>/</span>

                        <strong>
                            Payment History
                        </strong>

                    </div>


                    {/* PAGE HEADER */}

                    <section className="payment-page-header">

                        <div>

                            <span>
                                TRANSACTION HISTORY
                            </span>

                            <h2>
                                Payment History
                            </h2>

                            <p>
                                View your membership payments and
                                transaction details.
                            </p>

                        </div>

                        <div className="payment-secure-badge">
                            🔒 Secure Payments
                        </div>

                    </section>


                    {/* ================= SUMMARY ================= */}

                    <section className="payment-summary-grid">

                        <div className="payment-stat-card">

                            <div className="payment-stat-icon">
                                ₹
                            </div>

                            <div>
                                <span>
                                    TOTAL PAID
                                </span>

                                <strong>
                                    ₹1,996
                                </strong>

                                <small>
                                    All successful payments
                                </small>
                            </div>

                        </div>


                        <div className="payment-stat-card">

                            <div className="payment-stat-icon success">
                                ✓
                            </div>

                            <div>
                                <span>
                                    SUCCESSFUL
                                </span>

                                <strong>
                                    4
                                </strong>

                                <small>
                                    Completed transactions
                                </small>
                            </div>

                        </div>


                        <div className="payment-stat-card">

                            <div className="payment-stat-icon membership">
                                ♛
                            </div>

                            <div>
                                <span>
                                    MEMBERSHIP PAYMENTS
                                </span>

                                <strong>
                                    4
                                </strong>

                                <small>
                                    Premium Reader plan
                                </small>
                            </div>

                        </div>


                        <div className="payment-stat-card">

                            <div className="payment-stat-icon latest">
                                📅
                            </div>

                            <div>
                                <span>
                                    LATEST PAYMENT
                                </span>

                                <strong>
                                    ₹499
                                </strong>

                                <small>
                                    12 Sep 2026
                                </small>
                            </div>

                        </div>

                    </section>


                    {/* ================= PAYMENT HISTORY CARD ================= */}

                    <section className="payment-history-card">

                        <div className="payment-card-header">

                            <div>

                                <span>
                                    YOUR TRANSACTIONS
                                </span>

                                <h3>
                                    Payment Transactions
                                </h3>

                            </div>

                            <select defaultValue="all">

                                <option value="all">
                                    All Payments
                                </option>

                                <option value="successful">
                                    Successful
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="failed">
                                    Failed
                                </option>

                            </select>

                        </div>


                        {/* TABLE HEADER */}

                        <div className="payment-table-header">

                            <span>
                                TRANSACTION
                            </span>

                            <span>
                                DATE
                            </span>

                            <span>
                                PAYMENT METHOD
                            </span>

                            <span>
                                AMOUNT
                            </span>

                            <span>
                                STATUS
                            </span>

                            <span>
                                ACTION
                            </span>

                        </div>


                        {/* PAYMENT ROWS */}

                        <div className="payment-list">

                            {payments.map((payment) => (

                                <div
                                    className="payment-row"
                                    key={payment.id}
                                >

                                    <div className="payment-transaction">

                                        <div className="payment-transaction-icon">
                                            ₹
                                        </div>

                                        <div>

                                            <strong>
                                                {payment.description}
                                            </strong>

                                            <span>
                                                {payment.id} · {payment.duration}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="payment-date">

                                        <span>
                                            {payment.date}
                                        </span>

                                    </div>


                                    <div className="payment-method">

                                        <span className="razorpay-icon">
                                            R
                                        </span>

                                        <span>
                                            {payment.method}
                                        </span>

                                    </div>


                                    <div className="payment-amount">

                                        ₹{payment.amount.toLocaleString("en-IN")}

                                    </div>


                                    <div>

                                        <span className="payment-success">
                                            ✓ Successful
                                        </span>

                                    </div>


                                    <div>

                                        <button
                                            type="button"
                                            className="receipt-button"
                                            onClick={() =>
                                                handleReceipt(payment.id)
                                            }
                                        >
                                            View Receipt
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>


                    {/* ================= PAYMENT INFORMATION ================= */}

                    <section className="payment-information">

                        <div className="payment-information-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                Payment Information
                            </strong>

                            <p>
                                All payments shown here are membership
                                transactions associated with your
                                LibraSpace account. Actual transaction
                                records will be loaded from the payment
                                gateway after backend integration.
                            </p>

                        </div>

                    </section>


                    {/* ================= SECURITY ================= */}

                    <section className="payment-security">

                        <div className="payment-security-icon">
                            🔐
                        </div>

                        <div>

                            <strong>
                                Your payments are secure
                            </strong>

                            <p>
                                LibraSpace uses secure payment processing
                                to protect your transaction information.
                                Card and banking details are handled by
                                the payment gateway.
                            </p>

                        </div>

                    </section>

                </main>


                {/* FOOTER */}

                <footer className="payment-footer">

                    <div>

                        <strong>
                            📚 LibraSpace
                        </strong>

                        <span>
                            Smart Library Seat Reservation &
                            Membership System
                        </span>

                    </div>

                    <span>
                        © 2026 LibraSpace
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default PaymentHistory;