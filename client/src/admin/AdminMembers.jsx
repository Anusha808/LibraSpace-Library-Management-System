import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminMembers.css";


/* =========================================================
   SAMPLE MEMBER DATA
========================================================= */

const initialMembers = [
    {
        id: "LIB2026001",
        name: "Ananya Sharma",
        email: "ananya.sharma@gmail.com",
        phone: "+91 98765 43210",
        plan: "Premium Reader",
        joinDate: "12 Sep 2026",
        expiryDate: "10 Oct 2026",
        status: "Active",
        reservations: 12,
    },

    {
        id: "LIB2026002",
        name: "Rahul Kumar",
        email: "rahul.kumar@gmail.com",
        phone: "+91 98765 12345",
        plan: "Premium Reader",
        joinDate: "05 Aug 2026",
        expiryDate: "05 Oct 2026",
        status: "Active",
        reservations: 9,
    },

    {
        id: "LIB2026003",
        name: "Priya Nair",
        email: "priya.nair@gmail.com",
        phone: "+91 99887 66554",
        plan: "Basic Reader",
        joinDate: "15 Jul 2026",
        expiryDate: "15 Sep 2026",
        status: "Expiring Soon",
        reservations: 7,
    },

    {
        id: "LIB2026004",
        name: "Arjun Menon",
        email: "arjun.menon@gmail.com",
        phone: "+91 91234 56789",
        plan: "Premium Reader",
        joinDate: "20 Jun 2026",
        expiryDate: "20 Sep 2026",
        status: "Active",
        reservations: 15,
    },

    {
        id: "LIB2026005",
        name: "Sneha Reddy",
        email: "sneha.reddy@gmail.com",
        phone: "+91 90123 45678",
        plan: "Premium Reader",
        joinDate: "10 Mar 2026",
        expiryDate: "10 Sep 2026",
        status: "Expired",
        reservations: 18,
    },

    {
        id: "LIB2026006",
        name: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        phone: "+91 93456 78901",
        plan: "Basic Reader",
        joinDate: "18 Aug 2026",
        expiryDate: "18 Sep 2026",
        status: "Expiring Soon",
        reservations: 6,
    },

    {
        id: "LIB2026007",
        name: "Meera Iyer",
        email: "meera.iyer@gmail.com",
        phone: "+91 94567 89012",
        plan: "Premium Reader",
        joinDate: "12 May 2026",
        expiryDate: "12 Oct 2026",
        status: "Active",
        reservations: 21,
    },

    {
        id: "LIB2026008",
        name: "Karan Patel",
        email: "karan.patel@gmail.com",
        phone: "+91 95678 90123",
        plan: "Basic Reader",
        joinDate: "03 Jan 2026",
        expiryDate: "03 Jul 2026",
        status: "Expired",
        reservations: 11,
    },

    {
        id: "LIB2026009",
        name: "Divya Krishnan",
        email: "divya.krishnan@gmail.com",
        phone: "+91 96789 01234",
        plan: "Premium Reader",
        joinDate: "01 Sep 2026",
        expiryDate: "01 Oct 2026",
        status: "Active",
        reservations: 5,
    },

    {
        id: "LIB2026010",
        name: "Aditya Rao",
        email: "aditya.rao@gmail.com",
        phone: "+91 97890 12345",
        plan: "Premium Reader",
        joinDate: "25 Aug 2026",
        expiryDate: "25 Sep 2026",
        status: "Expiring Soon",
        reservations: 8,
    },

    {
        id: "LIB2026011",
        name: "Nisha Kapoor",
        email: "nisha.kapoor@gmail.com",
        phone: "+91 98901 23456",
        plan: "Basic Reader",
        joinDate: "08 Aug 2026",
        expiryDate: "08 Sep 2026",
        status: "Expired",
        reservations: 4,
    },

    {
        id: "LIB2026012",
        name: "Rohan Das",
        email: "rohan.das@gmail.com",
        phone: "+91 99012 34567",
        plan: "Premium Reader",
        joinDate: "02 Sep 2026",
        expiryDate: "02 Oct 2026",
        status: "Active",
        reservations: 10,
    },
];


/* =========================================================
   ADMIN MEMBERS
========================================================= */

function AdminMembers() {

    const location = useLocation();
    const navigate = useNavigate();


    /* =====================================================
       ACTIVE SIDEBAR
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

    const [members, setMembers] = useState(initialMembers);

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedMember, setSelectedMember] = useState(null);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const stats = useMemo(() => {

        return {

            total: members.length,

            active: members.filter(
                (member) =>
                    member.status === "Active"
            ).length,

            newMembers: members.filter(
                (member) =>
                    member.joinDate.includes("Sep 2026")
            ).length,

            expiring: members.filter(
                (member) =>
                    member.status === "Expiring Soon"
            ).length,

        };

    }, [members]);


    /* =====================================================
       SEARCH + FILTER
    ===================================================== */

    const filteredMembers = useMemo(() => {

        return members.filter((member) => {

            const search =
                searchTerm
                    .toLowerCase()
                    .trim();


            const matchesSearch =

                member.name
                    .toLowerCase()
                    .includes(search)

                ||

                member.email
                    .toLowerCase()
                    .includes(search)

                ||

                member.id
                    .toLowerCase()
                    .includes(search)

                ||

                member.plan
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =

                statusFilter === "All"

                ||

                member.status === statusFilter;


            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        members,
        searchTerm,
        statusFilter
    ]);


    /* =====================================================
       TOGGLE MEMBER STATUS
    ===================================================== */

    const toggleMemberStatus = (id) => {

        setMembers((currentMembers) =>

            currentMembers.map((member) => {

                if (member.id !== id) {

                    return member;

                }


                return {

                    ...member,

                    status:
                        member.status === "Active"
                            ? "Inactive"
                            : "Active",

                };

            })

        );


        setSelectedMember(null);


        alert(
            "Member status updated successfully."
        );

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


    return (

        <div className="admin-members-page">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">


                {/* =================================================
                    LOGO
                ================================================= */}

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


                    {/* BOOKS */}

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


                    {/* SEATS */}

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


                    {/* =================================================
                        MANAGEMENT
                    ================================================= */}

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


                    {/* =================================================
                        SYSTEM
                    ================================================= */}

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


                {/* =================================================
                    SIDEBAR BOTTOM
                ================================================= */}

                <div className="admin-sidebar-bottom">


                    {/* STUDENT PORTAL */}

                   


                    {/* LOGOUT */}

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


                {/* =================================================
                    TOPBAR
                ================================================= */}

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

                <div className="members-content">


                    {/* =================================================
                        BREADCRUMB
                    ================================================= */}

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


                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

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


                    {/* =================================================
                        OVERVIEW BANNER
                    ================================================= */}

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


                    {/* =================================================
                        MEMBER DIRECTORY
                    ================================================= */}

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


                            {/* FILTER */}

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


                        {/* =================================================
                            TABLE
                        ================================================= */}

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


                                    {filteredMembers.length > 0 ? (

                                        filteredMembers.map(
                                            (member) => (

                                                <tr
                                                    key={member.id}
                                                >


                                                    {/* MEMBER */}

                                                    <td>

                                                        <div className="member-info">


                                                            <div className="member-avatar">

                                                                {member.name
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

                                                            {member.plan}

                                                        </span>

                                                    </td>


                                                    {/* JOIN DATE */}

                                                    <td>

                                                        <span className="date-text">
                                                            {member.joinDate}
                                                        </span>

                                                    </td>


                                                    {/* EXPIRY DATE */}

                                                    <td>

                                                        <span className="date-text">
                                                            {member.expiryDate}
                                                        </span>

                                                    </td>


                                                    {/* RESERVATIONS */}

                                                    <td>

                                                        <div className="reservation-count">

                                                            <span>
                                                                📅
                                                            </span>

                                                            <strong>
                                                                {member.reservations}
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

                                                            {member.status}

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
                                                                    member.status ===
                                                                    "Active"
                                                                        ? "Deactivate Member"
                                                                        : "Activate Member"
                                                                }
                                                                onClick={() =>
                                                                    toggleMemberStatus(
                                                                        member.id
                                                                    )
                                                                }
                                                            >

                                                                {member.status ===
                                                                "Active"
                                                                    ? "🚫"
                                                                    : "✓"}

                                                            </button>


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


                    {/* =================================================
                        MANAGEMENT TIP
                    ================================================= */}

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


                    {/* =================================================
                        FOOTER
                    ================================================= */}

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


                            {/* MEMBER PROFILE */}

                            <div className="modal-member">


                                <div className="modal-avatar">

                                    {selectedMember.name
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


                            {/* MEMBER DETAILS */}

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
                                        {selectedMember.phone}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Membership Plan
                                    </span>

                                    <strong>
                                        {selectedMember.plan}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Total Reservations
                                    </span>

                                    <strong>
                                        {selectedMember.reservations}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Join Date
                                    </span>

                                    <strong>
                                        {selectedMember.joinDate}
                                    </strong>

                                </div>


                                <div className="detail-item">

                                    <span>
                                        Membership Expiry
                                    </span>

                                    <strong>
                                        {selectedMember.expiryDate}
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

                                            {selectedMember.status}

                                        </span>

                                    </strong>

                                </div>


                            </div>


                            {/* MODAL ACTIONS */}

                            <div className="modal-actions">


                                <button
                                    type="button"
                                    className={
                                        selectedMember.status ===
                                        "Active"
                                            ? "deactivate-btn"
                                            : "activate-btn"
                                    }
                                    onClick={() =>
                                        toggleMemberStatus(
                                            selectedMember.id
                                        )
                                    }
                                >

                                    {selectedMember.status ===
                                    "Active"
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