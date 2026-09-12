import { Link } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
    return (
        <div className="dashboard-page">

            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="dashboard-sidebar">

                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">
                        📚
                    </div>

                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>
                </div>


                <div className="sidebar-section-title">
                    MAIN MENU
                </div>


                <nav className="sidebar-nav">

                    <Link
                        to="/dashboard"
                        className="sidebar-link active"
                    >
                        <span className="sidebar-icon">⌂</span>
                        <span>Dashboard</span>
                    </Link>


                    <Link
                        to="/seats"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">💺</span>
                        <span>Reserve Seat</span>
                    </Link>


                    <Link
                        to="/reservations"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">▣</span>
                        <span>My Reservations</span>
                    </Link>


                    <Link
                        to="/membership"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">♛</span>
                        <span>Membership</span>
                    </Link>

                </nav>


                <div className="sidebar-section-title">
                    ACCOUNT
                </div>


                <nav className="sidebar-nav">

                    <Link
                        to="/profile"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">◯</span>
                        <span>My Profile</span>
                    </Link>


                    <Link
                        to="/payment-history"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">▤</span>
                        <span>Payment History</span>
                    </Link>

                </nav>


                <div className="sidebar-bottom">

                    <div className="library-status">

                        <div className="status-dot"></div>

                        <div>
                            <strong>Library Open</strong>
                            <span>Today · 8:00 AM - 10:00 PM</span>
                        </div>

                    </div>


                    <Link
                        to="/"
                        className="logout-link"
                    >
                        <span>↪</span>
                        Logout
                    </Link>

                </div>

            </aside>


            {/* =========================================
                MAIN AREA
            ========================================= */}

            <div className="dashboard-content">


                {/* =========================================
                    TOPBAR
                ========================================= */}

                <header className="dashboard-topbar">

                    <div className="mobile-logo">
                        📚 <strong>LibraSpace</strong>
                    </div>


                    <div className="topbar-left">

                        <span className="page-label">
                            STUDENT PORTAL
                        </span>

                        <h2>
                            Dashboard
                        </h2>

                    </div>


                    <div className="topbar-right">

                        <button
                            className="notification-btn"
                            type="button"
                            aria-label="Notifications"
                        >
                            🔔
                            <span className="notification-dot"></span>
                        </button>


                        <Link
                            to="/profile"
                            className="top-profile"
                        >

                            <div className="top-avatar">
                                A
                            </div>

                            <div className="top-profile-info">

                                <strong>
                                    Student
                                </strong>

                                <span>
                                    Library Member
                                </span>

                            </div>

                            <span className="profile-arrow">
                                ▾
                            </span>

                        </Link>

                    </div>

                </header>


                {/* =========================================
                    MAIN CONTENT
                ========================================= */}

                <main className="dashboard-main">


                    {/* =====================================
                        WELCOME BANNER
                    ===================================== */}

                    <section className="welcome-banner">

                        <div className="welcome-content">

                            <span className="welcome-tag">
                                GOOD MORNING
                            </span>

                            <h1>
                                Welcome back, Student! 👋
                            </h1>

                            <p>
                                Everything you need to manage your
                                library experience is right here.
                            </p>

                            <Link
                                to="/seats"
                                className="welcome-button"
                            >
                                Reserve a Seat
                                <span>→</span>
                            </Link>

                        </div>


                        <div className="welcome-illustration">

                            <div className="illustration-circle"></div>

                            <div className="illustration-book book-1">
                                📕
                            </div>

                            <div className="illustration-book book-2">
                                📗
                            </div>

                            <div className="illustration-book book-3">
                                📘
                            </div>

                            <div className="illustration-lamp">
                                💡
                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        STATISTICS
                    ===================================== */}

                    <section className="stats-grid">


                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon seat-icon">
                                    💺
                                </div>

                                <span className="stat-trend positive">
                                    ● Active
                                </span>

                            </div>

                            <div className="professional-stat-value">
                                A12
                            </div>

                            <div className="professional-stat-label">
                                Current Seat
                            </div>

                            <div className="stat-description">
                                Today · 10:00 AM
                            </div>

                        </div>


                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon reservation-icon">
                                    📅
                                </div>

                                <span className="stat-trend">
                                    +3 this month
                                </span>

                            </div>

                            <div className="professional-stat-value">
                                12
                            </div>

                            <div className="professional-stat-label">
                                Total Reservations
                            </div>

                            <div className="stat-description">
                                Successful bookings
                            </div>

                        </div>


                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon membership-icon">
                                    ♛
                                </div>

                                <span className="stat-trend positive">
                                    ● Active
                                </span>

                            </div>

                            <div className="professional-stat-value">
                                Premium
                            </div>

                            <div className="professional-stat-label">
                                Membership Plan
                            </div>

                            <div className="stat-description">
                                Premium Reader
                            </div>

                        </div>


                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon expiry-icon">
                                    ⏳
                                </div>

                                <span className="stat-trend warning">
                                    Renew soon
                                </span>

                            </div>

                            <div className="professional-stat-value">
                                28 Days
                            </div>

                            <div className="professional-stat-label">
                                Membership Remaining
                            </div>

                            <div className="stat-description">
                                Expires 10 Oct 2026
                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        MAIN DASHBOARD GRID
                    ===================================== */}

                    <section className="dashboard-grid">


                        {/* =================================
                            UPCOMING RESERVATION
                        ================================= */}

                        <div className="professional-card reservation-card">

                            <div className="professional-card-header">

                                <div>

                                    <span className="card-eyebrow">
                                        UPCOMING
                                    </span>

                                    <h3>
                                        Next Reservation
                                    </h3>

                                </div>

                                <Link
                                    to="/reservations"
                                    className="view-link"
                                >
                                    View all →
                                </Link>

                            </div>


                            <div className="next-reservation">

                                <div className="reservation-calendar">

                                    <span>
                                        SEP
                                    </span>

                                    <strong>
                                        18
                                    </strong>

                                    <small>
                                        2026
                                    </small>

                                </div>


                                <div className="reservation-main">

                                    <h4>
                                        Library Study Session
                                    </h4>

                                    <div className="reservation-meta">
                                        <span>💺 Seat A12</span>
                                        <span>🕐 10:00 AM - 1:00 PM</span>
                                    </div>

                                    <span className="confirmed-status">
                                        ✓ Confirmed
                                    </span>

                                </div>

                            </div>


                            <div className="reservation-actions">

                                <Link
                                    to="/reservations"
                                    className="outline-button"
                                >
                                    Manage Reservation
                                </Link>

                                <Link
                                    to="/seats"
                                    className="small-primary-button"
                                >
                                    Book Another
                                </Link>

                            </div>

                        </div>


                        {/* =================================
                            MEMBERSHIP CARD
                        ================================= */}

                        <div className="professional-card membership-dashboard-card">

                            <div className="professional-card-header">

                                <div>

                                    <span className="card-eyebrow">
                                        MEMBERSHIP
                                    </span>

                                    <h3>
                                        Premium Reader
                                    </h3>

                                </div>

                                <span className="membership-active">
                                    Active
                                </span>

                            </div>


                            <div className="membership-plan">

                                <div className="membership-crown">
                                    ♛
                                </div>

                                <div>

                                    <span>
                                        Current Plan
                                    </span>

                                    <strong>
                                        Premium Reader
                                    </strong>

                                </div>

                            </div>


                            <div className="membership-details">

                                <div>
                                    <span>Monthly Fee</span>
                                    <strong>₹499</strong>
                                </div>

                                <div>
                                    <span>Valid Until</span>
                                    <strong>10 Oct 2026</strong>
                                </div>

                            </div>


                            <div className="membership-progress">

                                <div className="progress-header">

                                    <span>
                                        Membership period
                                    </span>

                                    <strong>
                                        28 days left
                                    </strong>

                                </div>

                                <div className="progress-track">

                                    <div className="progress-fill"></div>

                                </div>

                            </div>


                            <Link
                                to="/membership"
                                className="membership-manage-button"
                            >
                                Manage Membership →
                            </Link>

                        </div>

                    </section>


                    {/* =====================================
                        QUICK ACTIONS
                    ===================================== */}

                    <section className="quick-actions-section">

                        <div className="section-title-row">

                            <div>

                                <span className="card-eyebrow">
                                    QUICK ACTIONS
                                </span>

                                <h3>
                                    What would you like to do?
                                </h3>

                            </div>

                        </div>


                        <div className="professional-quick-grid">


                            <Link
                                to="/seats"
                                className="professional-quick-card"
                            >

                                <div className="quick-card-icon">
                                    💺
                                </div>

                                <div>

                                    <h4>
                                        Reserve a Seat
                                    </h4>

                                    <p>
                                        Find an available seat for your
                                        next study session.
                                    </p>

                                    <span>
                                        Reserve now →
                                    </span>

                                </div>

                            </Link>


                            <Link
                                to="/reservations"
                                className="professional-quick-card"
                            >

                                <div className="quick-card-icon">
                                    📋
                                </div>

                                <div>

                                    <h4>
                                        My Reservations
                                    </h4>

                                    <p>
                                        View and manage your upcoming
                                        library bookings.
                                    </p>

                                    <span>
                                        View reservations →
                                    </span>

                                </div>

                            </Link>


                            <Link
                                to="/membership"
                                className="professional-quick-card"
                            >

                                <div className="quick-card-icon">
                                    ♛
                                </div>

                                <div>

                                    <h4>
                                        Membership
                                    </h4>

                                    <p>
                                        Manage your membership and
                                        renewal options.
                                    </p>

                                    <span>
                                        Manage plan →
                                    </span>

                                </div>

                            </Link>


                            <Link
                                to="/profile"
                                className="professional-quick-card"
                            >

                                <div className="quick-card-icon">
                                    👤
                                </div>

                                <div>

                                    <h4>
                                        My Profile
                                    </h4>

                                    <p>
                                        Update your personal account
                                        information.
                                    </p>

                                    <span>
                                        View profile →
                                    </span>

                                </div>

                            </Link>

                        </div>

                    </section>


                    {/* =====================================
                        RECENT ACTIVITY
                    ===================================== */}

                    <section className="professional-card activity-dashboard-card">

                        <div className="professional-card-header">

                            <div>

                                <span className="card-eyebrow">
                                    ACTIVITY
                                </span>

                                <h3>
                                    Recent Activity
                                </h3>

                            </div>

                            <span className="activity-count">
                                3 recent activities
                            </span>

                        </div>


                        <div className="professional-activity-list">


                            <div className="professional-activity">

                                <div className="activity-circle success">
                                    ✓
                                </div>

                                <div className="activity-details">

                                    <strong>
                                        Seat A12 reserved successfully
                                    </strong>

                                    <span>
                                        Your reservation was confirmed for
                                        September 18, 2026.
                                    </span>

                                </div>

                                <time>
                                    Today
                                </time>

                            </div>


                            <div className="professional-activity">

                                <div className="activity-circle payment">
                                    ₹
                                </div>

                                <div className="activity-details">

                                    <strong>
                                        Membership payment completed
                                    </strong>

                                    <span>
                                        Premium Reader membership payment
                                        was processed successfully.
                                    </span>

                                </div>

                                <time>
                                    5 days ago
                                </time>

                            </div>


                            <div className="professional-activity">

                                <div className="activity-circle booking">
                                    📚
                                </div>

                                <div className="activity-details">

                                    <strong>
                                        Previous reservation completed
                                    </strong>

                                    <span>
                                        Your library study session was
                                        completed successfully.
                                    </span>

                                </div>

                                <time>
                                    8 days ago
                                </time>

                            </div>

                        </div>

                    </section>

                </main>


                {/* =========================================
                    FOOTER
                ========================================= */}

                <footer className="dashboard-footer">

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

export default StudentDashboard;