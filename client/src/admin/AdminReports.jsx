import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminReports.css";

const monthlyData = [
    {
        month: "Jan",
        revenue: 82400,
        reservations: 420,
        members: 24,
    },
    {
        month: "Feb",
        revenue: 91650,
        reservations: 455,
        members: 29,
    },
    {
        month: "Mar",
        revenue: 104200,
        reservations: 510,
        members: 34,
    },
    {
        month: "Apr",
        revenue: 112750,
        reservations: 548,
        members: 31,
    },
    {
        month: "May",
        revenue: 124500,
        reservations: 590,
        members: 38,
    },
    {
        month: "Jun",
        revenue: 131900,
        reservations: 620,
        members: 42,
    },
    {
        month: "Jul",
        revenue: 139250,
        reservations: 665,
        members: 47,
    },
    {
        month: "Aug",
        revenue: 143800,
        reservations: 710,
        members: 51,
    },
    {
        month: "Sep",
        revenue: 148760,
        reservations: 748,
        members: 28,
    },
];

const membershipPlans = [
    {
        name: "Premium Reader",
        count: 312,
        percentage: 67.5,
        icon: "fa-crown",
    },
    {
        name: "Basic Reader",
        count: 150,
        percentage: 32.5,
        icon: "fa-book-open",
    },
];

const seatUsage = [
    {
        name: "Reading Hall",
        percentage: 78,
        seats: 39,
        total: 50,
        icon: "fa-book-open-reader",
    },
    {
        name: "Reference Hall",
        percentage: 64,
        seats: 16,
        total: 25,
        icon: "fa-book",
    },
    {
        name: "Silent Zone",
        percentage: 52,
        seats: 13,
        total: 25,
        icon: "fa-volume-xmark",
    },
];

const recentPerformance = [
    {
        month: "September 2026",
        revenue: "₹1,48,760",
        reservations: 748,
        members: 28,
        occupancy: "58%",
    },
    {
        month: "August 2026",
        revenue: "₹1,43,800",
        reservations: 710,
        members: 51,
        occupancy: "61%",
    },
    {
        month: "July 2026",
        revenue: "₹1,39,250",
        reservations: 665,
        members: 47,
        occupancy: "57%",
    },
    {
        month: "June 2026",
        revenue: "₹1,31,900",
        reservations: 620,
        members: 42,
        occupancy: "54%",
    },
    {
        month: "May 2026",
        revenue: "₹1,24,500",
        reservations: 590,
        members: 38,
        occupancy: "52%",
    },
];

function AdminReports() {

    const location = useLocation();
    const navigate = useNavigate();

    const [period, setPeriod] = useState("year");
    const [activeChart, setActiveChart] = useState("revenue");

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const handleLogout = () => {
        navigate("/admin/login");
    };

    const reportStats = useMemo(() => {

        const totalRevenue = monthlyData.reduce(
            (sum, item) => sum + item.revenue,
            0
        );

        const totalReservations = monthlyData.reduce(
            (sum, item) => sum + item.reservations,
            0
        );

        const totalNewMembers = monthlyData.reduce(
            (sum, item) => sum + item.members,
            0
        );

        return {
            totalRevenue,
            totalReservations,
            totalNewMembers,
            occupancy: 58,
        };

    }, []);

    const maxRevenue = Math.max(
        ...monthlyData.map((item) => item.revenue)
    );

    const maxReservations = Math.max(
        ...monthlyData.map((item) => item.reservations)
    );

    const maxMembers = Math.max(
        ...monthlyData.map((item) => item.members)
    );

    const handleExport = () => {
        alert(
            "Report export feature will be connected to the backend later."
        );
    };

    return (
        <div className="admin-reports-page">

            {/* =====================================================
                SIDEBAR
            ===================================================== */}

            <aside className="admin-sidebar">

                {/* LOGO */}

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


                {/* NAVIGATION */}

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


                {/* SIDEBAR BOTTOM */}

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


            {/* =====================================================
                MAIN
            ===================================================== */}

            <main className="admin-main">

                {/* TOPBAR */}

                <header className="admin-topbar">

                    <div className="admin-topbar-left">

                        <span className="admin-page-label">
                            ADMINISTRATOR
                        </span>

                        <h1>
                            Reports & Analytics
                        </h1>

                    </div>


                    <div className="admin-topbar-right">

                        <button
                            className="admin-notification"
                            title="Notifications"
                            onClick={() =>
                                alert("No new notifications.")
                            }
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


                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="admin-content">

                    {/* BREADCRUMB */}

                    <div className="admin-breadcrumb">

                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <span>›</span>

                        <span>
                            Reports & Analytics
                        </span>

                    </div>


                    {/* PAGE HEADER */}

                    <div className="reports-page-header">

                        <div>

                            <div className="reports-title-row">

                                <div className="reports-title-icon">
                                    <i className="fa-solid fa-chart-line"></i>
                                </div>

                                <div>

                                    <h1>
                                        Reports & Analytics
                                    </h1>

                                    <p>
                                        Monitor library performance,
                                        membership growth and revenue.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="reports-header-actions">

                            <select
                                value={period}
                                onChange={(e) =>
                                    setPeriod(e.target.value)
                                }
                                className="period-select"
                            >

                                <option value="month">
                                    This Month
                                </option>

                                <option value="quarter">
                                    Last 3 Months
                                </option>

                                <option value="year">
                                    This Year
                                </option>

                            </select>


                            <button
                                className="export-report-button"
                                onClick={handleExport}
                            >
                                <i className="fa-solid fa-download"></i>
                                Export Report
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        KPI CARDS
                    ================================================= */}

                    <section className="report-kpi-grid">

                        {/* REVENUE */}

                        <div className="report-kpi-card revenue-card">

                            <div className="kpi-card-top">

                                <div className="kpi-icon">
                                    <i className="fa-solid fa-indian-rupee-sign"></i>
                                </div>

                                <span className="kpi-growth positive">
                                    +10.8%
                                </span>

                            </div>

                            <span className="kpi-label">
                                Total Revenue
                            </span>

                            <h2>
                                ₹
                                {reportStats.totalRevenue.toLocaleString(
                                    "en-IN"
                                )}
                            </h2>

                            <p>
                                <i className="fa-solid fa-arrow-trend-up"></i>
                                Revenue generated this year
                            </p>

                        </div>


                        {/* RESERVATIONS */}

                        <div className="report-kpi-card reservation-card">

                            <div className="kpi-card-top">

                                <div className="kpi-icon">
                                    <i className="fa-solid fa-calendar-check"></i>
                                </div>

                                <span className="kpi-growth positive">
                                    +15.4%
                                </span>

                            </div>

                            <span className="kpi-label">
                                Total Reservations
                            </span>

                            <h2>
                                {reportStats.totalReservations.toLocaleString(
                                    "en-IN"
                                )}
                            </h2>

                            <p>
                                <i className="fa-solid fa-arrow-trend-up"></i>
                                Bookings completed this year
                            </p>

                        </div>


                        {/* MEMBERS */}

                        <div className="report-kpi-card member-card">

                            <div className="kpi-card-top">

                                <div className="kpi-icon">
                                    <i className="fa-solid fa-user-plus"></i>
                                </div>

                                <span className="kpi-growth positive">
                                    +12.5%
                                </span>

                            </div>

                            <span className="kpi-label">
                                New Members
                            </span>

                            <h2>
                                {reportStats.totalNewMembers}
                            </h2>

                            <p>
                                <i className="fa-solid fa-arrow-trend-up"></i>
                                New registrations this year
                            </p>

                        </div>


                        {/* OCCUPANCY */}

                        <div className="report-kpi-card occupancy-card">

                            <div className="kpi-card-top">

                                <div className="kpi-icon">
                                    <i className="fa-solid fa-chair"></i>
                                </div>

                                <span className="kpi-growth positive">
                                    +6.2%
                                </span>

                            </div>

                            <span className="kpi-label">
                                Average Occupancy
                            </span>

                            <h2>
                                {reportStats.occupancy}%
                            </h2>

                            <p>
                                <i className="fa-solid fa-arrow-trend-up"></i>
                                Average seat utilization
                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        REVENUE + PERFORMANCE
                    ================================================= */}

                    <section className="reports-chart-grid">

                        {/* REVENUE CHART */}

                        <div className="report-panel revenue-panel">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Revenue Overview
                                    </h2>

                                    <p>
                                        Monthly revenue performance
                                    </p>

                                </div>

                                <div className="panel-total">

                                    <strong>
                                        ₹1,48,760
                                    </strong>

                                    <span>
                                        September
                                    </span>

                                </div>

                            </div>


                            <div className="chart-container">

                                <div className="chart-y-axis">

                                    <span>₹1.5L</span>
                                    <span>₹1.2L</span>
                                    <span>₹90K</span>
                                    <span>₹60K</span>
                                    <span>₹30K</span>
                                    <span>₹0</span>

                                </div>


                                <div className="bar-chart">

                                    <div className="chart-grid-lines">

                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                        <span></span>

                                    </div>


                                    <div className="bars-wrapper">

                                        {monthlyData.map((item) => {

                                            const height =
                                                (item.revenue /
                                                    maxRevenue) *
                                                100;

                                            return (

                                                <div
                                                    className="bar-column"
                                                    key={item.month}
                                                >

                                                    <div className="bar-value">

                                                        ₹
                                                        {(
                                                            item.revenue /
                                                            1000
                                                        ).toFixed(0)}
                                                        K

                                                    </div>


                                                    <div className="bar-area">

                                                        <div
                                                            className="revenue-bar"
                                                            style={{
                                                                height: `${height}%`,
                                                            }}
                                                            title={`${item.month}: ₹${item.revenue.toLocaleString(
                                                                "en-IN"
                                                            )}`}
                                                        ></div>

                                                    </div>


                                                    <span className="bar-label">
                                                        {item.month}
                                                    </span>

                                                </div>

                                            );

                                        })}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* PERFORMANCE SUMMARY */}

                        <div className="report-panel analytics-panel">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Performance Summary
                                    </h2>

                                    <p>
                                        Key library metrics
                                    </p>

                                </div>

                            </div>


                            <div className="performance-list">

                                {/* Reservations */}

                                <div className="performance-item">

                                    <div className="performance-icon blue">
                                        <i className="fa-solid fa-calendar-check"></i>
                                    </div>

                                    <div className="performance-content">

                                        <div className="performance-title">

                                            <strong>
                                                Reservations
                                            </strong>

                                            <span>
                                                748
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: "82%",
                                                }}
                                            ></div>

                                        </div>

                                        <small>
                                            82% of monthly target
                                        </small>

                                    </div>

                                </div>


                                {/* Members */}

                                <div className="performance-item">

                                    <div className="performance-icon purple">
                                        <i className="fa-solid fa-users"></i>
                                    </div>

                                    <div className="performance-content">

                                        <div className="performance-title">

                                            <strong>
                                                Active Members
                                            </strong>

                                            <span>
                                                462
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill purple-fill"
                                                style={{
                                                    width: "88%",
                                                }}
                                            ></div>

                                        </div>

                                        <small>
                                            88% of member capacity
                                        </small>

                                    </div>

                                </div>


                                {/* Occupancy */}

                                <div className="performance-item">

                                    <div className="performance-icon orange">
                                        <i className="fa-solid fa-chair"></i>
                                    </div>

                                    <div className="performance-content">

                                        <div className="performance-title">

                                            <strong>
                                                Seat Occupancy
                                            </strong>

                                            <span>
                                                58%
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill orange-fill"
                                                style={{
                                                    width: "58%",
                                                }}
                                            ></div>

                                        </div>

                                        <small>
                                            58 of 100 seats currently utilized
                                        </small>

                                    </div>

                                </div>


                                {/* Revenue */}

                                <div className="performance-item">

                                    <div className="performance-icon green">
                                        <i className="fa-solid fa-indian-rupee-sign"></i>
                                    </div>

                                    <div className="performance-content">

                                        <div className="performance-title">

                                            <strong>
                                                Monthly Revenue
                                            </strong>

                                            <span>
                                                ₹1,48,760
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill green-fill"
                                                style={{
                                                    width: "91%",
                                                }}
                                            ></div>

                                        </div>

                                        <small>
                                            91% of monthly revenue target
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        LIBRARY GROWTH TRENDS
                    ================================================= */}

                    <section className="report-panel trend-panel">

                        <div className="panel-header trend-header">

                            <div>

                                <h2>
                                    Library Growth Trends
                                </h2>

                                <p>
                                    Compare reservations and new member
                                    registrations.
                                </p>

                            </div>


                            <div className="chart-toggle">

                                <button
                                    className={
                                        activeChart === "revenue"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveChart("revenue")
                                    }
                                >
                                    Revenue
                                </button>


                                <button
                                    className={
                                        activeChart === "reservations"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveChart("reservations")
                                    }
                                >
                                    Reservations
                                </button>


                                <button
                                    className={
                                        activeChart === "members"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveChart("members")
                                    }
                                >
                                    Members
                                </button>

                            </div>

                        </div>


                        <div className="trend-chart">

                            <div className="trend-y-axis">

                                <span>
                                    {activeChart === "members"
                                        ? "60"
                                        : activeChart === "reservations"
                                            ? "800"
                                            : "₹1.5L"}
                                </span>

                                <span>
                                    {activeChart === "members"
                                        ? "48"
                                        : activeChart === "reservations"
                                            ? "640"
                                            : "₹1.2L"}
                                </span>

                                <span>
                                    {activeChart === "members"
                                        ? "36"
                                        : activeChart === "reservations"
                                            ? "480"
                                            : "₹90K"}
                                </span>

                                <span>
                                    {activeChart === "members"
                                        ? "24"
                                        : activeChart === "reservations"
                                            ? "320"
                                            : "₹60K"}
                                </span>

                                <span>
                                    {activeChart === "members"
                                        ? "12"
                                        : activeChart === "reservations"
                                            ? "160"
                                            : "₹30K"}
                                </span>

                                <span>
                                    0
                                </span>

                            </div>


                            <div className="trend-chart-area">

                                <div className="trend-grid-lines">

                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>

                                </div>


                                <div className="trend-bars">

                                    {monthlyData.map((item) => {

                                        let value;
                                        let maxValue;

                                        if (
                                            activeChart ===
                                            "reservations"
                                        ) {

                                            value = item.reservations;
                                            maxValue = maxReservations;

                                        } else if (
                                            activeChart ===
                                            "members"
                                        ) {

                                            value = item.members;
                                            maxValue = maxMembers;

                                        } else {

                                            value = item.revenue;
                                            maxValue = maxRevenue;

                                        }

                                        const height =
                                            (value / maxValue) * 100;

                                        return (

                                            <div
                                                className="trend-column"
                                                key={item.month}
                                            >

                                                <div className="trend-value">

                                                    {activeChart ===
                                                    "revenue"
                                                        ? `₹${(
                                                            value / 1000
                                                        ).toFixed(0)}K`
                                                        : value}

                                                </div>


                                                <div className="trend-bar-wrapper">

                                                    <div
                                                        className="trend-bar"
                                                        style={{
                                                            height: `${height}%`,
                                                        }}
                                                    ></div>

                                                </div>


                                                <span>
                                                    {item.month}
                                                </span>

                                            </div>

                                        );

                                    })}

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        LOWER REPORT GRID
                    ================================================= */}

                    <section className="reports-lower-grid">

                        {/* MEMBERSHIP DISTRIBUTION */}

                        <div className="report-panel membership-report">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Membership Distribution
                                    </h2>

                                    <p>
                                        Active membership plans
                                    </p>

                                </div>

                            </div>


                            <div className="membership-chart-content">

                                <div className="donut-chart">

                                    <div className="donut-inner">

                                        <strong>
                                            462
                                        </strong>

                                        <span>
                                            Active
                                        </span>

                                    </div>

                                </div>


                                <div className="membership-legend">

                                    {membershipPlans.map(
                                        (plan, index) => (

                                            <div
                                                className="legend-item"
                                                key={plan.name}
                                            >

                                                <div className="legend-info">

                                                    <span
                                                        className={`legend-dot dot-${index}`}
                                                    ></span>

                                                    <span>
                                                        {plan.name}
                                                    </span>

                                                </div>

                                                <strong>
                                                    {plan.count}
                                                </strong>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>


                        {/* SEAT OCCUPANCY */}

                        <div className="report-panel seat-report">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Seat Occupancy
                                    </h2>

                                    <p>
                                        Usage by library section
                                    </p>

                                </div>


                                <span className="live-report-badge">

                                    <span></span>

                                    Live

                                </span>

                            </div>


                            <div className="seat-usage-list">

                                {seatUsage.map((section) => (

                                    <div
                                        className="seat-usage-item"
                                        key={section.name}
                                    >

                                        <div className="seat-usage-top">

                                            <div className="seat-name">

                                                <div className="seat-icon">

                                                    <i
                                                        className={`fa-solid ${section.icon}`}
                                                    ></i>

                                                </div>


                                                <div>

                                                    <strong>
                                                        {section.name}
                                                    </strong>

                                                    <span>
                                                        {section.seats} of{" "}
                                                        {section.total} seats
                                                    </span>

                                                </div>

                                            </div>


                                            <strong className="seat-percentage">
                                                {section.percentage}%
                                            </strong>

                                        </div>


                                        <div className="seat-progress">

                                            <div
                                                style={{
                                                    width: `${section.percentage}%`,
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* PAYMENT OVERVIEW */}

                        <div className="report-panel payment-report">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Payment Overview
                                    </h2>

                                    <p>
                                        Current payment status
                                    </p>

                                </div>


                                <Link to="/admin/payments">
                                    View All
                                </Link>

                            </div>


                            <div className="payment-overview-content">

                                <div className="payment-circle">

                                    <div>

                                        <strong>
                                            295
                                        </strong>

                                        <span>
                                            Transactions
                                        </span>

                                    </div>

                                </div>


                                <div className="payment-status-list">

                                    <div className="payment-status-item">

                                        <span className="status-dot successful"></span>

                                        <div>

                                            <strong>
                                                Successful
                                            </strong>

                                            <small>
                                                284 transactions
                                            </small>

                                        </div>

                                        <b>
                                            96.3%
                                        </b>

                                    </div>


                                    <div className="payment-status-item">

                                        <span className="status-dot pending"></span>

                                        <div>

                                            <strong>
                                                Pending
                                            </strong>

                                            <small>
                                                8 transactions
                                            </small>

                                        </div>

                                        <b>
                                            2.7%
                                        </b>

                                    </div>


                                    <div className="payment-status-item">

                                        <span className="status-dot failed"></span>

                                        <div>

                                            <strong>
                                                Failed
                                            </strong>

                                            <small>
                                                3 transactions
                                            </small>

                                        </div>

                                        <b>
                                            1.0%
                                        </b>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* KEY INSIGHTS */}

                        <div className="report-panel insights-report">

                            <div className="panel-header">

                                <div>

                                    <h2>
                                        Key Insights
                                    </h2>

                                    <p>
                                        Important observations
                                    </p>

                                </div>

                            </div>


                            <div className="insights-list">

                                <div className="insight-item">

                                    <div className="insight-icon success">
                                        <i className="fa-solid fa-arrow-trend-up"></i>
                                    </div>

                                    <div>

                                        <strong>
                                            Revenue is growing
                                        </strong>

                                        <p>
                                            September revenue increased by
                                            3.4% compared with August.
                                        </p>

                                    </div>

                                </div>


                                <div className="insight-item">

                                    <div className="insight-icon info">
                                        <i className="fa-solid fa-users"></i>
                                    </div>

                                    <div>

                                        <strong>
                                            Membership remains strong
                                        </strong>

                                        <p>
                                            Premium Reader accounts make up
                                            67.5% of active memberships.
                                        </p>

                                    </div>

                                </div>


                                <div className="insight-item">

                                    <div className="insight-icon warning">
                                        <i className="fa-solid fa-chair"></i>
                                    </div>

                                    <div>

                                        <strong>
                                            Monitor seat usage
                                        </strong>

                                        <p>
                                            Reading Hall has the highest
                                            utilization at 78%.
                                        </p>

                                    </div>

                                </div>


                                <div className="insight-item">

                                    <div className="insight-icon purple">
                                        <i className="fa-solid fa-credit-card"></i>
                                    </div>

                                    <div>

                                        <strong>
                                            Payment success rate
                                        </strong>

                                        <p>
                                            96.3% of payment transactions
                                            were completed successfully.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        MONTHLY PERFORMANCE
                    ================================================= */}

                    <section className="report-panel monthly-report">

                        <div className="panel-header monthly-header">

                            <div>

                                <h2>
                                    Monthly Performance
                                </h2>

                                <p>
                                    Recent library performance overview
                                </p>

                            </div>


                            <span className="report-period-label">
                                2026
                            </span>

                        </div>


                        <div className="monthly-table-wrapper">

                            <table className="monthly-table">

                                <thead>

                                    <tr>

                                        <th>
                                            Month
                                        </th>

                                        <th>
                                            Revenue
                                        </th>

                                        <th>
                                            Reservations
                                        </th>

                                        <th>
                                            New Members
                                        </th>

                                        <th>
                                            Occupancy
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {recentPerformance.map(
                                        (item, index) => (

                                            <tr key={item.month}>

                                                <td>

                                                    <div className="month-name">

                                                        <span>
                                                            {index + 1}
                                                        </span>

                                                        <strong>
                                                            {item.month}
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                    <strong className="table-revenue">
                                                        {item.revenue}
                                                    </strong>

                                                </td>


                                                <td>

                                                    <span className="table-number">
                                                        {item.reservations}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span className="table-number">
                                                        {item.members}
                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="table-occupancy">

                                                        <div className="mini-progress">

                                                            <span
                                                                style={{
                                                                    width: item.occupancy,
                                                                }}
                                                            ></span>

                                                        </div>

                                                        <strong>
                                                            {item.occupancy}
                                                        </strong>

                                                    </div>

                                                </td>


                                                <td>

                                                    <span className="performance-status">

                                                        <span></span>

                                                        On Track

                                                    </span>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </section>


                    {/* =================================================
                        REPORT NOTE
                    ================================================= */}

                    <div className="reports-note">

                        <div className="reports-note-icon">

                            <i className="fa-solid fa-circle-info"></i>

                        </div>


                        <div>

                            <strong>
                                About these reports
                            </strong>

                            <p>
                                The analytics shown here are currently
                                sample frontend data for the LibraSpace
                                project. They will be connected to MongoDB
                                and real payment, reservation and membership
                                data during backend integration.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <footer className="admin-footer">

                    <p>
                        © 2026 LibraSpace. Admin Dashboard.
                    </p>

                    <div>

                        <span>
                            Reports & Analytics
                        </span>

                        <span>
                            •
                        </span>

                        <span>
                            Admin Portal
                        </span>

                    </div>

                </footer>

            </main>

        </div>
    );
}

export default AdminReports;