import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Link,
    useLocation,
    useNavigate
} from "react-router-dom";

import "./AdminPayments.css";


/* =========================================================
   API
========================================================= */

const API_BASE =
    "http://localhost:5000/api/admin/payments";


/* =========================================================
   ADMIN PAYMENTS
========================================================= */

function AdminPayments() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [payments, setPayments] =
        useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [typeFilter, setTypeFilter] =
        useState("All");

    const [selectedPayment, setSelectedPayment] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    /* =====================================================
       ADMIN INFORMATION
    ===================================================== */

    const storedAdmin = useMemo(() => {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "adminUser"
                )
            );

        } catch {

            return null;

        }

    }, []);


    const adminName =
        storedAdmin?.name ||
        "Administrator";


    const adminEmail =
        storedAdmin?.email ||
        "admin@libraspace.com";


    /* =====================================================
       ACTIVE SIDEBAR
    ===================================================== */

    const isActive = (path) => {

        return location.pathname === path
            ? "active"
            : "";

    };


    /* =====================================================
       AUTH HEADERS
    ===================================================== */

    const getHeaders = () => {

        const token =
            localStorage.getItem(
                "adminToken"
            );


        return {

            "Content-Type":
                "application/json",

            ...(token
                ? {
                    Authorization:
                        `Bearer ${token}`
                }
                : {})

        };

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem(
            "adminToken"
        );

        localStorage.removeItem(
            "adminUser"
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        navigate(
            "/admin/login"
        );

    };


    /* =====================================================
       FORMAT DATE
    ===================================================== */

    const formatDate = (dateValue) => {

        if (!dateValue) {

            return "—";

        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";

        }


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    const formatTime = (dateValue) => {

        if (!dateValue) {

            return "—";

        }


        const date =
            new Date(dateValue);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return "—";

        }


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    /* =====================================================
       LOAD PAYMENTS
    ===================================================== */

    const loadPayments =
        async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await fetch(
                        API_BASE,
                        {
                            method: "GET",
                            headers:
                                getHeaders()
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to load payments."
                    );

                }


                const serverPayments =
                    Array.isArray(
                        data.payments
                    )
                        ? data.payments
                        : [];


                const formattedPayments =
                    serverPayments.map(
                        (
                            payment,
                            index
                        ) => {

                            const user =
                                payment.user ||
                                {};

                            const membership =
                                payment.membership ||
                                {};


                            const paymentId =
                                `PAY-${String(
                                    payment._id ||
                                    index
                                )
                                    .slice(-6)
                                    .toUpperCase()}`;


                            const year =
                                payment.paymentDate
                                    ? new Date(
                                        payment.paymentDate
                                    ).getFullYear()
                                    : new Date()
                                        .getFullYear();


                            const studentId =
                                `LIB${year}${String(
                                    user._id ||
                                    payment._id ||
                                    index
                                )
                                    .slice(-6)
                                    .toUpperCase()}`;


                            return {

                                _id:
                                    payment._id,

                                id:
                                    paymentId,

                                member:
                                    user.name ||
                                    "Unknown Member",

                                studentId,

                                email:
                                    user.email ||
                                    "—",

                                type:
                                    "Membership",

                                plan:
                                    membership.planName ||
                                    payment.description ||
                                    "Membership",

                                amount:
                                    Number(
                                        payment.amount ||
                                        membership.monthlyFee ||
                                        0
                                    ),

                                method:
                                    payment.method ||
                                    "Razorpay",

                                date:
                                    formatDate(
                                        payment.paymentDate
                                    ),

                                time:
                                    formatTime(
                                        payment.paymentDate
                                    ),

                                status:
                                    payment.status ||
                                    "Pending",

                                transactionId:
                                    payment.transactionId ||
                                    "—"

                            };

                        }
                    );


                setPayments(
                    formattedPayments
                );

            } catch (err) {

                console.error(
                    "Load payments error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load payments."
                );

            } finally {

                setLoading(false);

            }

        };


    /* =====================================================
       LOAD ON PAGE OPEN
    ===================================================== */

    useEffect(() => {

        loadPayments();

    }, []);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics =
        useMemo(() => {

            const successfulPayments =
                payments.filter(
                    (payment) =>
                        payment.status ===
                        "Successful"
                );


            const pendingPayments =
                payments.filter(
                    (payment) =>
                        payment.status ===
                        "Pending"
                );


            const failedPayments =
                payments.filter(
                    (payment) =>
                        payment.status ===
                        "Failed"
                );


            const totalRevenue =
                successfulPayments.reduce(
                    (
                        total,
                        payment
                    ) =>
                        total +
                        Number(
                            payment.amount ||
                            0
                        ),
                    0
                );


            const pendingAmount =
                pendingPayments.reduce(
                    (
                        total,
                        payment
                    ) =>
                        total +
                        Number(
                            payment.amount ||
                            0
                        ),
                    0
                );


            return {

                totalRevenue,

                successful:
                    successfulPayments.length,

                pending:
                    pendingPayments.length,

                failed:
                    failedPayments.length,

                pendingAmount

            };

        }, [payments]);


    /* =====================================================
       SEARCH + FILTER
    ===================================================== */

    const filteredPayments =
        useMemo(() => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            return payments.filter(
                (payment) => {

                    const matchesSearch =

                        String(
                            payment.id ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            payment.member ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            payment.studentId ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            payment.email ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            payment.transactionId ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search);


                    const matchesStatus =
                        statusFilter ===
                        "All" ||
                        payment.status ===
                        statusFilter;


                    const matchesType =
                        typeFilter ===
                        "All" ||
                        payment.type ===
                        typeFilter;


                    return (
                        matchesSearch &&
                        matchesStatus &&
                        matchesType
                    );

                }
            );

        }, [
            payments,
            searchTerm,
            statusFilter,
            typeFilter
        ]);


    /* =====================================================
       UPDATE PAYMENT STATUS
    ===================================================== */

    const updatePaymentStatus =
        async (
            payment,
            status
        ) => {

            try {

                const response =
                    await fetch(
                        `${API_BASE}/${payment._id}/status`,
                        {
                            method: "PATCH",
                            headers:
                                getHeaders(),
                            body:
                                JSON.stringify({
                                    status
                                })
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Unable to update payment status."
                    );

                }


                alert(
                    `Payment marked as ${status.toLowerCase()}.`
                );


                setSelectedPayment(
                    null
                );


                await loadPayments();

            } catch (err) {

                console.error(
                    "Update payment status error:",
                    err
                );


                alert(
                    err.message ||
                    "Unable to update payment status."
                );

            }

        };


    /* =====================================================
       MARK SUCCESSFUL
    ===================================================== */

    const handleMarkSuccessful =
        (payment) => {

            updatePaymentStatus(
                payment,
                "Successful"
            );

        };


    /* =====================================================
       MARK FAILED
    ===================================================== */

    const handleMarkFailed =
        (payment) => {

            updatePaymentStatus(
                payment,
                "Failed"
            );

        };


    /* =====================================================
       VIEW PAYMENT
    ===================================================== */

    const handleViewPayment =
        (payment) => {

            setSelectedPayment(
                payment
            );

        };


    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    const closeModal = () => {

        setSelectedPayment(
            null
        );

    };


    /* =====================================================
       FORMAT AMOUNT
    ===================================================== */

    const formatAmount =
        (amount) => {

            return `₹${Number(
                amount || 0
            ).toLocaleString(
                "en-IN"
            )}`;

        };


    /* =====================================================
       SUCCESS RATE
    ===================================================== */

    const successRate =
        payments.length > 0

            ? Math.round(
                (
                    statistics.successful /
                    payments.length
                ) *
                100
            )

            : 0;


    /* =====================================================
       AVERAGE PAYMENT
    ===================================================== */

    const averagePayment =
        statistics.successful > 0

            ? Math.round(
                statistics.totalRevenue /
                statistics.successful
            )

            : 0;


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="admin-payments-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">


                {/* LOGO */}

                <div className="admin-sidebar-logo">

                    <Link to="/">

                        <span className="admin-logo-icon">
                            📚
                        </span>

                        <div>

                            <strong>
                                LibraSpace
                            </strong>

                            <small>
                                Admin Portal
                            </small>

                        </div>

                    </Link>

                </div>


                {/* NAVIGATION */}

                <nav className="admin-navigation">


                    <p className="admin-nav-title">
                        MAIN MENU
                    </p>


                    {/* DASHBOARD */}

                    <Link
                        to="/admin/dashboard"
                        className={`admin-nav-link ${isActive(
                            "/admin/dashboard"
                        )}`}
                    >

                        <span>
                            📊
                        </span>

                        Dashboard

                    </Link>


                    {/* MANAGE SEATS */}

                    <Link
                        to="/admin/seats"
                        className={`admin-nav-link ${isActive(
                            "/admin/seats"
                        )}`}
                    >

                        <span>
                            💺
                        </span>

                        Manage Seats

                    </Link>


                    {/* RESERVATIONS */}

                    <Link
                        to="/admin/reservations"
                        className={`admin-nav-link ${isActive(
                            "/admin/reservations"
                        )}`}
                    >

                        <span>
                            📅
                        </span>

                        Reservations

                    </Link>


                    {/* MANAGEMENT */}

                    <p className="admin-nav-title second-title">
                        MANAGEMENT
                    </p>


                    {/* MEMBERS */}

                    <Link
                        to="/admin/members"
                        className={`admin-nav-link ${isActive(
                            "/admin/members"
                        )}`}
                    >

                        <span>
                            👥
                        </span>

                        Members

                    </Link>


                    {/* MEMBERSHIPS */}

                    <Link
                        to="/admin/memberships"
                        className={`admin-nav-link ${isActive(
                            "/admin/memberships"
                        )}`}
                    >

                        <span>
                            🎫
                        </span>

                        Memberships

                    </Link>


                    {/* PAYMENTS */}

                    <Link
                        to="/admin/payments"
                        className={`admin-nav-link ${isActive(
                            "/admin/payments"
                        )}`}
                    >

                        <span>
                            💳
                        </span>

                        Payments

                    </Link>


                    {/* REPORTS */}

                    <Link
                        to="/admin/reports"
                        className={`admin-nav-link ${isActive(
                            "/admin/reports"
                        )}`}
                    >

                        <span>
                            📈
                        </span>

                        Reports

                    </Link>


                    {/* SYSTEM */}

                    <p className="admin-nav-title second-title">
                        SYSTEM
                    </p>


                    {/* SETTINGS */}

                    <Link
                        to="/admin/settings"
                        className={`admin-nav-link ${isActive(
                            "/admin/settings"
                        )}`}
                    >

                        <span>
                            ⚙️
                        </span>

                        Settings

                    </Link>

                </nav>


                {/* LOGOUT */}

                <div className="admin-sidebar-bottom">

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={
                            handleLogout
                        }
                    >

                        <span>
                            🚪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="admin-main">


                {/* TOPBAR */}

                <header className="admin-topbar">


                    <div className="admin-topbar-left">

                        <span className="admin-page-label">
                            ADMINISTRATOR
                        </span>

                        <h1>
                            Payment Management
                        </h1>

                    </div>


                    <div className="admin-topbar-right">


                        <button
                            type="button"
                            className="admin-notification"
                            title="Notifications"
                        >

                            🔔

                            <span></span>

                        </button>


                        <div className="admin-profile">

                            <div className="admin-avatar">

                                {adminName
                                    .charAt(0)
                                    .toUpperCase()}

                            </div>


                            <div className="admin-profile-info">

                                <strong>
                                    {adminName}
                                </strong>

                                <small>
                                    {adminEmail}
                                </small>

                            </div>

                        </div>

                    </div>

                </header>


                {/* CONTENT */}

                <div className="admin-content">


                    {/* BREADCRUMB */}

                    <div className="admin-breadcrumb">

                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <span>
                            ›
                        </span>

                        <span>
                            Payments
                        </span>

                    </div>


                    {/* PAGE HEADER */}

                    <section className="page-header">

                        <div>

                            <span className="page-label">
                                FINANCIAL MANAGEMENT
                            </span>

                            <h2>
                                Payment Transactions
                            </h2>

                            <p>
                                Monitor membership payments and transaction
                                activity across LibraSpace.
                            </p>

                        </div>


                        <div className="payment-security-badge">

                            <span>
                                🛡️
                            </span>

                            <div>

                                <strong>
                                    Secure Payments
                                </strong>

                                <small>
                                    Razorpay Test Mode
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <section className="payment-stat-grid">


                        <div className="payment-stat-card revenue-card">

                            <div className="payment-stat-icon">
                                ₹
                            </div>

                            <div className="payment-stat-content">

                                <span>
                                    Total Revenue
                                </span>

                                <h3>
                                    {formatAmount(
                                        statistics.totalRevenue
                                    )}
                                </h3>

                                <small>
                                    Successful payments
                                </small>

                            </div>

                        </div>


                        <div className="payment-stat-card success-card">

                            <div className="payment-stat-icon">
                                ✓
                            </div>

                            <div className="payment-stat-content">

                                <span>
                                    Successful Payments
                                </span>

                                <h3>
                                    {statistics.successful}
                                </h3>

                                <small>
                                    Transactions completed
                                </small>

                            </div>

                        </div>


                        <div className="payment-stat-card pending-card">

                            <div className="payment-stat-icon">
                                ◷
                            </div>

                            <div className="payment-stat-content">

                                <span>
                                    Pending Payments
                                </span>

                                <h3>
                                    {statistics.pending}
                                </h3>

                                <small>
                                    {formatAmount(
                                        statistics.pendingAmount
                                    )} pending
                                </small>

                            </div>

                        </div>


                        <div className="payment-stat-card failed-card">

                            <div className="payment-stat-icon">
                                ×
                            </div>

                            <div className="payment-stat-content">

                                <span>
                                    Failed Payments
                                </span>

                                <h3>
                                    {statistics.failed}
                                </h3>

                                <small>
                                    Requires attention
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        OVERVIEW
                    ================================================= */}

                    <section className="payment-overview">


                        <div className="overview-card">

                            <div className="overview-icon">
                                📊
                            </div>

                            <div>

                                <span>
                                    Payment Success Rate
                                </span>

                                <strong>
                                    {successRate}%
                                </strong>

                            </div>

                            <div className="overview-progress">

                                <div
                                    className="overview-progress-bar"
                                    style={{
                                        width:
                                            `${successRate}%`
                                    }}
                                ></div>

                            </div>

                        </div>


                        <div className="overview-card">

                            <div className="overview-icon">
                                💰
                            </div>

                            <div>

                                <span>
                                    Average Payment
                                </span>

                                <strong>
                                    {formatAmount(
                                        averagePayment
                                    )}
                                </strong>

                            </div>

                            <p>
                                Per successful transaction
                            </p>

                        </div>


                        <div className="overview-card">

                            <div className="overview-icon">
                                📅
                            </div>

                            <div>

                                <span>
                                    Transactions
                                </span>

                                <strong>
                                    {payments.length}
                                </strong>

                            </div>

                            <p>
                                Total recorded payments
                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        PAYMENT PANEL
                    ================================================= */}

                    <section className="payments-panel">


                        <div className="panel-header">

                            <div>

                                <h3>
                                    Payment Transactions
                                </h3>

                                <p>
                                    View and manage all membership payments.
                                </p>

                            </div>


                            <div className="transaction-count">

                                🧾

                                {filteredPayments.length}
                                {" "}Transactions

                            </div>

                        </div>


                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <div className="payment-filters">


                            {/* SEARCH */}

                            <div className="payment-search">

                                <span>
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search payment ID, member, email or transaction..."
                                    value={
                                        searchTerm
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                />


                                {searchTerm && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearchTerm(
                                                ""
                                            )
                                        }
                                        className="clear-search"
                                    >

                                        ×

                                    </button>

                                )}

                            </div>


                            {/* STATUS */}

                            <div className="filter-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="All">
                                        All Status
                                    </option>

                                    <option value="Successful">
                                        Successful
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Failed">
                                        Failed
                                    </option>

                                </select>

                            </div>


                            {/* TYPE */}

                            <div className="filter-group">

                                <label>
                                    Type
                                </label>

                                <select
                                    value={
                                        typeFilter
                                    }
                                    onChange={(e) =>
                                        setTypeFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="All">
                                        All Types
                                    </option>

                                    <option value="Membership">
                                        Membership
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================= */}

                        {error && (

                            <div
                                style={{
                                    padding: "16px",
                                    marginBottom: "20px",
                                    borderRadius: "10px",
                                    background:
                                        "#fdf0f0",
                                    color:
                                        "#b45353",
                                    border:
                                        "1px solid #efcccc"
                                }}
                            >

                                {error}

                                <button
                                    type="button"
                                    onClick={
                                        loadPayments
                                    }
                                    style={{
                                        marginLeft: "12px",
                                        cursor:
                                            "pointer"
                                    }}
                                >

                                    Retry

                                </button>

                            </div>

                        )}


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="payments-table-wrapper">

                            <table className="payments-table">


                                <thead>

                                    <tr>

                                        <th>
                                            Payment
                                        </th>

                                        <th>
                                            Member
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Method
                                        </th>

                                        <th>
                                            Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="empty-state"
                                            >

                                                <div className="empty-icon">
                                                    ⏳
                                                </div>

                                                <h3>
                                                    Loading payments...
                                                </h3>

                                                <p>
                                                    Fetching payment data from MongoDB.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : filteredPayments.length > 0 ? (

                                        filteredPayments.map(
                                            (
                                                payment
                                            ) => (

                                                <tr
                                                    key={
                                                        payment._id ||
                                                        payment.id
                                                    }
                                                >

                                                    {/* PAYMENT */}

                                                    <td>

                                                        <div className="payment-id-cell">

                                                            <div className="payment-icon">
                                                                🧾
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {payment.id}
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        payment.transactionId
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* MEMBER */}

                                                    <td>

                                                        <div className="member-cell">

                                                            <div className="member-avatar">

                                                                {String(
                                                                    payment.member ||
                                                                    "M"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        payment.member
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        payment.studentId
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* TYPE */}

                                                    <td>

                                                        <div className="type-cell">

                                                            <strong>
                                                                {
                                                                    payment.type
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    payment.plan
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* AMOUNT */}

                                                    <td>

                                                        <strong className="amount-cell">

                                                            {
                                                                formatAmount(
                                                                    payment.amount
                                                                )
                                                            }

                                                        </strong>

                                                    </td>


                                                    {/* METHOD */}

                                                    <td>

                                                        <div className="method-cell">

                                                            <span>
                                                                💳
                                                            </span>

                                                            <span>
                                                                {
                                                                    payment.method
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* DATE */}

                                                    <td>

                                                        <div className="date-cell">

                                                            <strong>
                                                                {
                                                                    payment.date
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    payment.time
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={`payment-status ${String(
                                                                payment.status
                                                            )
                                                                .toLowerCase()
                                                                .replace(
                                                                    " ",
                                                                    "-"
                                                                )}`}
                                                        >

                                                            {payment.status ===
                                                                "Successful" &&
                                                                "✓"}

                                                            {payment.status ===
                                                                "Pending" &&
                                                                "◷"}

                                                            {payment.status ===
                                                                "Failed" &&
                                                                "×"}

                                                            {" "}

                                                            {
                                                                payment.status
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <div className="payment-actions">


                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                className="table-action view-action"
                                                                title="View Payment"
                                                                onClick={() =>
                                                                    handleViewPayment(
                                                                        payment
                                                                    )
                                                                }
                                                            >

                                                                👁

                                                            </button>


                                                            {/* SUCCESS */}

                                                            {payment.status ===
                                                                "Pending" && (

                                                                <button
                                                                    type="button"
                                                                    className="table-action success-action"
                                                                    title="Mark Successful"
                                                                    onClick={() =>
                                                                        handleMarkSuccessful(
                                                                            payment
                                                                        )
                                                                    }
                                                                >

                                                                    ✓

                                                                </button>

                                                            )}


                                                            {/* FAILED */}

                                                            {payment.status ===
                                                                "Pending" && (

                                                                <button
                                                                    type="button"
                                                                    className="table-action fail-action"
                                                                    title="Mark Failed"
                                                                    onClick={() =>
                                                                        handleMarkFailed(
                                                                            payment
                                                                        )
                                                                    }
                                                                >

                                                                    ×

                                                                </button>

                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            )

                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="empty-state"
                                            >

                                                <div className="empty-icon">
                                                    🧾
                                                </div>

                                                <h3>
                                                    No payments found
                                                </h3>

                                                <p>
                                                    Try changing your search
                                                    or filter options.
                                                </p>

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* TABLE FOOTER */}

                        <div className="table-footer">

                            <span>

                                Showing{" "}

                                <strong>
                                    {
                                        filteredPayments.length
                                    }
                                </strong>

                                {" "}of{" "}

                                <strong>
                                    {
                                        payments.length
                                    }
                                </strong>

                                {" "}payments

                            </span>


                            <div className="footer-info">

                                🛡️

                                Payments are securely processed
                                through Razorpay

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        PAYMENT INFORMATION
                    ================================================= */}

                    <section className="payment-info-section">

                        <div className="info-icon">
                            ℹ️
                        </div>

                        <div>

                            <h4>
                                Payment Management
                            </h4>

                            <p>
                                Payment records displayed here are
                                retrieved from the LibraSpace backend
                                and stored in MongoDB.
                            </p>

                        </div>

                    </section>


                    {/* FOOTER */}

                    <footer className="admin-footer">

                        <span>
                            © 2026 LibraSpace. Admin Portal.
                        </span>

                        <div>

                            <span>
                                Payment system
                            </span>

                            <span className="footer-status">
                                ● Operational
                            </span>

                        </div>

                    </footer>

                </div>

            </main>


            {/* =================================================
                PAYMENT MODAL
            ================================================= */}

            {selectedPayment && (

                <div
                    className="payment-modal-overlay"
                    onClick={
                        closeModal
                    }
                >

                    <div
                        className="payment-modal"
                        onClick={(
                            e
                        ) =>
                            e.stopPropagation()
                        }
                    >


                        {/* MODAL HEADER */}

                        <div className="modal-header">

                            <div>

                                <span>
                                    PAYMENT DETAILS
                                </span>

                                <h3>
                                    {
                                        selectedPayment.id
                                    }
                                </h3>

                            </div>


                            <button
                                type="button"
                                className="modal-close"
                                onClick={
                                    closeModal
                                }
                            >

                                ×

                            </button>

                        </div>


                        {/* SUMMARY */}

                        <div className="modal-payment-summary">

                            <div className="modal-payment-icon">
                                ₹
                            </div>


                            <div>

                                <span>
                                    Payment Amount
                                </span>

                                <strong>
                                    {
                                        formatAmount(
                                            selectedPayment.amount
                                        )
                                    }
                                </strong>

                            </div>


                            <span
                                className={`payment-status ${String(
                                    selectedPayment.status
                                )
                                    .toLowerCase()
                                    .replace(
                                        " ",
                                        "-"
                                    )}`}
                            >

                                {
                                    selectedPayment.status
                                }

                            </span>

                        </div>


                        {/* DETAILS */}

                        <div className="modal-details-grid">


                            <div className="detail-item">

                                <span>
                                    Member
                                </span>

                                <strong>
                                    {
                                        selectedPayment.member
                                    }
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Student ID
                                </span>

                                <strong>
                                    {
                                        selectedPayment.studentId
                                    }
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {
                                        selectedPayment.email
                                    }
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Type
                                </span>

                                <strong>
                                    {
                                        selectedPayment.type
                                    }
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Membership Plan
                                </span>

                                <strong>
                                    {
                                        selectedPayment.plan
                                    }
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    {
                                        selectedPayment.method
                                    }
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Date
                                </span>

                                <strong>
                                    {
                                        selectedPayment.date
                                    }
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Time
                                </span>

                                <strong>
                                    {
                                        selectedPayment.time
                                    }
                                </strong>

                            </div>


                            <div className="detail-item full-width">

                                <span>
                                    Transaction ID
                                </span>

                                <strong className="transaction-value">
                                    {
                                        selectedPayment.transactionId
                                    }
                                </strong>

                            </div>

                        </div>


                        {/* SECURITY */}

                        <div className="modal-security">

                            🔒

                            <span>
                                Payment information is protected and
                                processed securely.
                            </span>

                        </div>


                        {/* ACTIONS */}

                        <div className="modal-actions">

                            <button
                                type="button"
                                className="modal-secondary-button"
                                onClick={
                                    closeModal
                                }
                            >

                                Close

                            </button>


                            {selectedPayment.status ===
                                "Pending" && (

                                <button
                                    type="button"
                                    className="modal-success-button"
                                    onClick={() =>
                                        handleMarkSuccessful(
                                            selectedPayment
                                        )
                                    }
                                >

                                    ✓

                                    Mark Successful

                                </button>

                            )}

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default AdminPayments;