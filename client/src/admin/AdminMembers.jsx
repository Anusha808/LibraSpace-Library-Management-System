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

import "./AdminMembers.css";


/* =========================================================
   API
========================================================= */

const API_BASE =
    "http://localhost:5000/api/admin/members";


/* =========================================================
   ADMIN MEMBERS
========================================================= */

function AdminMembers() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       STATES
    ===================================================== */

    const [members, setMembers] = useState([]);

    const [searchTerm, setSearchTerm] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [selectedMember, setSelectedMember] =
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
                localStorage.getItem("adminUser")
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
            localStorage.getItem("adminToken");

        return {

            "Content-Type":
                "application/json",

            ...(token
                ? {
                    Authorization:
                        `Bearer ${token}`
                }
                : {}),

        };

    };


    /* =====================================================
       LOAD MEMBERS
    ===================================================== */

    const loadMembers = async () => {

        try {

            setLoading(true);
            setError("");


            const response =
                await fetch(
                    API_BASE,
                    {
                        method: "GET",
                        headers: getHeaders(),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load members."
                );

            }


            setMembers(
                Array.isArray(data.members)
                    ? data.members
                    : []
            );


        } catch (err) {

            console.error(
                "Load members error:",
                err
            );

            setError(
                err.message ||
                "Unable to load members."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =====================================================
       LOAD ON PAGE OPEN
    ===================================================== */

    useEffect(() => {

        loadMembers();

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


        navigate("/admin/login");

    };


    /* =====================================================
       STATISTICS
    ===================================================== */

    const stats = useMemo(() => {

        const currentMonth =
            new Date().getMonth();

        const currentYear =
            new Date().getFullYear();


        const active =
            members.filter(
                (member) =>
                    member.status === "Active"
            ).length;


        const expiring =
            members.filter(
                (member) =>
                    member.status ===
                    "Expiring Soon"
            ).length;


        const newMembers =
            members.filter((member) => {

                if (!member.createdAt &&
                    !member.joinDate) {

                    return false;

                }


                const date =
                    new Date(
                        member.createdAt ||
                        member.joinDate
                    );


                return (
                    date.getMonth() ===
                    currentMonth &&
                    date.getFullYear() ===
                    currentYear
                );

            }).length;


        return {

            total:
                members.length,

            active,

            newMembers,

            expiring,

        };

    }, [members]);


    /* =====================================================
       SEARCH + FILTER
    ===================================================== */

    const filteredMembers = useMemo(() => {

        const search =
            searchTerm
                .toLowerCase()
                .trim();


        return members.filter(
            (member) => {


                const matchesSearch =

                    String(
                        member.name || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        member.email || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        member.id || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        member.plan || ""
                    )
                        .toLowerCase()
                        .includes(search);


                const matchesStatus =

                    statusFilter ===
                    "All"

                    ||

                    member.status ===
                    statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

    }, [
        members,
        searchTerm,
        statusFilter
    ]);


    /* =====================================================
       TOGGLE MEMBER STATUS
    ===================================================== */

    const toggleMemberStatus = async (
        member
    ) => {

        try {

            const isCurrentlyActive =
                member.isActive !== false;


            const newStatus =
                !isCurrentlyActive;


            const response =
                await fetch(
                    `${API_BASE}/${member._id || member.id}/status`,
                    {
                        method: "PATCH",
                        headers: getHeaders(),
                        body: JSON.stringify({
                            isActive: newStatus
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to update member status."
                );

            }


            await loadMembers();


            setSelectedMember(null);


            alert(
                newStatus
                    ? "Member activated successfully."
                    : "Member deactivated successfully."
            );


        } catch (err) {

            console.error(
                "Member status update error:",
                err
            );


            alert(
                err.message ||
                "Failed to update member status."
            );

        }

    };


    /* =====================================================
       STATUS CLASS
    ===================================================== */

    const getStatusClass = (status) => {

        switch (status) {

            case "Active":
                return "status-active";

            case "Expiring Soon":
                return "status-expiring";

            case "Expired":
                return "status-expired";

            case "Inactive":
                return "status-inactive";

            default:
                return "";

        }

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div className="admin-members-page">


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


                {/* SIDEBAR BOTTOM */}

                <div className="admin-sidebar-bottom">

                    <button
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
                MAIN CONTENT
            ================================================= */}

            <main className="admin-main">


                {/* TOPBAR */}

                <header className="admin-topbar">


                    <div className="admin-topbar-left">

                        <span className="admin-page-label">
                            ADMINISTRATOR
                        </span>

                        <h1>
                            Member Management
                        </h1>

                    </div>


                    <div className="admin-topbar-right">


                        {/* NOTIFICATION */}

                        <button
                            className="admin-notification"
                            title="Notifications"
                            type="button"
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


                {/* CONTENT */}

                <div className="members-content">


                    {/* BREADCRUMB */}

                    <div className="admin-breadcrumb">

                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <span>
                            /
                        </span>

                        <strong>
                            Members
                        </strong>

                    </div>


                    {/* PAGE HEADER */}

                    <section className="page-header">

                        <div>

                            <span className="page-label">
                                MEMBER MANAGEMENT
                            </span>

                            <h2>
                                Manage Members
                            </h2>

                            <p>
                                View, monitor and manage all registered
                                library members.
                            </p>

                        </div>


                        <div className="header-icon">
                            👥
                        </div>

                    </section>


                    {/* =================================================
                        STATISTICS
                    ================================================= */}

                    <section className="member-stats">


                        {/* TOTAL */}

                        <div className="member-stat-card">

                            <div className="stat-icon total">
                                👥
                            </div>

                            <div className="stat-details">

                                <span>
                                    Total Members
                                </span>

                                <h2>
                                    {stats.total}
                                </h2>

                                <small>
                                    Registered members
                                </small>

                            </div>

                        </div>


                        {/* ACTIVE */}

                        <div className="member-stat-card">

                            <div className="stat-icon active">
                                ✓
                            </div>

                            <div className="stat-details">

                                <span>
                                    Active Members
                                </span>

                                <h2>
                                    {stats.active}
                                </h2>

                                <small>
                                    Currently active
                                </small>

                            </div>

                        </div>


                        {/* NEW */}

                        <div className="member-stat-card">

                            <div className="stat-icon new">
                                +
                            </div>

                            <div className="stat-details">

                                <span>
                                    New Members
                                </span>

                                <h2>
                                    {stats.newMembers}
                                </h2>

                                <small>
                                    Joined this month
                                </small>

                            </div>

                        </div>


                        {/* EXPIRING */}

                        <div className="member-stat-card">

                            <div className="stat-icon expiring">
                                ⏰
                            </div>

                            <div className="stat-details">

                                <span>
                                    Expiring Memberships
                                </span>

                                <h2>
                                    {stats.expiring}
                                </h2>

                                <small>
                                    Requires attention
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* OVERVIEW BANNER */}

                    <section className="members-banner">


                        <div className="banner-content">

                            <div className="banner-icon">
                                👥
                            </div>


                            <div>

                                <span>
                                    MEMBER OVERVIEW
                                </span>

                                <h3>
                                    {stats.active} members are currently active
                                </h3>

                                <p>
                                    Monitor member accounts and membership
                                    status from the administration panel.
                                </p>

                            </div>

                        </div>


                        <div className="banner-number">

                            <strong>

                                {stats.total > 0
                                    ? Math.round(
                                        (
                                            stats.active /
                                            stats.total
                                        ) * 100
                                    )
                                    : 0
                                }%

                            </strong>

                            <span>
                                Active Rate
                            </span>

                        </div>

                    </section>


                    {/* MEMBER DIRECTORY */}

                    <section className="members-panel">


                        {/* PANEL HEADER */}

                        <div className="panel-header">

                            <div>

                                <span className="panel-eyebrow">
                                    MEMBERS
                                </span>

                                <h3>
                                    Member Directory
                                </h3>

                                <p>
                                    Search and manage registered library
                                    members.
                                </p>

                            </div>


                            <div className="record-count">

                                {filteredMembers.length}
                                {" "}
                                Records

                            </div>

                        </div>


                        {/* FILTERS */}

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

                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* ERROR */}

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
                                    onClick={loadMembers}
                                    style={{
                                        marginLeft: "12px",
                                        cursor: "pointer"
                                    }}
                                >
                                    Retry
                                </button>

                            </div>

                        )}


                        {/* TABLE */}

                        <div className="members-table-wrapper">

                            <table className="members-table">


                                <thead>

                                    <tr>

                                        <th>
                                            Member
                                        </th>

                                        <th>
                                            Student ID
                                        </th>

                                        <th>
                                            Plan
                                        </th>

                                        <th>
                                            Join Date
                                        </th>

                                        <th>
                                            Expiry Date
                                        </th>

                                        <th>
                                            Reservations
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
                                                        Loading members...
                                                    </h3>

                                                    <p>
                                                        Fetching member data from MongoDB.
                                                    </p>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : filteredMembers.length > 0 ? (

                                        filteredMembers.map(
                                            (member) => (

                                                <tr
                                                    key={
                                                        member._id ||
                                                        member.id
                                                    }
                                                >


                                                    {/* MEMBER */}

                                                    <td>

                                                        <div className="member-info">

                                                            <div className="member-avatar">

                                                                {String(
                                                                    member.name ||
                                                                    "M"
                                                                )
                                                                    .charAt(0)
                                                                    .toUpperCase()}

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {member.name}
                                                                </strong>

                                                                <span>
                                                                    {member.email}
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* STUDENT ID */}

                                                    <td>

                                                        <span className="student-id">

                                                            {member.id}

                                                        </span>

                                                    </td>


                                                    {/* PLAN */}

                                                    <td>

                                                        <span
                                                            className={
                                                                member.plan ===
                                                                "Premium Reader"
                                                                    ? "plan-badge premium"
                                                                    : "plan-badge basic"
                                                            }
                                                        >

                                                            <span>

                                                                {member.plan ===
                                                                "Premium Reader"
                                                                    ? "👑"
                                                                    : "📚"}

                                                            </span>

                                                            {member.plan ||
                                                                "No Membership"}

                                                        </span>

                                                    </td>


                                                    {/* JOIN DATE */}

                                                    <td>

                                                        <span className="date-text">
                                                            {member.joinDate ||
                                                                "—"}
                                                        </span>

                                                    </td>


                                                    {/* EXPIRY DATE */}

                                                    <td>

                                                        <span className="date-text">
                                                            {member.expiryDate ||
                                                                "—"}
                                                        </span>

                                                    </td>


                                                    {/* RESERVATIONS */}

                                                    <td>

                                                        <div className="reservation-count">

                                                            <span>
                                                                📅
                                                            </span>

                                                            <strong>
                                                                {member.reservations ??
                                                                    0}
                                                            </strong>

                                                        </div>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={`member-status ${getStatusClass(
                                                                member.status
                                                            )}`}
                                                        >

                                                            <span className="status-dot"></span>

                                                            {member.status ||
                                                                "Unknown"}

                                                        </span>

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td>

                                                        <div className="action-buttons">


                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                className="action-btn view"
                                                                title="View Member"
                                                                onClick={() =>
                                                                    setSelectedMember(
                                                                        member
                                                                    )
                                                                }
                                                            >

                                                                👁️

                                                            </button>


                                                            {/* TOGGLE */}

                                                            <button
                                                                type="button"
                                                                className="action-btn toggle"
                                                                title={
                                                                    member.isActive !==
                                                                    false
                                                                        ? "Deactivate Member"
                                                                        : "Activate Member"
                                                                }
                                                                onClick={() =>
                                                                    toggleMemberStatus(
                                                                        member
                                                                    )
                                                                }
                                                            >

                                                                {member.isActive !==
                                                                false
                                                                    ? "🚫"
                                                                    : "✓"}

                                                            </button>

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
                                                        👤
                                                    </span>

                                                    <h3>
                                                        No members found
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

                    </section>


                    {/* MANAGEMENT TIP */}

                    <section className="management-tip">

                        <div className="tip-icon">
                            💡
                        </div>

                        <div>

                            <h3>
                                Member Management Tip
                            </h3>

                            <p>
                                Regularly review inactive and expiring
                                members to keep your library membership
                                records accurate and up to date.
                            </p>

                        </div>

                    </section>


                    {/* FOOTER */}

                    <footer className="admin-footer">

                        <p>
                            © 2026 LibraSpace. All Rights Reserved.
                        </p>

                        <span>
                            Admin Management System
                        </span>

                    </footer>

                </div>


                {/* =================================================
                    MEMBER DETAILS MODAL
                ================================================= */}

                {selectedMember && (

                    <div
                        className="member-modal-overlay"
                        onClick={() =>
                            setSelectedMember(null)
                        }
                    >

                        <div
                            className="member-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >


                            {/* MODAL HEADER */}

                            <div className="modal-header">

                                <div>

                                    <span>
                                        Member Details
                                    </span>

                                    <h2>
                                        {selectedMember.id}
                                    </h2>

                                </div>


                                <button
                                    type="button"
                                    className="modal-close"
                                    onClick={() =>
                                        setSelectedMember(null)
                                    }
                                >

                                    ×

                                </button>

                            </div>


                            {/* PROFILE */}

                            <div className="modal-member">

                                <div className="modal-avatar">

                                    {String(
                                        selectedMember.name ||
                                        "M"
                                    )
                                        .charAt(0)
                                        .toUpperCase()}

                                </div>


                                <div>

                                    <h3>
                                        {selectedMember.name}
                                    </h3>

                                    <p>
                                        {selectedMember.email}
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
                                        {selectedMember.id}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {selectedMember.phone ||
                                            "—"}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Membership Plan
                                    </span>

                                    <strong>
                                        {selectedMember.plan ||
                                            "No Membership"}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Total Reservations
                                    </span>

                                    <strong>
                                        {selectedMember.reservations ??
                                            0}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Join Date
                                    </span>

                                    <strong>
                                        {selectedMember.joinDate ||
                                            "—"}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Membership Expiry
                                    </span>

                                    <strong>
                                        {selectedMember.expiryDate ||
                                            "—"}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Account Status
                                    </span>

                                    <strong>

                                        <span
                                            className={`member-status ${getStatusClass(
                                                selectedMember.status
                                            )}`}
                                        >

                                            <span className="status-dot"></span>

                                            {selectedMember.status ||
                                                "Unknown"}

                                        </span>

                                    </strong>

                                </div>

                            </div>


                            {/* MODAL ACTIONS */}

                            <div className="modal-actions">


                                <button
                                    type="button"
                                    className={
                                        selectedMember.isActive !==
                                        false
                                            ? "deactivate-btn"
                                            : "activate-btn"
                                    }
                                    onClick={() =>
                                        toggleMemberStatus(
                                            selectedMember
                                        )
                                    }
                                >

                                    {selectedMember.isActive !==
                                    false
                                        ? "🚫 Deactivate Member"
                                        : "✓ Activate Member"}

                                </button>


                                <button
                                    type="button"
                                    className="close-modal-btn"
                                    onClick={() =>
                                        setSelectedMember(null)
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


export default AdminMembers;