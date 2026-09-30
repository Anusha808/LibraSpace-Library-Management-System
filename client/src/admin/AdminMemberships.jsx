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

import "./AdminMemberships.css";


/* =========================================================
   API
========================================================= */

const API_BASE =
    "http://localhost:5000/api/admin/memberships";


/* =========================================================
   ADMIN MEMBERSHIPS
========================================================= */

function AdminMemberships() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [
        memberships,
        setMemberships
    ] = useState([]);

    const [
        searchTerm,
        setSearchTerm
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter
    ] = useState("All");

    const [
        selectedMembership,
        setSelectedMembership
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");


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
       ACTIVE NAVIGATION
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
       FORMAT DATE
    ===================================================== */

    const formatDate = (dateValue) => {

        if (!dateValue) {

            return "—";

        }


        const date =
            new Date(dateValue);


        if (Number.isNaN(
            date.getTime()
        )) {

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
       CALCULATE STATUS
    ===================================================== */

    const calculateStatus = (
        membership
    ) => {

        if (
            membership.status ===
            "cancelled"
        ) {

            return "Expired";

        }


        if (
            membership.status ===
            "expired"
        ) {

            return "Expired";

        }


        if (!membership.expiryDate) {

            return "Active";

        }


        const today =
            new Date();


        const expiryDate =
            new Date(
                membership.expiryDate
            );


        const difference =
            expiryDate.getTime() -
            today.getTime();


        const daysRemaining =
            Math.ceil(
                difference /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        if (
            daysRemaining < 0
        ) {

            return "Expired";

        }


        if (
            daysRemaining <= 7
        ) {

            return "Expiring Soon";

        }


        return "Active";

    };


    /* =====================================================
       LOAD MEMBERSHIPS
    ===================================================== */

    const loadMemberships =
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
                        "Unable to load memberships."
                    );

                }


                const serverMemberships =
                    Array.isArray(
                        data.memberships
                    )
                        ? data.memberships
                        : [];


                const formattedMemberships =
                    serverMemberships.map(
                        (
                            membership,
                            index
                        ) => {

                            const user =
                                membership.user ||
                                {};


                            const status =
                                calculateStatus(
                                    membership
                                );


                            const studentId =
                                `LIB${new Date(
                                    membership.startDate ||
                                    membership.createdAt ||
                                    Date.now()
                                ).getFullYear()}${String(
                                    user._id ||
                                    membership._id ||
                                    index
                                )
                                    .slice(-6)
                                    .toUpperCase()}`;


                            return {

                                _id:
                                    membership._id,

                                id:
                                    `MEM-${String(
                                        membership._id ||
                                        index
                                    )
                                        .slice(-6)
                                        .toUpperCase()}`,

                                memberName:
                                    user.name ||
                                    "Unknown Member",

                                email:
                                    user.email ||
                                    "—",

                                studentId,

                                plan:
                                    membership.planName ||
                                    "No Plan",

                                amount:
                                    Number(
                                        membership.monthlyFee ||
                                        membership.amount ||
                                        0
                                    ),

                                startDate:
                                    formatDate(
                                        membership.startDate
                                    ),

                                expiryDate:
                                    formatDate(
                                        membership.expiryDate
                                    ),

                                rawStartDate:
                                    membership.startDate,

                                rawExpiryDate:
                                    membership.expiryDate,

                                status,

                                duration:
                                    membership.planType ||
                                    "—"

                            };

                        }
                    );


                setMemberships(
                    formattedMemberships
                );

            } catch (err) {

                console.error(
                    "Load memberships error:",
                    err
                );


                setError(
                    err.message ||
                    "Unable to load memberships."
                );

            } finally {

                setLoading(false);

            }

        };


    /* =====================================================
       LOAD ON PAGE OPEN
    ===================================================== */

    useEffect(() => {

        loadMemberships();

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
       STATISTICS
    ===================================================== */

    const stats = useMemo(() => {

        return {

            total:
                memberships.length,

            active:
                memberships.filter(
                    (membership) =>
                        membership.status ===
                        "Active"
                ).length,

            expiring:
                memberships.filter(
                    (membership) =>
                        membership.status ===
                        "Expiring Soon"
                ).length,

            expired:
                memberships.filter(
                    (membership) =>
                        membership.status ===
                        "Expired"
                ).length

        };

    }, [memberships]);


    /* =====================================================
       TOTAL RECORDED AMOUNT
    ===================================================== */

    const totalAmount =
        useMemo(() => {

            return memberships.reduce(
                (
                    total,
                    membership
                ) =>
                    total +
                    Number(
                        membership.amount ||
                        0
                    ),
                0
            );

        }, [memberships]);


    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    const filteredMemberships =
        useMemo(() => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            return memberships.filter(
                (membership) => {

                    const matchesSearch =

                        String(
                            membership.memberName ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            membership.email ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            membership.studentId ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            membership.id ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search)

                        ||

                        String(
                            membership.plan ||
                            ""
                        )
                            .toLowerCase()
                            .includes(search);


                    const matchesStatus =

                        statusFilter ===
                        "All"

                        ||

                        membership.status ===
                        statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            memberships,
            searchTerm,
            statusFilter
        ]);


    /* =====================================================
       RENEW MEMBERSHIP
    ===================================================== */

    const handleRenew = async (
        membership
    ) => {

        const confirmed =
            window.confirm(
                `Renew membership for ${membership.memberName}?`
            );


        if (!confirmed) {

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_BASE}/${membership._id}/renew`,
                    {
                        method: "PATCH",
                        headers:
                            getHeaders()
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to renew membership."
                );

            }


            alert(
                "Membership renewed successfully."
            );


            setSelectedMembership(
                null
            );


            await loadMemberships();


        } catch (err) {

            console.error(
                "Renew membership error:",
                err
            );


            alert(
                err.message ||
                "Failed to renew membership."
            );

        }

    };


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = (
        status
    ) => {

        if (
            status ===
            "Active"
        ) {

            return "status-active";

        }


        if (
            status ===
            "Expiring Soon"
        ) {

            return "status-expiring";

        }


        return "status-expired";

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="admin-memberships-page">


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


                    {/* MAIN MENU */}

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


                {/* SIDEBAR BOTTOM */}

                <div className="admin-sidebar-bottom">

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={handleLogout}
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


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <header className="admin-topbar">


                    <div className="admin-topbar-left">

                        <span className="admin-page-label">
                            ADMINISTRATOR
                        </span>

                        <h1>
                            Membership Management
                        </h1>

                    </div>


                    <div className="admin-topbar-right">


                        {/* NOTIFICATION */}

                        <button
                            type="button"
                            className="admin-notification"
                            title="Notifications"
                        >

                            🔔

                            <span></span>

                        </button>


                        {/* PROFILE */}

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


                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="memberships-content">


                    {/* =================================================
                        BREADCRUMB
                    ================================================= */}

                    <div className="breadcrumb">

                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <span>
                            /
                        </span>

                        <strong>
                            Memberships
                        </strong>

                    </div>


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="page-header">

                        <div>

                            <span className="page-label">
                                MEMBERSHIP MANAGEMENT
                            </span>

                            <h1>
                                Manage Memberships
                            </h1>

                            <p>
                                Monitor, manage and renew library
                                memberships.
                            </p>

                        </div>


                        <div className="header-icon">
                            🎫
                        </div>

                    </div>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <div className="membership-stats">


                        {/* TOTAL */}

                        <div className="membership-stat-card">

                            <div className="stat-icon total">
                                🎫
                            </div>

                            <div className="stat-details">

                                <span>
                                    Total Memberships
                                </span>

                                <h2>
                                    {stats.total}
                                </h2>

                                <small>
                                    All memberships
                                </small>

                            </div>

                        </div>


                        {/* ACTIVE */}

                        <div className="membership-stat-card">

                            <div className="stat-icon active">
                                ✓
                            </div>

                            <div className="stat-details">

                                <span>
                                    Active Memberships
                                </span>

                                <h2>
                                    {stats.active}
                                </h2>

                                <small>
                                    Currently active
                                </small>

                            </div>

                        </div>


                        {/* EXPIRING */}

                        <div className="membership-stat-card">

                            <div className="stat-icon expiring">
                                ⏰
                            </div>

                            <div className="stat-details">

                                <span>
                                    Expiring Soon
                                </span>

                                <h2>
                                    {stats.expiring}
                                </h2>

                                <small>
                                    Requires attention
                                </small>

                            </div>

                        </div>


                        {/* EXPIRED */}

                        <div className="membership-stat-card">

                            <div className="stat-icon expired">
                                ✕
                            </div>

                            <div className="stat-details">

                                <span>
                                    Expired
                                </span>

                                <h2>
                                    {stats.expired}
                                </h2>

                                <small>
                                    Need renewal
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        MEMBERSHIP OVERVIEW
                    ================================================= */}

                    <div className="membership-overview">


                        <div className="overview-content">

                            <div className="overview-icon">
                                📊
                            </div>


                            <div>

                                <span>
                                    Membership Overview
                                </span>

                                <h3>
                                    {stats.active} active memberships
                                </h3>

                                <p>
                                    Keep track of active, expiring and
                                    expired memberships from one place.
                                </p>

                            </div>

                        </div>


                        <div className="overview-highlight">

                            <strong>

                                ₹
                                {totalAmount.toLocaleString(
                                    "en-IN"
                                )}

                            </strong>

                            <span>
                                Total Recorded Payments
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        MEMBERSHIP PANEL
                    ================================================= */}

                    <div className="membership-panel">


                        {/* PANEL HEADER */}

                        <div className="panel-header">

                            <div>

                                <span className="panel-eyebrow">
                                    MEMBERSHIPS
                                </span>

                                <h2>
                                    Membership Records
                                </h2>

                                <p>
                                    View and manage all membership plans.
                                </p>

                            </div>


                            <div className="record-count">

                                {filteredMemberships.length}
                                {" "}
                                Records

                            </div>

                        </div>


                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <div className="filters">


                            {/* SEARCH */}

                            <div className="search-box">

                                <span>
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    placeholder="Search member, ID, email or plan..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* STATUS FILTER */}

                            <div className="filter-box">

                                <span>
                                    ⚙️
                                </span>

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

                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Expiring Soon">
                                        Expiring Soon
                                    </option>

                                    <option value="Expired">
                                        Expired
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
                                    background: "#fdf0f0",
                                    color: "#b45353",
                                    border: "1px solid #efcccc"
                                }}
                            >

                                {error}

                                <button
                                    type="button"
                                    onClick={
                                        loadMemberships
                                    }
                                    style={{
                                        marginLeft: "12px",
                                        cursor: "pointer"
                                    }}
                                >

                                    Retry

                                </button>

                            </div>

                        )}


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="membership-table-wrapper">

                            <table className="membership-table">


                                <thead>

                                    <tr>

                                        <th>
                                            Membership
                                        </th>

                                        <th>
                                            Member
                                        </th>

                                        <th>
                                            Plan
                                        </th>

                                        <th>
                                            Amount
                                        </th>

                                        <th>
                                            Start Date
                                        </th>

                                        <th>
                                            Expiry Date
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="no-results"
                                            >

                                                <div>

                                                    <span>
                                                        ⏳
                                                    </span>

                                                    <h3>
                                                        Loading memberships...
                                                    </h3>

                                                    <p>
                                                        Fetching membership data from MongoDB.
                                                    </p>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : filteredMemberships.length > 0 ? (

                                        filteredMemberships.map(
                                            (
                                                membership
                                            ) => (

                                                <tr
                                                    key={
                                                        membership._id ||
                                                        membership.id
                                                    }
                                                >


                                                    {/* MEMBERSHIP */}

                                                    <td>

                                                        <div className="membership-id">

                                                            <div className="membership-id-icon">
                                                                🎫
                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {membership.id}
                                                                </strong>

                                                                <span>
                                                                    {membership.studentId}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* MEMBER */}

                                                    <td>

                                                        <div className="member-info">

                                                            <div className="member-avatar">

                                                                {String(
                                                                    membership.memberName ||
                                                                    "M"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {membership.memberName}
                                                                </strong>

                                                                <span>
                                                                    {membership.email}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* PLAN */}

                                                    <td>

                                                        <span
                                                            className={
                                                                membership.plan ===
                                                                "Premium Reader"
                                                                    ? "plan-badge premium"
                                                                    : "plan-badge basic"
                                                            }
                                                        >

                                                            <span>

                                                                {membership.plan ===
                                                                "Premium Reader"
                                                                    ? "👑"
                                                                    : "📚"}

                                                            </span>

                                                            {membership.plan}

                                                        </span>

                                                    </td>


                                                    {/* AMOUNT */}

                                                    <td>

                                                        <strong className="amount">

                                                            ₹
                                                            {Number(
                                                                membership.amount ||
                                                                0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}

                                                        </strong>

                                                    </td>


                                                    {/* START DATE */}

                                                    <td>

                                                        <span className="date-text">
                                                            {membership.startDate}
                                                        </span>

                                                    </td>


                                                    {/* EXPIRY DATE */}

                                                    <td>

                                                        <span className="date-text">
                                                            {membership.expiryDate}
                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={`membership-status ${getStatusClass(
                                                                membership.status
                                                            )}`}
                                                        >

                                                            <span className="status-dot"></span>

                                                            {membership.status}

                                                        </span>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td>

                                                        <div className="action-buttons">


                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                className="action-btn view"
                                                                title="View Membership"
                                                                onClick={() =>
                                                                    setSelectedMembership(
                                                                        membership
                                                                    )
                                                                }
                                                            >

                                                                👁️

                                                            </button>


                                                            {/* RENEW */}

                                                            {membership.status !==
                                                                "Active" && (

                                                                <button
                                                                    type="button"
                                                                    className="action-btn renew"
                                                                    title="Renew Membership"
                                                                    onClick={() =>
                                                                        handleRenew(
                                                                            membership
                                                                        )
                                                                    }
                                                                >

                                                                    🔄

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
                                                className="no-results"
                                            >

                                                <div>

                                                    <span>
                                                        🔍
                                                    </span>

                                                    <h3>
                                                        No memberships found
                                                    </h3>

                                                    <p>
                                                        Try changing your
                                                        search or filter.
                                                    </p>

                                                </div>

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>


                    {/* =================================================
                        MANAGEMENT TIPS
                    ================================================= */}

                    <div className="membership-tips">

                        <div className="tip-icon">
                            💡
                        </div>


                        <div>

                            <h3>
                                Membership Management Tip
                            </h3>

                            <p>
                                Review expiring memberships regularly
                                and encourage members to renew before
                                their membership expires.
                            </p>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    MEMBERSHIP DETAILS MODAL
                ================================================= */}

                {selectedMembership && (

                    <div
                        className="membership-modal-overlay"
                        onClick={() =>
                            setSelectedMembership(
                                null
                            )
                        }
                    >

                        <div
                            className="membership-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >


                            {/* MODAL HEADER */}

                            <div className="modal-header">

                                <div>

                                    <span>
                                        Membership Details
                                    </span>

                                    <h2>
                                        {selectedMembership.id}
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() =>
                                        setSelectedMembership(
                                            null
                                        )
                                    }
                                >

                                    ×

                                </button>

                            </div>


                            {/* MEMBER */}

                            <div className="modal-member">

                                <div className="modal-avatar">

                                    {String(
                                        selectedMembership.memberName ||
                                        "M"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>


                                <div>

                                    <h3>
                                        {selectedMembership.memberName}
                                    </h3>

                                    <p>
                                        {selectedMembership.email}
                                    </p>

                                </div>

                            </div>


                            {/* DETAILS */}

                            <div className="modal-details">


                                <div className="detail-item">

                                    <span>
                                        Student ID
                                    </span>

                                    <strong>
                                        {selectedMembership.studentId}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Membership Plan
                                    </span>

                                    <strong>
                                        {selectedMembership.plan}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            selectedMembership.amount ||
                                            0
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Membership Type
                                    </span>

                                    <strong>
                                        {selectedMembership.duration}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Start Date
                                    </span>

                                    <strong>
                                        {selectedMembership.startDate}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Expiry Date
                                    </span>

                                    <strong>
                                        {selectedMembership.expiryDate}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Status
                                    </span>

                                    <strong>

                                        <span
                                            className={`membership-status ${getStatusClass(
                                                selectedMembership.status
                                            )}`}
                                        >

                                            <span className="status-dot"></span>

                                            {selectedMembership.status}

                                        </span>

                                    </strong>

                                </div>

                            </div>


                            {/* MODAL ACTIONS */}

                            <div className="modal-actions">


                                {selectedMembership.status !==
                                    "Active" && (

                                    <button
                                        type="button"
                                        className="renew-membership-btn"
                                        onClick={() =>
                                            handleRenew(
                                                selectedMembership
                                            )
                                        }
                                    >

                                        🔄

                                        Renew Membership

                                    </button>

                                )}


                                <button
                                    type="button"
                                    className="close-modal-btn"
                                    onClick={() =>
                                        setSelectedMembership(
                                            null
                                        )
                                    }
                                >

                                    Close

                                </button>

                            </div>


                        </div>

                    </div>

                )}

            </main>

        </div>

    );

}


export default AdminMemberships;