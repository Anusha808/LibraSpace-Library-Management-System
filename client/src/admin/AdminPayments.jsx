import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminPayments.css";

function AdminPayments() {

    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const handleLogout = () => {
        navigate("/admin/login");
    };

    const [payments, setPayments] = useState([
        {
            id: "PAY-001",
            member: "Ananya Sharma",
            studentId: "LIB2026001",
            email: "ananya.sharma@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "12 Sep 2026",
            time: "10:32 AM",
            status: "Successful",
            transactionId: "pay_RZP001ANU",
        },
        {
            id: "PAY-002",
            member: "Rahul Kumar",
            studentId: "LIB2026002",
            email: "rahul.kumar@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "12 Sep 2026",
            time: "09:45 AM",
            status: "Successful",
            transactionId: "pay_RZP002RAH",
        },
        {
            id: "PAY-003",
            member: "Priya Nair",
            studentId: "LIB2026003",
            email: "priya.nair@gmail.com",
            type: "Membership",
            plan: "Basic Reader",
            amount: 299,
            method: "Razorpay",
            date: "11 Sep 2026",
            time: "04:20 PM",
            status: "Successful",
            transactionId: "pay_RZP003PRI",
        },
        {
            id: "PAY-004",
            member: "Arjun Menon",
            studentId: "LIB2026004",
            email: "arjun.menon@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "10 Sep 2026",
            time: "02:15 PM",
            status: "Successful",
            transactionId: "pay_RZP004ARJ",
        },
        {
            id: "PAY-005",
            member: "Sneha Reddy",
            studentId: "LIB2026005",
            email: "sneha.reddy@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "10 Sep 2026",
            time: "11:05 AM",
            status: "Failed",
            transactionId: "pay_RZP005SNE",
        },
        {
            id: "PAY-006",
            member: "Vikram Singh",
            studentId: "LIB2026006",
            email: "vikram.singh@gmail.com",
            type: "Membership",
            plan: "Basic Reader",
            amount: 299,
            method: "Razorpay",
            date: "09 Sep 2026",
            time: "05:40 PM",
            status: "Pending",
            transactionId: "pay_RZP006VIK",
        },
        {
            id: "PAY-007",
            member: "Meera Iyer",
            studentId: "LIB2026007",
            email: "meera.iyer@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "08 Sep 2026",
            time: "01:25 PM",
            status: "Successful",
            transactionId: "pay_RZP007MEE",
        },
        {
            id: "PAY-008",
            member: "Karan Patel",
            studentId: "LIB2026008",
            email: "karan.patel@gmail.com",
            type: "Membership",
            plan: "Basic Reader",
            amount: 299,
            method: "Razorpay",
            date: "07 Sep 2026",
            time: "10:50 AM",
            status: "Successful",
            transactionId: "pay_RZP008KAR",
        },
        {
            id: "PAY-009",
            member: "Divya Krishnan",
            studentId: "LIB2026009",
            email: "divya.krishnan@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "06 Sep 2026",
            time: "03:30 PM",
            status: "Successful",
            transactionId: "pay_RZP009DIV",
        },
        {
            id: "PAY-010",
            member: "Aditya Rao",
            studentId: "LIB2026010",
            email: "aditya.rao@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "05 Sep 2026",
            time: "12:10 PM",
            status: "Pending",
            transactionId: "pay_RZP010ADI",
        },
        {
            id: "PAY-011",
            member: "Nisha Kapoor",
            studentId: "LIB2026011",
            email: "nisha.kapoor@gmail.com",
            type: "Membership",
            plan: "Basic Reader",
            amount: 299,
            method: "Razorpay",
            date: "04 Sep 2026",
            time: "09:15 AM",
            status: "Failed",
            transactionId: "pay_RZP011NIS",
        },
        {
            id: "PAY-012",
            member: "Rohan Das",
            studentId: "LIB2026012",
            email: "rohan.das@gmail.com",
            type: "Membership",
            plan: "Premium Reader",
            amount: 499,
            method: "Razorpay",
            date: "03 Sep 2026",
            time: "04:45 PM",
            status: "Successful",
            transactionId: "pay_RZP012ROH",
        },
    ]);

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");
    const [selectedPayment, setSelectedPayment] = useState(null);

    const statistics = useMemo(() => {

        const successfulPayments = payments.filter(
            payment => payment.status === "Successful"
        );

        const pendingPayments = payments.filter(
            payment => payment.status === "Pending"
        );

        const failedPayments = payments.filter(
            payment => payment.status === "Failed"
        );

        const totalRevenue = successfulPayments.reduce(
            (total, payment) => total + payment.amount,
            0
        );

        const pendingAmount = pendingPayments.reduce(
            (total, payment) => total + payment.amount,
            0
        );

        return {
            totalRevenue,
            successful: successfulPayments.length,
            pending: pendingPayments.length,
            failed: failedPayments.length,
            pendingAmount,
        };

    }, [payments]);

    const filteredPayments = useMemo(() => {

        return payments.filter(payment => {

            const search = searchTerm.toLowerCase();

            const matchesSearch =
                payment.id.toLowerCase().includes(search) ||
                payment.member.toLowerCase().includes(search) ||
                payment.studentId.toLowerCase().includes(search) ||
                payment.email.toLowerCase().includes(search) ||
                payment.transactionId.toLowerCase().includes(search);

            const matchesStatus =
                statusFilter === "All" ||
                payment.status === statusFilter;

            const matchesType =
                typeFilter === "All" ||
                payment.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;

        });

    }, [payments, searchTerm, statusFilter, typeFilter]);

    const handleMarkSuccessful = (paymentId) => {

        setPayments(prevPayments =>
            prevPayments.map(payment =>
                payment.id === paymentId
                    ? {
                        ...payment,
                        status: "Successful",
                    }
                    : payment
            )
        );

        alert("Payment marked as successful.");
    };

    const handleMarkFailed = (paymentId) => {

        setPayments(prevPayments =>
            prevPayments.map(payment =>
                payment.id === paymentId
                    ? {
                        ...payment,
                        status: "Failed",
                    }
                    : payment
            )
        );

        alert("Payment marked as failed.");
    };

    const handleViewPayment = (payment) => {
        setSelectedPayment(payment);
    };

    const closeModal = () => {
        setSelectedPayment(null);
    };

    const formatAmount = (amount) => {
        return `₹${amount.toLocaleString("en-IN")}`;
    };

    const successRate =
        payments.length > 0
            ? Math.round(
                (statistics.successful / payments.length) * 100
            )
            : 0;

    const averagePayment =
        statistics.successful > 0
            ? Math.round(
                statistics.totalRevenue /
                statistics.successful
            )
            : 0;

    return (
        <div className="admin-payments-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="admin-sidebar">

                <div className="admin-sidebar-logo">

                    <Link to="/">

                        <span className="admin-logo-icon">
                            📚
                        </span>

                        <div>
                            <strong>LibraSpace</strong>
                            <small>Admin Portal</small>
                        </div>

                    </Link>

                </div>

                <nav className="admin-navigation">

                    <p className="admin-nav-title">
                        MAIN MENU
                    </p>

                    <Link
                        to="/admin/dashboard"
                        className={`admin-nav-link ${isActive(
                            "/admin/dashboard"
                        )}`}
                    >
                        <span>📊</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/books"
                        className={`admin-nav-link ${isActive(
                            "/admin/books"
                        )}`}
                    >
                        <span>📚</span>
                        Manage Books
                    </Link>

                    <Link
                        to="/admin/seats"
                        className={`admin-nav-link ${isActive(
                            "/admin/seats"
                        )}`}
                    >
                        <span>💺</span>
                        Manage Seats
                    </Link>

                    <Link
                        to="/admin/reservations"
                        className={`admin-nav-link ${isActive(
                            "/admin/reservations"
                        )}`}
                    >
                        <span>📅</span>
                        Reservations
                    </Link>

                    <p className="admin-nav-title second-title">
                        MANAGEMENT
                    </p>

                    <Link
                        to="/admin/members"
                        className={`admin-nav-link ${isActive(
                            "/admin/members"
                        )}`}
                    >
                        <span>👥</span>
                        Members
                    </Link>

                    <Link
                        to="/admin/memberships"
                        className={`admin-nav-link ${isActive(
                            "/admin/memberships"
                        )}`}
                    >
                        <span>🎫</span>
                        Memberships
                    </Link>

                    <Link
                        to="/admin/payments"
                        className={`admin-nav-link ${isActive(
                            "/admin/payments"
                        )}`}
                    >
                        <span>💳</span>
                        Payments
                    </Link>

                    <Link
                        to="/admin/reports"
                        className={`admin-nav-link ${isActive(
                            "/admin/reports"
                        )}`}
                    >
                        <span>📈</span>
                        Reports
                    </Link>

                    <p className="admin-nav-title second-title">
                        SYSTEM
                    </p>

                    <Link
                        to="/admin/settings"
                        className={`admin-nav-link ${isActive(
                            "/admin/settings"
                        )}`}
                    >
                        <span>⚙️</span>
                        Settings
                    </Link>

                </nav>

                <div className="admin-sidebar-bottom">

                    

                    <button
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        <span>🚪</span>
                        Logout
                    </button>

                </div>

            </aside>


            {/* ================= MAIN ================= */}

            <main className="admin-main">

                {/* ================= TOPBAR ================= */}

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
                            className="admin-notification"
                            title="Notifications"
                        >
                            🔔
                            <span></span>
                        </button>

                        <div className="admin-profile">

                            <div className="admin-avatar">
                                A
                            </div>

                            <div className="admin-profile-info">

                                <strong>
                                    Administrator
                                </strong>

                                <small>
                                    admin@libraspace.com
                                </small>

                            </div>

                        </div>

                    </div>

                </header>


                {/* ================= CONTENT ================= */}

                <div className="admin-content">

                    {/* BREADCRUMB */}

                    <div className="admin-breadcrumb">

                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <span>›</span>

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


                    {/* ================= STATISTICS ================= */}

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
                                    ↑ This month
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


                    {/* ================= OVERVIEW ================= */}

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
                                        width: `${successRate}%`
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


                    {/* ================= PAYMENT TABLE ================= */}

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


                        {/* FILTERS */}

                        <div className="payment-filters">

                            <div className="payment-search">

                                <span>
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search payment ID, member, email or transaction..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                />

                                {searchTerm && (

                                    <button
                                        onClick={() =>
                                            setSearchTerm("")
                                        }
                                        className="clear-search"
                                    >
                                        ×
                                    </button>

                                )}

                            </div>


                            <div className="filter-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    value={statusFilter}
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


                            <div className="filter-group">

                                <label>
                                    Type
                                </label>

                                <select
                                    value={typeFilter}
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


                        {/* TABLE */}

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

                                    {filteredPayments.length > 0 ? (

                                        filteredPayments.map(
                                            payment => (

                                                <tr key={payment.id}>

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
                                                                    {payment.transactionId}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="member-cell">

                                                            <div className="member-avatar">
                                                                {payment.member
                                                                    .charAt(0)}
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {payment.member}
                                                                </strong>

                                                                <span>
                                                                    {payment.studentId}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="type-cell">

                                                            <strong>
                                                                {payment.type}
                                                            </strong>

                                                            <span>
                                                                {payment.plan}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <strong className="amount-cell">
                                                            {formatAmount(
                                                                payment.amount
                                                            )}
                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <div className="method-cell">

                                                            <span>
                                                                💳
                                                            </span>

                                                            <span>
                                                                {payment.method}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="date-cell">

                                                            <strong>
                                                                {payment.date}
                                                            </strong>

                                                            <span>
                                                                {payment.time}
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`payment-status ${payment.status
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
                                                            {payment.status}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="payment-actions">

                                                            <button
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


                                                            {payment.status ===
                                                                "Pending" && (

                                                                <button
                                                                    className="table-action success-action"
                                                                    title="Mark Successful"
                                                                    onClick={() =>
                                                                        handleMarkSuccessful(
                                                                            payment.id
                                                                        )
                                                                    }
                                                                >
                                                                    ✓
                                                                </button>

                                                            )}


                                                            {payment.status ===
                                                                "Pending" && (

                                                                <button
                                                                    className="table-action fail-action"
                                                                    title="Mark Failed"
                                                                    onClick={() =>
                                                                        handleMarkFailed(
                                                                            payment.id
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
                                    {filteredPayments.length}
                                </strong>{" "}
                                of{" "}
                                <strong>
                                    {payments.length}
                                </strong>{" "}
                                payments

                            </span>

                            <div className="footer-info">

                                🛡️

                                Payments are securely processed
                                through Razorpay

                            </div>

                        </div>

                    </section>


                    {/* ================= INFORMATION ================= */}

                    <section className="payment-info-section">

                        <div className="info-icon">
                            ℹ️
                        </div>

                        <div>

                            <h4>
                                Payment Management
                            </h4>

                            <p>
                                This page currently displays demo payment
                                transactions for the LibraSpace frontend.
                                Razorpay Test Mode can be connected later
                                when the backend payment API is configured.
                            </p>

                        </div>

                    </section>


                    {/* ================= FOOTER ================= */}

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


            {/* ================= PAYMENT MODAL ================= */}

            {selectedPayment && (

                <div
                    className="payment-modal-overlay"
                    onClick={closeModal}
                >

                    <div
                        className="payment-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <span>
                                    PAYMENT DETAILS
                                </span>

                                <h3>
                                    {selectedPayment.id}
                                </h3>

                            </div>

                            <button
                                className="modal-close"
                                onClick={closeModal}
                            >
                                ×
                            </button>

                        </div>


                        <div className="modal-payment-summary">

                            <div className="modal-payment-icon">
                                ₹
                            </div>

                            <div>

                                <span>
                                    Payment Amount
                                </span>

                                <strong>
                                    {formatAmount(
                                        selectedPayment.amount
                                    )}
                                </strong>

                            </div>

                            <span
                                className={`payment-status ${selectedPayment.status
                                    .toLowerCase()
                                    .replace(
                                        " ",
                                        "-"
                                    )}`}
                            >
                                {selectedPayment.status}
                            </span>

                        </div>


                        <div className="modal-details-grid">

                            <div className="detail-item">

                                <span>
                                    Member
                                </span>

                                <strong>
                                    {selectedPayment.member}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Student ID
                                </span>

                                <strong>
                                    {selectedPayment.studentId}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Email
                                </span>

                                <strong>
                                    {selectedPayment.email}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Type
                                </span>

                                <strong>
                                    {selectedPayment.type}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Membership Plan
                                </span>

                                <strong>
                                    {selectedPayment.plan}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Method
                                </span>

                                <strong>
                                    {selectedPayment.method}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Date
                                </span>

                                <strong>
                                    {selectedPayment.date}
                                </strong>

                            </div>


                            <div className="detail-item">

                                <span>
                                    Payment Time
                                </span>

                                <strong>
                                    {selectedPayment.time}
                                </strong>

                            </div>


                            <div className="detail-item full-width">

                                <span>
                                    Transaction ID
                                </span>

                                <strong className="transaction-value">
                                    {selectedPayment.transactionId}
                                </strong>

                            </div>

                        </div>


                        <div className="modal-security">

                            🔒

                            <span>
                                Payment information is protected and
                                processed securely.
                            </span>

                        </div>


                        <div className="modal-actions">

                            <button
                                className="modal-secondary-button"
                                onClick={closeModal}
                            >
                                Close
                            </button>

                            {selectedPayment.status ===
                                "Pending" && (

                                <button
                                    className="modal-success-button"
                                    onClick={() => {

                                        handleMarkSuccessful(
                                            selectedPayment.id
                                        );

                                        setSelectedPayment(
                                            null
                                        );

                                    }}
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