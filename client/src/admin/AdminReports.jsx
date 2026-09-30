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

import "./AdminReports.css";


/* =========================================================
   API
========================================================= */

const API_BASE =
    "http://localhost:5000/api/admin/reports";


/* =========================================================
   ADMIN REPORTS
========================================================= */

function AdminReports() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [reportData, setReportData] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [period, setPeriod] =
        useState("year");

    const [activeChart, setActiveChart] =
        useState("revenue");


    /* =====================================================
       ADMIN INFORMATION
    ===================================================== */

    const adminUser = useMemo(() => {

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
        adminUser?.name ||
        "Administrator";


    const adminEmail =
        adminUser?.email ||
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
       LOAD REPORTS
    ===================================================== */

    const loadReports = async () => {

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
                    "Unable to load reports."
                );

            }


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load reports."
                );

            }


            setReportData(
                data
            );


        } catch (err) {

            console.error(
                "Load reports error:",
                err
            );


            setError(
                err.message ||
                "Unable to load reports."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD ON PAGE OPEN
    ===================================================== */

    useEffect(() => {

        loadReports();

    }, []);


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
       FORMAT AMOUNT
    ===================================================== */

    const formatAmount = (
        amount
    ) => {

        return `₹${Number(
            amount || 0
        ).toLocaleString(
            "en-IN"
        )}`;

    };


    /* =====================================================
       GET MONTHLY DATA
    ===================================================== */

    const monthlyData =
        reportData?.monthlyData || [];


    /* =====================================================
       PERIOD DATA
    ===================================================== */

    const selectedPeriodData =
        useMemo(() => {

            if (
                monthlyData.length === 0
            ) {

                return [];

            }


            if (
                period === "month"
            ) {

                return monthlyData.slice(
                    -1
                );

            }


            if (
                period === "quarter"
            ) {

                return monthlyData.slice(
                    -3
                );

            }


            return monthlyData;

        }, [
            monthlyData,
            period
        ]);


    /* =====================================================
       AGGREGATE PERIOD DATA
    ===================================================== */

    const periodStats =
        useMemo(() => {

            const totalRevenue =
                selectedPeriodData.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.revenue ||
                            0
                        ),
                    0
                );


            const totalReservations =
                selectedPeriodData.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.reservations ||
                            0
                        ),
                    0
                );


            const totalMembers =
                selectedPeriodData.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.members ||
                            0
                        ),
                    0
                );


            const successfulPayments =
                selectedPeriodData.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.successfulPayments ||
                            0
                        ),
                    0
                );


            const pendingPayments =
                selectedPeriodData.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.pendingPayments ||
                            0
                        ),
                    0
                );


            const failedPayments =
                selectedPeriodData.reduce(
                    (
                        total,
                        item
                    ) =>
                        total +
                        Number(
                            item.failedPayments ||
                            0
                        ),
                    0
                );


            const totalPayments =
                successfulPayments +
                pendingPayments +
                failedPayments;


            const averageOccupancy =
                selectedPeriodData.length > 0

                    ? Math.round(
                        selectedPeriodData.reduce(
                            (
                                total,
                                item
                            ) =>
                                total +
                                Number(
                                    item.occupancy ||
                                    0
                                ),
                            0
                        ) /
                        selectedPeriodData.length
                    )

                    : Number(
                        reportData
                            ?.seatOverview
                            ?.occupancy ||
                        0
                    );


            const pendingAmount =
                0;


            const successRate =
                totalPayments > 0

                    ? Number(
                        (
                            (
                                successfulPayments /
                                totalPayments
                            ) *
                            100
                        ).toFixed(1)
                    )

                    : 0;


            const averagePayment =
                successfulPayments > 0

                    ? Math.round(
                        totalRevenue /
                        successfulPayments
                    )

                    : 0;


            return {

                totalRevenue,

                totalReservations,

                totalMembers,

                successfulPayments,

                pendingPayments,

                failedPayments,

                totalPayments,

                pendingAmount,

                averageOccupancy,

                successRate,

                averagePayment

            };

        }, [
            selectedPeriodData,
            reportData
        ]);


    /* =====================================================
       CURRENT MONTH
    ===================================================== */

    const currentMonthData =
        monthlyData.length > 0

            ? monthlyData[
                monthlyData.length - 1
            ]

            : {

                month:
                    "Current",

                monthName:
                    "Current Month",

                year:
                    new Date()
                        .getFullYear(),

                revenue:
                    0,

                reservations:
                    0,

                members:
                    0,

                occupancy:
                    0,

                successfulPayments:
                    0,

                pendingPayments:
                    0,

                failedPayments:
                    0

            };


    /* =====================================================
       PREVIOUS MONTH
    ===================================================== */

    const previousMonthData =
        monthlyData.length > 1

            ? monthlyData[
                monthlyData.length - 2
            ]

            : {

                revenue:
                    0,

                reservations:
                    0,

                members:
                    0

            };


    /* =====================================================
       GROWTH
    ===================================================== */

    const calculateGrowth =
        (
            current,
            previous
        ) => {

            if (
                Number(previous) === 0
            ) {

                return Number(current) > 0
                    ? 100
                    : 0;

            }


            return Number(
                (
                    (
                        (
                            Number(current) -
                            Number(previous)
                        ) /
                        Number(previous)
                    ) *
                    100
                ).toFixed(1)
            );

        };


    const revenueGrowth =
        calculateGrowth(
            currentMonthData.revenue,
            previousMonthData.revenue
        );


    const reservationGrowth =
        calculateGrowth(
            currentMonthData.reservations,
            previousMonthData.reservations
        );


    const memberGrowth =
        calculateGrowth(
            currentMonthData.members,
            previousMonthData.members
        );


    /* =====================================================
       GROWTH DISPLAY
    ===================================================== */

    const growthText =
        (value) => {

            if (
                value === null ||
                value === undefined
            ) {

                return "—";

            }


            return `${
                value >= 0
                    ? "+"
                    : ""
            }${value}%`;

        };


    const growthClass =
        (value) => {

            return value >= 0
                ? "positive"
                : "negative";

        };


    /* =====================================================
       SEAT OVERVIEW
    ===================================================== */

    const seatOverview =
        reportData?.seatOverview || {

            total:
                0,

            used:
                0,

            available:
                0,

            occupancy:
                0,

            sections:
                []

        };


    const seatUsage =
        seatOverview.sections || [];


    /* =====================================================
       MEMBERSHIP OVERVIEW
    ===================================================== */

    const membershipOverview =
        reportData?.membershipOverview || {

            total:
                0,

            active:
                0,

            expiringSoon:
                0,

            expired:
                0

        };


    /* =====================================================
       MEMBERSHIP PLANS
    ===================================================== */

    const membershipPlans =
        reportData?.membershipPlans || [];


    /* =====================================================
       PAYMENT OVERVIEW
    ===================================================== */

    const paymentOverview =
        reportData?.paymentOverview || {

            totalTransactions:
                0,

            successful:
                0,

            pending:
                0,

            failed:
                0,

            totalRevenue:
                0,

            pendingAmount:
                0,

            successRate:
                0,

            averagePayment:
                0

        };


    /* =====================================================
       MEMBERSHIP PLAN DONUT
    ===================================================== */

    const donutStyle =
        useMemo(() => {

            if (
                membershipPlans.length === 0
            ) {

                return {};

            }


            let currentDegree =
                0;


            const segments =
                membershipPlans.map(
                    (
                        plan,
                        index
                    ) => {

                        const percentage =
                            Number(
                                plan.percentage ||
                                0
                            );


                        const start =
                            currentDegree;


                        const end =
                            currentDegree +
                            (
                                percentage *
                                3.6
                            );


                        currentDegree =
                            end;


                        const segmentColor =
                            index % 2 === 0
                                ? "#2589A5"
                                : "#7CCED5";


                        return `${segmentColor} ${start}deg ${end}deg`;

                    }
                );


            return {

                background:
                    `conic-gradient(${segments.join(
                        ", "
                    )})`

            };

        }, [
            membershipPlans
        ]);


    /* =====================================================
       MAX CHART VALUES
    ===================================================== */

    const maxRevenue =
        Math.max(
            ...monthlyData.map(
                (item) =>
                    Number(
                        item.revenue || 0
                    )
            ),
            1
        );


    const maxReservations =
        Math.max(
            ...monthlyData.map(
                (item) =>
                    Number(
                        item.reservations ||
                        0
                    )
            ),
            1
        );


    const maxMembers =
        Math.max(
            ...monthlyData.map(
                (item) =>
                    Number(
                        item.members ||
                        0
                    )
            ),
            1
        );


    /* =====================================================
       REPORT PERIOD LABEL
    ===================================================== */

    const periodLabel =
        period === "month"

            ? "This Month"

            : period === "quarter"

                ? "Last 3 Months"

                : "This Year";


    /* =====================================================
       EXPORT REPORT
    ===================================================== */

    const handleExport =
        () => {

            if (
                monthlyData.length === 0
            ) {

                alert(
                    "No report data available to export."
                );

                return;

            }


            const rows = [

                [
                    "Month",
                    "Revenue",
                    "Reservations",
                    "New Members",
                    "Occupancy",
                    "Successful Payments",
                    "Pending Payments",
                    "Failed Payments"
                ],

                ...selectedPeriodData.map(
                    (
                        item
                    ) => [

                        `${item.monthName || item.month} ${item.year || ""}`,

                        item.revenue,

                        item.reservations,

                        item.members,

                        `${item.occupancy}%`,

                        item.successfulPayments,

                        item.pendingPayments,

                        item.failedPayments

                    ]
                )

            ];


            const csv =
                rows
                    .map(
                        (
                            row
                        ) =>
                            row
                                .map(
                                    (
                                        value
                                    ) =>
                                        `"${String(
                                            value ?? ""
                                        ).replace(
                                            /"/g,
                                            '""'
                                        )}"`
                                )
                                .join(",")
                    )
                    .join("\n");


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                `LibraSpace-${periodLabel
                    .replace(
                        /\s+/g,
                        "-"
                    )}-Report.csv`;


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        };


    /* =====================================================
       RENDER
    ===================================================== */

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
                            type="button"
                            className="admin-notification"
                            title="Notifications"
                            onClick={() =>
                                alert(
                                    "No new notifications."
                                )
                            }
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


                {/* =====================================================
                    CONTENT
                ===================================================== */}

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
                                        membership growth and revenue
                                        using live system data.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <div className="reports-header-actions">


                            <select
                                value={period}
                                onChange={(e) =>
                                    setPeriod(
                                        e.target.value
                                    )
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
                                type="button"
                                className="export-report-button"
                                onClick={
                                    handleExport
                                }
                            >

                                <i className="fa-solid fa-download"></i>

                                Export Report

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        LOADING
                    ================================================= */}

                    {loading && (

                        <div
                            style={{
                                padding:
                                    "16px 20px",
                                marginBottom:
                                    "20px",
                                borderRadius:
                                    "12px",
                                background:
                                    "#eef7fa",
                                color:
                                    "#2589A5"
                            }}
                        >

                            Loading live report data...

                        </div>

                    )}


                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <div
                            style={{
                                padding:
                                    "16px 20px",
                                marginBottom:
                                    "20px",
                                borderRadius:
                                    "12px",
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
                                    loadReports
                                }
                                style={{
                                    marginLeft:
                                        "12px",
                                    cursor:
                                        "pointer"
                                }}
                            >

                                Retry

                            </button>

                        </div>

                    )}


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


                                <span
                                    className={`kpi-growth ${growthClass(
                                        revenueGrowth
                                    )}`}
                                >

                                    {growthText(
                                        revenueGrowth
                                    )}

                                </span>

                            </div>


                            <span className="kpi-label">
                                Total Revenue
                            </span>


                            <h2>
                                {formatAmount(
                                    periodStats.totalRevenue
                                )}
                            </h2>


                            <p>

                                <i className="fa-solid fa-arrow-trend-up"></i>

                                {periodLabel}

                            </p>

                        </div>


                        {/* RESERVATIONS */}

                        <div className="report-kpi-card reservation-card">

                            <div className="kpi-card-top">

                                <div className="kpi-icon">

                                    <i className="fa-solid fa-calendar-check"></i>

                                </div>


                                <span
                                    className={`kpi-growth ${growthClass(
                                        reservationGrowth
                                    )}`}
                                >

                                    {growthText(
                                        reservationGrowth
                                    )}

                                </span>

                            </div>


                            <span className="kpi-label">
                                Total Reservations
                            </span>


                            <h2>
                                {Number(
                                    periodStats.totalReservations
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </h2>


                            <p>

                                <i className="fa-solid fa-arrow-trend-up"></i>

                                {periodLabel}

                            </p>

                        </div>


                        {/* MEMBERS */}

                        <div className="report-kpi-card member-card">

                            <div className="kpi-card-top">

                                <div className="kpi-icon">

                                    <i className="fa-solid fa-user-plus"></i>

                                </div>


                                <span
                                    className={`kpi-growth ${growthClass(
                                        memberGrowth
                                    )}`}
                                >

                                    {growthText(
                                        memberGrowth
                                    )}

                                </span>

                            </div>


                            <span className="kpi-label">
                                New Members
                            </span>


                            <h2>
                                {
                                    periodStats.totalMembers
                                }
                            </h2>


                            <p>

                                <i className="fa-solid fa-arrow-trend-up"></i>

                                {periodLabel}

                            </p>

                        </div>


                        {/* OCCUPANCY */}

                        <div className="report-kpi-card occupancy-card">

                            <div className="kpi-card-top">

                                <div className="kpi-icon">

                                    <i className="fa-solid fa-chair"></i>

                                </div>

                            </div>


                            <span className="kpi-label">
                                Average Occupancy
                            </span>


                            <h2>
                                {
                                    periodStats.averageOccupancy
                                }%
                            </h2>


                            <p>

                                <i className="fa-solid fa-arrow-trend-up"></i>

                                Seat utilization

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
                                        Monthly successful payment revenue
                                    </p>

                                </div>


                                <div className="panel-total">

                                    <strong>
                                        {
                                            formatAmount(
                                                currentMonthData.revenue
                                            )
                                        }
                                    </strong>

                                    <span>
                                        Current Month
                                    </span>

                                </div>

                            </div>


                            <div className="chart-container">


                                <div className="chart-y-axis">

                                    <span>
                                        {
                                            formatAmount(
                                                maxRevenue
                                            )
                                        }
                                    </span>

                                    <span>
                                        {
                                            formatAmount(
                                                maxRevenue *
                                                0.8
                                            )
                                        }
                                    </span>

                                    <span>
                                        {
                                            formatAmount(
                                                maxRevenue *
                                                0.6
                                            )
                                        }
                                    </span>

                                    <span>
                                        {
                                            formatAmount(
                                                maxRevenue *
                                                0.4
                                            )
                                        }
                                    </span>

                                    <span>
                                        {
                                            formatAmount(
                                                maxRevenue *
                                                0.2
                                            )
                                    }
                                    </span>

                                    <span>
                                        ₹0
                                    </span>

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

                                        {monthlyData.map(
                                            (
                                                item
                                            ) => {

                                                const height =
                                                    (
                                                        Number(
                                                            item.revenue ||
                                                            0
                                                        ) /
                                                        maxRevenue
                                                    ) *
                                                    100;


                                                return (

                                                    <div
                                                        className="bar-column"
                                                        key={`${item.year}-${item.month}`}
                                                    >

                                                        <div className="bar-value">

                                                            {formatAmount(
                                                                item.revenue
                                                            )}

                                                        </div>


                                                        <div className="bar-area">

                                                            <div
                                                                className="revenue-bar"
                                                                style={{
                                                                    height:
                                                                        `${height}%`
                                                                }}
                                                                title={`${item.monthName || item.month}: ${formatAmount(
                                                                    item.revenue
                                                                )}`}
                                                            ></div>

                                                        </div>


                                                        <span className="bar-label">

                                                            {
                                                                item.month
                                                            }

                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )}

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
                                        Current live library metrics
                                    </p>

                                </div>

                            </div>


                            <div className="performance-list">


                                {/* RESERVATIONS */}

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
                                                {
                                                    currentMonthData.reservations
                                                }
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width:
                                                        `${
                                                            maxReservations > 0
                                                                ? Math.min(
                                                                    100,
                                                                    Math.round(
                                                                        (
                                                                            currentMonthData.reservations /
                                                                            maxReservations
                                                                        ) *
                                                                        100
                                                                    )
                                                                )
                                                                : 0
                                                        }%`
                                                }}
                                            ></div>

                                        </div>


                                        <small>
                                            Relative to highest recorded month
                                        </small>

                                    </div>

                                </div>


                                {/* MEMBERS */}

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
                                                {
                                                    reportData
                                                        ?.statistics
                                                        ?.activeMembers ??
                                                    0
                                                }
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill purple-fill"
                                                style={{
                                                    width:
                                                        `${
                                                            reportData
                                                                ?.statistics
                                                                ?.activeMembers &&
                                                            reportData
                                                                ?.statistics
                                                                ?.totalNewMembers !==
                                                                undefined

                                                                ? "100%"

                                                                : "0%"
                                                        }`
                                                }}
                                            ></div>

                                        </div>


                                        <small>
                                            Active members in the system
                                        </small>

                                    </div>

                                </div>


                                {/* OCCUPANCY */}

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
                                                {
                                                    seatOverview.occupancy
                                                }%
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill orange-fill"
                                                style={{
                                                    width:
                                                        `${seatOverview.occupancy}%`
                                                }}
                                            ></div>

                                        </div>


                                        <small>
                                            {
                                                seatOverview.used
                                            } of {
                                                seatOverview.total
                                            } seats utilized
                                        </small>

                                    </div>

                                </div>


                                {/* REVENUE */}

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
                                                {
                                                    formatAmount(
                                                        currentMonthData.revenue
                                                    )
                                                }
                                            </span>

                                        </div>


                                        <div className="progress-track">

                                            <div
                                                className="progress-fill green-fill"
                                                style={{
                                                    width:
                                                        `${
                                                            maxRevenue > 0
                                                                ? Math.round(
                                                                    (
                                                                        currentMonthData.revenue /
                                                                        maxRevenue
                                                                    ) *
                                                                    100
                                                                )
                                                                : 0
                                                        }%`
                                                }}
                                            ></div>

                                        </div>


                                        <small>
                                            Relative to highest recorded month
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
                                    Compare monthly revenue,
                                    reservations and new members.
                                </p>

                            </div>


                            <div className="chart-toggle">


                                <button
                                    type="button"
                                    className={
                                        activeChart ===
                                        "revenue"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveChart(
                                            "revenue"
                                        )
                                    }
                                >

                                    Revenue

                                </button>


                                <button
                                    type="button"
                                    className={
                                        activeChart ===
                                        "reservations"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveChart(
                                            "reservations"
                                        )
                                    }
                                >

                                    Reservations

                                </button>


                                <button
                                    type="button"
                                    className={
                                        activeChart ===
                                        "members"
                                            ? "active"
                                            : ""
                                    }
                                    onClick={() =>
                                        setActiveChart(
                                            "members"
                                        )
                                    }
                                >

                                    Members

                                </button>

                            </div>

                        </div>


                        <div className="trend-chart">


                            <div className="trend-y-axis">

                                <span>

                                    {activeChart ===
                                    "revenue"

                                        ? formatAmount(
                                            maxRevenue
                                        )

                                        : activeChart ===
                                            "reservations"

                                            ? maxReservations

                                            : maxMembers}

                                </span>


                                <span>

                                    {activeChart ===
                                    "revenue"

                                        ? formatAmount(
                                            maxRevenue *
                                            0.8
                                        )

                                        : activeChart ===
                                            "reservations"

                                            ? Math.round(
                                                maxReservations *
                                                0.8
                                            )

                                            : Math.round(
                                                maxMembers *
                                                0.8
                                            )}

                                </span>


                                <span>

                                    {activeChart ===
                                    "revenue"

                                        ? formatAmount(
                                            maxRevenue *
                                            0.6
                                        )

                                        : activeChart ===
                                            "reservations"

                                            ? Math.round(
                                                maxReservations *
                                                0.6
                                            )

                                            : Math.round(
                                                maxMembers *
                                                0.6
                                            )}

                                </span>


                                <span>

                                    {activeChart ===
                                    "revenue"

                                        ? formatAmount(
                                            maxRevenue *
                                            0.4
                                        )

                                        : activeChart ===
                                            "reservations"

                                            ? Math.round(
                                                maxReservations *
                                                0.4
                                            )

                                            : Math.round(
                                                maxMembers *
                                                0.4
                                            )}

                                </span>


                                <span>

                                    {activeChart ===
                                    "revenue"

                                        ? formatAmount(
                                            maxRevenue *
                                            0.2
                                        )

                                        : activeChart ===
                                            "reservations"

                                            ? Math.round(
                                                maxReservations *
                                                0.2
                                            )

                                            : Math.round(
                                                maxMembers *
                                                0.2
                                            )}

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

                                    {monthlyData.map(
                                        (
                                            item
                                        ) => {

                                            let value =
                                                0;

                                            let maxValue =
                                                1;


                                            if (
                                                activeChart ===
                                                "reservations"
                                            ) {

                                                value =
                                                    Number(
                                                        item.reservations ||
                                                        0
                                                    );

                                                maxValue =
                                                    maxReservations;

                                            }

                                            else if (
                                                activeChart ===
                                                "members"
                                            ) {

                                                value =
                                                    Number(
                                                        item.members ||
                                                        0
                                                    );

                                                maxValue =
                                                    maxMembers;

                                            }

                                            else {

                                                value =
                                                    Number(
                                                        item.revenue ||
                                                        0
                                                    );

                                                maxValue =
                                                    maxRevenue;

                                            }


                                            const height =
                                                (
                                                    value /
                                                    maxValue
                                                ) *
                                                100;


                                            return (

                                                <div
                                                    className="trend-column"
                                                    key={`${item.year}-${item.month}-trend`}
                                                >

                                                    <div className="trend-value">

                                                        {activeChart ===
                                                        "revenue"

                                                            ? formatAmount(
                                                                value
                                                            )

                                                            : value}

                                                    </div>


                                                    <div className="trend-bar-wrapper">

                                                        <div
                                                            className="trend-bar"
                                                            style={{
                                                                height:
                                                                    `${height}%`
                                                            }}
                                                        ></div>

                                                    </div>


                                                    <span>
                                                        {
                                                            item.month
                                                        }
                                                    </span>

                                                </div>

                                            );

                                        }
                                    )}

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


                                <div
                                    className="donut-chart"
                                    style={
                                        donutStyle
                                    }
                                >

                                    <div className="donut-inner">

                                        <strong>
                                            {
                                                membershipOverview.active
                                            }
                                        </strong>

                                        <span>
                                            Active
                                        </span>

                                    </div>

                                </div>


                                <div className="membership-legend">

                                    {membershipPlans.length >
                                    0 ? (

                                        membershipPlans.map(
                                            (
                                                plan,
                                                index
                                            ) => (

                                                <div
                                                    className="legend-item"
                                                    key={
                                                        plan.name
                                                    }
                                                >

                                                    <div className="legend-info">

                                                        <span
                                                            className={`legend-dot dot-${index}`}
                                                        ></span>

                                                        <span>
                                                            {
                                                                plan.name
                                                            }
                                                        </span>

                                                    </div>


                                                    <strong>

                                                        {
                                                            plan.count
                                                        }

                                                        {" "}

                                                        <small>
                                                            (
                                                            {
                                                                plan.percentage
                                                            }%
                                                            )
                                                        </small>

                                                    </strong>

                                                </div>

                                            )

                                        )

                                    ) : (

                                        <div className="legend-item">

                                            <div className="legend-info">

                                                <span>
                                                    No active memberships
                                                </span>

                                            </div>

                                            <strong>
                                                0
                                            </strong>

                                        </div>

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

                                {seatUsage.length >
                                0 ? (

                                    seatUsage.map(
                                        (
                                            section
                                        ) => (

                                            <div
                                                className="seat-usage-item"
                                                key={
                                                    section.name
                                                }
                                            >

                                                <div className="seat-usage-top">

                                                    <div className="seat-name">

                                                        <div className="seat-icon">

                                                            <i
                                                                className={`fa-solid ${section.icon || "fa-chair"}`}
                                                            ></i>

                                                        </div>


                                                        <div>

                                                            <strong>
                                                                {
                                                                    section.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    section.seats
                                                                }{" "}
                                                                of{" "}
                                                                {
                                                                    section.total
                                                                } seats
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <strong className="seat-percentage">

                                                        {
                                                            section.percentage
                                                        }%

                                                    </strong>

                                                </div>


                                                <div className="seat-progress">

                                                    <div
                                                        style={{
                                                            width:
                                                                `${section.percentage}%`
                                                        }}
                                                    ></div>

                                                </div>

                                            </div>

                                        )

                                    )

                                ) : (

                                    <div className="seat-usage-item">

                                        <div className="seat-usage-top">

                                            <div className="seat-name">

                                                <div className="seat-icon">

                                                    <i className="fa-solid fa-chair"></i>

                                                </div>


                                                <div>

                                                    <strong>
                                                        No seat data
                                                    </strong>

                                                    <span>
                                                        Seat information unavailable
                                                    </span>

                                                </div>

                                            </div>

                                            <strong className="seat-percentage">
                                                0%
                                            </strong>

                                        </div>


                                        <div className="seat-progress">

                                            <div
                                                style={{
                                                    width:
                                                        "0%"
                                                }}
                                            ></div>

                                        </div>

                                    </div>

                                )}

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
                                            {
                                                paymentOverview.totalTransactions
                                            }
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
                                                {
                                                    paymentOverview.successful
                                                }{" "}
                                                transactions
                                            </small>

                                        </div>


                                        <b>

                                            {
                                                paymentOverview.successRate
                                            }%

                                        </b>

                                    </div>


                                    <div className="payment-status-item">

                                        <span className="status-dot pending"></span>


                                        <div>

                                            <strong>
                                                Pending
                                            </strong>

                                            <small>
                                                {
                                                    paymentOverview.pending
                                                }{" "}
                                                transactions
                                            </small>

                                        </div>


                                        <b>

                                            {
                                                paymentOverview.totalTransactions >
                                                0
                                                    ? Number(
                                                        (
                                                            (
                                                                paymentOverview.pending /
                                                                paymentOverview.totalTransactions
                                                            ) *
                                                            100
                                                        ).toFixed(
                                                            1
                                                        )
                                                    )
                                                    : 0
                                            }%

                                        </b>

                                    </div>


                                    <div className="payment-status-item">

                                        <span className="status-dot failed"></span>


                                        <div>

                                            <strong>
                                                Failed
                                            </strong>

                                            <small>
                                                {
                                                    paymentOverview.failed
                                                }{" "}
                                                transactions
                                            </small>

                                        </div>


                                        <b>

                                            {
                                                paymentOverview.totalTransactions >
                                                0
                                                    ? Number(
                                                        (
                                                            (
                                                                paymentOverview.failed /
                                                                paymentOverview.totalTransactions
                                                            ) *
                                                            100
                                                        ).toFixed(
                                                            1
                                                        )
                                                    )
                                                    : 0
                                            }%

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
                                        Generated from current database data
                                    </p>

                                </div>

                            </div>


                            <div className="insights-list">


                                {/* REVENUE INSIGHT */}

                                <div className="insight-item">

                                    <div className="insight-icon success">

                                        <i className="fa-solid fa-arrow-trend-up"></i>

                                    </div>


                                    <div>

                                        <strong>
                                            Revenue activity
                                        </strong>

                                        <p>

                                            {revenueGrowth >=
                                            0

                                                ? `Current month revenue is ${formatAmount(
                                                    currentMonthData.revenue
                                                )}, up ${Math.abs(
                                                    revenueGrowth
                                                )}% from the previous month.`

                                                : `Current month revenue is ${formatAmount(
                                                    currentMonthData.revenue
                                                )}, down ${Math.abs(
                                                    revenueGrowth
                                                )}% from the previous month.`}

                                        </p>

                                    </div>

                                </div>


                                {/* MEMBERSHIP INSIGHT */}

                                <div className="insight-item">

                                    <div className="insight-icon info">

                                        <i className="fa-solid fa-users"></i>

                                    </div>


                                    <div>

                                        <strong>
                                            Membership distribution
                                        </strong>

                                        <p>

                                            {reportData
                                                ?.insights
                                                ?.premiumPercentage
                                                !==
                                                undefined

                                                ? `Premium Reader accounts represent ${reportData.insights.premiumPercentage}% of active memberships.`

                                                : "Active membership distribution is currently unavailable."}

                                        </p>

                                    </div>

                                </div>


                                {/* SEAT INSIGHT */}

                                <div className="insight-item">

                                    <div className="insight-icon warning">

                                        <i className="fa-solid fa-chair"></i>

                                    </div>


                                    <div>

                                        <strong>
                                            Seat utilization
                                        </strong>

                                        <p>

                                            {reportData
                                                ?.insights
                                                ?.highestOccupancySection &&
                                            reportData
                                                ?.insights
                                                ?.highestOccupancy

                                                ? `${reportData.insights.highestOccupancySection} has the highest current utilization at ${reportData.insights.highestOccupancy}%.`

                                                : "Seat utilization data is currently unavailable."}

                                        </p>

                                    </div>

                                </div>


                                {/* PAYMENT INSIGHT */}

                                <div className="insight-item">

                                    <div className="insight-icon purple">

                                        <i className="fa-solid fa-credit-card"></i>

                                    </div>


                                    <div>

                                        <strong>
                                            Payment success rate
                                        </strong>

                                        <p>

                                            {
                                                paymentOverview.successRate
                                            }% of recorded payments in the report period were successful.

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
                                    Recent recorded library performance
                                </p>

                            </div>


                            <span className="report-period-label">

                                {
                                    reportData
                                        ?.period
                                        ?.year ||
                                    new Date()
                                        .getFullYear()
                                }

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

                                    {[
                                        ...monthlyData
                                    ]
                                        .reverse()
                                        .slice(
                                            0,
                                            5
                                        )
                                        .map(
                                            (
                                                item,
                                                index
                                            ) => (

                                                <tr
                                                    key={`${item.year}-${item.month}-table`}
                                                >


                                                    <td>

                                                        <div className="month-name">

                                                            <span>
                                                                {
                                                                    index +
                                                                    1
                                                                }
                                                            </span>

                                                            <strong>
                                                                {
                                                                    item.monthName ||
                                                                    item.month
                                                                }
                                                                {" "}
                                                                {
                                                                    item.year ||
                                                                    ""
                                                                }
                                                            </strong>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <strong className="table-revenue">

                                                            {
                                                                formatAmount(
                                                                    item.revenue
                                                                )
                                                            }

                                                        </strong>

                                                    </td>


                                                    <td>

                                                        <span className="table-number">

                                                            {
                                                                item.reservations
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span className="table-number">

                                                            {
                                                                item.members
                                                            }

                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="table-occupancy">

                                                            <div className="mini-progress">

                                                                <span
                                                                    style={{
                                                                        width:
                                                                            `${item.occupancy}%`
                                                                    }}
                                                                ></span>

                                                            </div>


                                                            <strong>

                                                                {
                                                                    item.occupancy
                                                                }%

                                                            </strong>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span className="performance-status">

                                                            <span></span>

                                                            {

                                                                index ===
                                                                0

                                                                    ? "Current"

                                                                    : "Recorded"

                                                            }

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
                                Report figures are generated from the
                                current LibraSpace MongoDB data. Revenue
                                uses successful payments, reservation and
                                member trends use their recorded dates,
                                membership distribution uses active
                                memberships, and seat occupancy uses the
                                current seat status.
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