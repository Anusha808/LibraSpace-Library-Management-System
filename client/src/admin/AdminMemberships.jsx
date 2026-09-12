import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminMemberships.css";


/* =========================================================
   INITIAL MEMBERSHIP DATA
========================================================= */

const initialMemberships = [
    {
        id: "MEM-001",
        memberName: "Ananya Sharma",
        email: "ananya.sharma@gmail.com",
        studentId: "LIB2026001",
        plan: "Premium Reader",
        amount: 499,
        startDate: "12 Sep 2026",
        expiryDate: "10 Oct 2026",
        status: "Active",
    },

    {
        id: "MEM-002",
        memberName: "Rahul Kumar",
        email: "rahul.kumar@gmail.com",
        studentId: "LIB2026002",
        plan: "Premium Reader",
        amount: 499,
        startDate: "05 Aug 2026",
        expiryDate: "05 Oct 2026",
        status: "Active",
    },

    {
        id: "MEM-003",
        memberName: "Priya Nair",
        email: "priya.nair@gmail.com",
        studentId: "LIB2026003",
        plan: "Basic Reader",
        amount: 299,
        startDate: "15 Jul 2026",
        expiryDate: "15 Sep 2026",
        status: "Expiring Soon",
    },

    {
        id: "MEM-004",
        memberName: "Arjun Menon",
        email: "arjun.menon@gmail.com",
        studentId: "LIB2026004",
        plan: "Premium Reader",
        amount: 499,
        startDate: "20 Jun 2026",
        expiryDate: "20 Sep 2026",
        status: "Active",
    },

    {
        id: "MEM-005",
        memberName: "Sneha Reddy",
        email: "sneha.reddy@gmail.com",
        studentId: "LIB2026005",
        plan: "Premium Reader",
        amount: 499,
        startDate: "10 Mar 2026",
        expiryDate: "10 Sep 2026",
        status: "Expired",
    },

    {
        id: "MEM-006",
        memberName: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        studentId: "LIB2026006",
        plan: "Basic Reader",
        amount: 299,
        startDate: "18 Aug 2026",
        expiryDate: "18 Sep 2026",
        status: "Expiring Soon",
    },

    {
        id: "MEM-007",
        memberName: "Meera Iyer",
        email: "meera.iyer@gmail.com",
        studentId: "LIB2026007",
        plan: "Premium Reader",
        amount: 499,
        startDate: "12 May 2026",
        expiryDate: "12 Oct 2026",
        status: "Active",
    },

    {
        id: "MEM-008",
        memberName: "Karan Patel",
        email: "karan.patel@gmail.com",
        studentId: "LIB2026008",
        plan: "Basic Reader",
        amount: 299,
        startDate: "03 Jan 2026",
        expiryDate: "03 Jul 2026",
        status: "Expired",
    },

    {
        id: "MEM-009",
        memberName: "Divya Krishnan",
        email: "divya.krishnan@gmail.com",
        studentId: "LIB2026009",
        plan: "Premium Reader",
        amount: 499,
        startDate: "01 Sep 2026",
        expiryDate: "01 Oct 2026",
        status: "Active",
    },

    {
        id: "MEM-010",
        memberName: "Aditya Rao",
        email: "aditya.rao@gmail.com",
        studentId: "LIB2026010",
        plan: "Premium Reader",
        amount: 499,
        startDate: "25 Aug 2026",
        expiryDate: "25 Sep 2026",
        status: "Expiring Soon",
    },

    {
        id: "MEM-011",
        memberName: "Nisha Kapoor",
        email: "nisha.kapoor@gmail.com",
        studentId: "LIB2026011",
        plan: "Basic Reader",
        amount: 299,
        startDate: "08 Aug 2026",
        expiryDate: "08 Sep 2026",
        status: "Expired",
    },

    {
        id: "MEM-012",
        memberName: "Rohan Das",
        email: "rohan.das@gmail.com",
        studentId: "LIB2026012",
        plan: "Premium Reader",
        amount: 499,
        startDate: "02 Sep 2026",
        expiryDate: "02 Oct 2026",
        status: "Active",
    },
];


/* =========================================================
   ADMIN MEMBERSHIPS
========================================================= */

function AdminMemberships() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    const isActive = (path) => {

        return location.pathname === path
            ? "active"
            : "";

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        navigate("/admin/login");

    };


    /* =====================================================
       STATES
    ===================================================== */

    const [memberships, setMemberships] =
        useState(initialMemberships);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [selectedMembership, setSelectedMembership] =
        useState(null);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const stats = useMemo(() => {

        return {

            total: memberships.length,

            active: memberships.filter(
                (membership) =>
                    membership.status === "Active"
            ).length,

            expiring: memberships.filter(
                (membership) =>
                    membership.status === "Expiring Soon"
            ).length,

            expired: memberships.filter(
                (membership) =>
                    membership.status === "Expired"
            ).length,

        };

    }, [memberships]);


    /* =====================================================
       SEARCH AND FILTER
    ===================================================== */

    const filteredMemberships = useMemo(() => {

        return memberships.filter((membership) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            const matchesSearch =

                membership.memberName
                    .toLowerCase()
                    .includes(search)

                ||

                membership.email
                    .toLowerCase()
                    .includes(search)

                ||

                membership.studentId
                    .toLowerCase()
                    .includes(search)

                ||

                membership.id
                    .toLowerCase()
                    .includes(search)

                ||

                membership.plan
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                statusFilter === "All"

                ||

                membership.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        memberships,
        searchTerm,
        statusFilter
    ]);


    /* =====================================================
       RENEW MEMBERSHIP
    ===================================================== */

    const handleRenew = (id) => {

        const updatedMemberships =
            memberships.map((membership) => {

                if (membership.id === id) {

                    return {
                        ...membership,

                        status: "Active",

                        startDate: "12 Sep 2026",

                        expiryDate: "12 Oct 2026",
                    };

                }

                return membership;

            });


        setMemberships(updatedMemberships);


        setSelectedMembership(null);


        alert(
            "Membership renewed successfully."
        );

    };


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = (status) => {

        if (status === "Active") {

            return "status-active";

        }

        if (status === "Expiring Soon") {

            return "status-expiring";

        }

        return "status-expired";

    };


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


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="admin-navigation">


                    {/* MAIN MENU */}

                    <p className="admin-nav-title">
                        MAIN MENU
                    </p>


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


                    <Link
                        to="/admin/books"
                        className={`admin-nav-link ${isActive(
                            "/admin/books"
                        )}`}
                    >

                        <span>
                            📚
                        </span>

                        Manage Books

                    </Link>


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


                    {/* =================================================
                        MANAGEMENT
                    ================================================= */}

                    <p className="admin-nav-title second-title">
                        MANAGEMENT
                    </p>


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


                    {/* =================================================
                        SYSTEM
                    ================================================= */}

                    <p className="admin-nav-title second-title">
                        SYSTEM
                    </p>


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


                {/* =================================================
                    SIDEBAR BOTTOM
                ================================================= */}

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
                                {memberships
                                    .reduce(
                                        (
                                            total,
                                            membership
                                        ) =>
                                            total +
                                            membership.amount,
                                        0
                                    )
                                    .toLocaleString("en-IN")}

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


                                    {filteredMemberships.length > 0 ? (

                                        filteredMemberships.map(
                                            (membership) => (

                                                <tr
                                                    key={membership.id}
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

                                                                {membership.memberName
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
                                                            {membership.amount.toLocaleString(
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
                                                                            membership.id
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


                                        /* NO RESULTS */

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
                            setSelectedMembership(null)
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
                                        setSelectedMembership(null)
                                    }
                                >

                                    ×

                                </button>


                            </div>


                            {/* MEMBER */}

                            <div className="modal-member">


                                <div className="modal-avatar">

                                    {selectedMembership.memberName
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
                                        Amount Paid
                                    </span>

                                    <strong>
                                        ₹
                                        {selectedMembership.amount.toLocaleString(
                                            "en-IN"
                                        )}
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
                                                selectedMembership.id
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
                                        setSelectedMembership(null)
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