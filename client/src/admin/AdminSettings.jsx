import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminSettings.css";

const defaultSettings = {
    libraryName: "LibraSpace Library",
    libraryEmail: "support@libraspace.com",
    libraryPhone: "+91 98765 43210",
    address: "SRM University Campus, Tamil Nadu",

    openingTime: "08:00",
    closingTime: "20:00",

    maxReservationHours: "4",
    advanceBookingDays: "7",
    cancellationHours: "2",

    maintenanceMode: false,

    emailNotifications: true,
    reservationAlerts: true,
    membershipAlerts: true,
    paymentAlerts: true,

    adminName: "Administrator",
    adminEmail: "admin@libraspace.com",

    razorpayMode: "Test Mode",
    razorpayKey: "rzp_test_****************"
};

function AdminSettings() {

    const location = useLocation();
    const navigate = useNavigate();

    const [settings, setSettings] = useState(defaultSettings);
    const [activeSection, setActiveSection] = useState("general");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [savedMessage, setSavedMessage] = useState("");

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    const handleLogout = () => {
        navigate("/admin/login");
    };

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked
        } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox"
                ? checked
                : value
        }));

        setSavedMessage("");
    };

    const handleSave = (e) => {

        e.preventDefault();

        setSavedMessage(
            "Settings saved successfully."
        );

        setTimeout(() => {
            setSavedMessage("");
        }, 3000);
    };

    const handleReset = () => {

        setSettings(defaultSettings);

        setNewPassword("");
        setConfirmPassword("");

        setSavedMessage(
            "Settings have been reset."
        );

        setTimeout(() => {
            setSavedMessage("");
        }, 3000);
    };

    const handlePasswordChange = () => {

        if (!newPassword || !confirmPassword) {
            alert("Please enter both password fields.");
            return;
        }

        if (newPassword.length < 6) {
            alert(
                "Password must contain at least 6 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        alert("Password changed successfully.");

        setNewPassword("");
        setConfirmPassword("");
    };

    return (

        <div className="admin-settings-page">

            {/* =====================================================
                SIDEBAR
            ====================================================== */}

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
            ====================================================== */}

            <main className="admin-main">

                {/* =================================================
                    TOPBAR
                ================================================== */}

                <header className="admin-topbar">

                    <div className="admin-topbar-left">

                        <span className="admin-page-label">
                            ADMINISTRATOR
                        </span>

                        <h1>
                            Settings
                        </h1>

                    </div>


                    <div className="admin-topbar-right">

                        <button
                            className="admin-notification"
                            title="Notifications"
                            onClick={() =>
                                alert(
                                    "You have 3 notifications."
                                )
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


                {/* =================================================
                    CONTENT
                ================================================== */}

                <section className="settings-content">


                    {/* BREADCRUMB */}

                    <div className="settings-breadcrumb">

                        <Link to="/admin/dashboard">
                            Dashboard
                        </Link>

                        <span>
                            ›
                        </span>

                        <strong>
                            Settings
                        </strong>

                    </div>


                    {/* PAGE HEADER */}

                    <div className="settings-header">

                        <div>

                            <span className="page-label">
                                SYSTEM CONFIGURATION
                            </span>

                            <h1>
                                Settings
                            </h1>

                            <p>
                                Manage your library, reservations,
                                notifications and administrator settings.
                            </p>

                        </div>


                        <div className="header-actions">

                            <button
                                className="reset-btn"
                                onClick={handleReset}
                            >
                                <i className="fa-solid fa-rotate-left"></i>

                                Reset
                            </button>


                            <button
                                className="save-btn"
                                onClick={handleSave}
                            >
                                <i className="fa-solid fa-check"></i>

                                Save Changes
                            </button>

                        </div>

                    </div>


                    {/* SUCCESS MESSAGE */}

                    {savedMessage && (

                        <div className="settings-message">

                            <i className="fa-solid fa-circle-check"></i>

                            <span>
                                {savedMessage}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        SETTINGS LAYOUT
                    ================================================== */}

                    <div className="settings-layout">


                        {/* SETTINGS MENU */}

                        <aside className="settings-menu">


                            {/* GENERAL */}

                            <button
                                className={
                                    activeSection === "general"
                                        ? "settings-menu-item active"
                                        : "settings-menu-item"
                                }
                                onClick={() =>
                                    setActiveSection("general")
                                }
                            >

                                <span className="menu-icon">
                                    <i className="fa-solid fa-sliders"></i>
                                </span>

                                <span>
                                    <strong>
                                        General
                                    </strong>

                                    <small>
                                        Basic configuration
                                    </small>
                                </span>

                                <i className="fa-solid fa-chevron-right"></i>

                            </button>


                            {/* LIBRARY */}

                            <button
                                className={
                                    activeSection === "library"
                                        ? "settings-menu-item active"
                                        : "settings-menu-item"
                                }
                                onClick={() =>
                                    setActiveSection("library")
                                }
                            >

                                <span className="menu-icon">
                                    <i className="fa-solid fa-building"></i>
                                </span>

                                <span>
                                    <strong>
                                        Library
                                    </strong>

                                    <small>
                                        Library information
                                    </small>
                                </span>

                                <i className="fa-solid fa-chevron-right"></i>

                            </button>


                            {/* RESERVATIONS */}

                            <button
                                className={
                                    activeSection === "reservation"
                                        ? "settings-menu-item active"
                                        : "settings-menu-item"
                                }
                                onClick={() =>
                                    setActiveSection("reservation")
                                }
                            >

                                <span className="menu-icon">
                                    <i className="fa-solid fa-calendar-days"></i>
                                </span>

                                <span>
                                    <strong>
                                        Reservations
                                    </strong>

                                    <small>
                                        Booking preferences
                                    </small>
                                </span>

                                <i className="fa-solid fa-chevron-right"></i>

                            </button>


                            {/* NOTIFICATIONS */}

                            <button
                                className={
                                    activeSection === "notifications"
                                        ? "settings-menu-item active"
                                        : "settings-menu-item"
                                }
                                onClick={() =>
                                    setActiveSection("notifications")
                                }
                            >

                                <span className="menu-icon">
                                    <i className="fa-solid fa-bell"></i>
                                </span>

                                <span>
                                    <strong>
                                        Notifications
                                    </strong>

                                    <small>
                                        Alert preferences
                                    </small>
                                </span>

                                <i className="fa-solid fa-chevron-right"></i>

                            </button>


                            {/* SECURITY */}

                            <button
                                className={
                                    activeSection === "security"
                                        ? "settings-menu-item active"
                                        : "settings-menu-item"
                                }
                                onClick={() =>
                                    setActiveSection("security")
                                }
                            >

                                <span className="menu-icon">
                                    <i className="fa-solid fa-shield-halved"></i>
                                </span>

                                <span>
                                    <strong>
                                        Security
                                    </strong>

                                    <small>
                                        Admin account
                                    </small>
                                </span>

                                <i className="fa-solid fa-chevron-right"></i>

                            </button>

                        </aside>


                        {/* =================================================
                            SETTINGS PANELS
                        ================================================== */}

                        <div className="settings-panels">


                            {/* =================================================
                                GENERAL
                            ================================================== */}

                            {activeSection === "general" && (

                                <>

                                    {/* GENERAL SETTINGS */}

                                    <div className="settings-card">

                                        <div className="card-heading">

                                            <div className="heading-icon">
                                                <i className="fa-solid fa-sliders"></i>
                                            </div>

                                            <div>

                                                <h2>
                                                    General Settings
                                                </h2>

                                                <p>
                                                    Configure the basic
                                                    information of your
                                                    library system.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="form-grid">


                                            {/* LIBRARY NAME */}

                                            <div className="form-group">

                                                <label>
                                                    Library Name
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-solid fa-book-open"></i>

                                                    <input
                                                        type="text"
                                                        name="libraryName"
                                                        value={
                                                            settings.libraryName
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            {/* EMAIL */}

                                            <div className="form-group">

                                                <label>
                                                    Library Email
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-solid fa-envelope"></i>

                                                    <input
                                                        type="email"
                                                        name="libraryEmail"
                                                        value={
                                                            settings.libraryEmail
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            {/* PHONE */}

                                            <div className="form-group">

                                                <label>
                                                    Contact Number
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-solid fa-phone"></i>

                                                    <input
                                                        type="text"
                                                        name="libraryPhone"
                                                        value={
                                                            settings.libraryPhone
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            {/* ADDRESS */}

                                            <div className="form-group full-width">

                                                <label>
                                                    Library Address
                                                </label>

                                                <div className="input-wrapper textarea-wrapper">

                                                    <i className="fa-solid fa-location-dot"></i>

                                                    <textarea
                                                        name="address"
                                                        value={
                                                            settings.address
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                        rows="3"
                                                    ></textarea>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* OPERATING HOURS */}

                                    <div className="settings-card">

                                        <div className="card-heading">

                                            <div className="heading-icon blue">

                                                <i className="fa-solid fa-clock"></i>

                                            </div>

                                            <div>

                                                <h2>
                                                    Operating Hours
                                                </h2>

                                                <p>
                                                    Set the opening and
                                                    closing time of the
                                                    library.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="form-grid">


                                            <div className="form-group">

                                                <label>
                                                    Opening Time
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-regular fa-clock"></i>

                                                    <input
                                                        type="time"
                                                        name="openingTime"
                                                        value={
                                                            settings.openingTime
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            <div className="form-group">

                                                <label>
                                                    Closing Time
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-regular fa-clock"></i>

                                                    <input
                                                        type="time"
                                                        name="closingTime"
                                                        value={
                                                            settings.closingTime
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                </div>

                                            </div>

                                        </div>


                                        <div className="hours-note">

                                            <i className="fa-solid fa-circle-info"></i>

                                            <span>

                                                Current library hours:

                                                <strong>
                                                    {" "}
                                                    {settings.openingTime}
                                                    {" "}–{" "}
                                                    {settings.closingTime}
                                                </strong>

                                            </span>

                                        </div>

                                    </div>

                                </>

                            )}


                            {/* =================================================
                                LIBRARY
                            ================================================== */}

                            {activeSection === "library" && (

                                <div className="settings-card">

                                    <div className="card-heading">

                                        <div className="heading-icon purple">

                                            <i className="fa-solid fa-building"></i>

                                        </div>

                                        <div>

                                            <h2>
                                                Library Information
                                            </h2>

                                            <p>
                                                Manage the information
                                                displayed to library users.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="library-info-preview">

                                        <div className="library-preview-icon">

                                            <i className="fa-solid fa-book-open"></i>

                                        </div>


                                        <div>

                                            <h3>
                                                {settings.libraryName}
                                            </h3>

                                            <p>
                                                {settings.libraryEmail}
                                            </p>

                                            <p>
                                                {settings.libraryPhone}
                                            </p>

                                            <span>
                                                {settings.address}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="form-grid">


                                        <div className="form-group">

                                            <label>
                                                Library Name
                                            </label>

                                            <input
                                                type="text"
                                                className="normal-input"
                                                name="libraryName"
                                                value={
                                                    settings.libraryName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                        </div>


                                        <div className="form-group">

                                            <label>
                                                Library Email
                                            </label>

                                            <input
                                                type="email"
                                                className="normal-input"
                                                name="libraryEmail"
                                                value={
                                                    settings.libraryEmail
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                        </div>


                                        <div className="form-group">

                                            <label>
                                                Contact Number
                                            </label>

                                            <input
                                                type="text"
                                                className="normal-input"
                                                name="libraryPhone"
                                                value={
                                                    settings.libraryPhone
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                        </div>


                                        <div className="form-group full-width">

                                            <label>
                                                Address
                                            </label>

                                            <textarea
                                                className="normal-input"
                                                name="address"
                                                value={
                                                    settings.address
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                rows="4"
                                            ></textarea>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                RESERVATIONS
                            ================================================== */}

                            {activeSection === "reservation" && (

                                <div className="settings-card">

                                    <div className="card-heading">

                                        <div className="heading-icon orange">

                                            <i className="fa-solid fa-calendar-check"></i>

                                        </div>

                                        <div>

                                            <h2>
                                                Reservation Settings
                                            </h2>

                                            <p>
                                                Configure seat booking
                                                rules for students.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="form-grid">


                                        {/* MAX HOURS */}

                                        <div className="form-group">

                                            <label>
                                                Maximum Reservation Hours
                                            </label>

                                            <div className="input-wrapper">

                                                <i className="fa-solid fa-hourglass-half"></i>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="12"
                                                    name="maxReservationHours"
                                                    value={
                                                        settings.maxReservationHours
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </div>

                                            <small>
                                                Maximum hours a student can
                                                reserve a seat at one time.
                                            </small>

                                        </div>


                                        {/* ADVANCE DAYS */}

                                        <div className="form-group">

                                            <label>
                                                Advance Booking Days
                                            </label>

                                            <div className="input-wrapper">

                                                <i className="fa-solid fa-calendar-plus"></i>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="30"
                                                    name="advanceBookingDays"
                                                    value={
                                                        settings.advanceBookingDays
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </div>

                                            <small>
                                                How many days in advance
                                                students can book.
                                            </small>

                                        </div>


                                        {/* CANCELLATION */}

                                        <div className="form-group">

                                            <label>
                                                Cancellation Window
                                            </label>

                                            <div className="input-wrapper">

                                                <i className="fa-solid fa-ban"></i>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="24"
                                                    name="cancellationHours"
                                                    value={
                                                        settings.cancellationHours
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                            </div>

                                            <small>
                                                Minimum hours before booking
                                                time to cancel.
                                            </small>

                                        </div>

                                    </div>


                                    {/* MAINTENANCE */}

                                    <div className="setting-toggle-row">

                                        <div className="toggle-content">

                                            <div className="toggle-icon warning">

                                                <i className="fa-solid fa-triangle-exclamation"></i>

                                            </div>

                                            <div>

                                                <strong>
                                                    Maintenance Mode
                                                </strong>

                                                <p>
                                                    Temporarily prevent users
                                                    from making new bookings.
                                                </p>

                                            </div>

                                        </div>


                                        <label className="switch">

                                            <input
                                                type="checkbox"
                                                name="maintenanceMode"
                                                checked={
                                                    settings.maintenanceMode
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                            />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                NOTIFICATIONS
                            ================================================== */}

                            {activeSection === "notifications" && (

                                <div className="settings-card">

                                    <div className="card-heading">

                                        <div className="heading-icon green">

                                            <i className="fa-solid fa-bell"></i>

                                        </div>

                                        <div>

                                            <h2>
                                                Notification Settings
                                            </h2>

                                            <p>
                                                Choose which alerts the
                                                administration should receive.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="notification-settings">


                                        {/* EMAIL */}

                                        <div className="notification-row">

                                            <div className="notification-info">

                                                <div className="notification-icon">

                                                    <i className="fa-solid fa-envelope"></i>

                                                </div>

                                                <div>

                                                    <strong>
                                                        Email Notifications
                                                    </strong>

                                                    <p>
                                                        Receive important
                                                        system notifications
                                                        through email.
                                                    </p>

                                                </div>

                                            </div>


                                            <label className="switch">

                                                <input
                                                    type="checkbox"
                                                    name="emailNotifications"
                                                    checked={
                                                        settings.emailNotifications
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span className="slider"></span>

                                            </label>

                                        </div>


                                        {/* RESERVATIONS */}

                                        <div className="notification-row">

                                            <div className="notification-info">

                                                <div className="notification-icon blue-bg">

                                                    <i className="fa-solid fa-calendar-check"></i>

                                                </div>

                                                <div>

                                                    <strong>
                                                        Reservation Alerts
                                                    </strong>

                                                    <p>
                                                        Get notified when a
                                                        new seat reservation
                                                        is created.
                                                    </p>

                                                </div>

                                            </div>


                                            <label className="switch">

                                                <input
                                                    type="checkbox"
                                                    name="reservationAlerts"
                                                    checked={
                                                        settings.reservationAlerts
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span className="slider"></span>

                                            </label>

                                        </div>


                                        {/* MEMBERSHIP */}

                                        <div className="notification-row">

                                            <div className="notification-info">

                                                <div className="notification-icon purple-bg">

                                                    <i className="fa-solid fa-id-card"></i>

                                                </div>

                                                <div>

                                                    <strong>
                                                        Membership Alerts
                                                    </strong>

                                                    <p>
                                                        Receive alerts for
                                                        new and expiring
                                                        memberships.
                                                    </p>

                                                </div>

                                            </div>


                                            <label className="switch">

                                                <input
                                                    type="checkbox"
                                                    name="membershipAlerts"
                                                    checked={
                                                        settings.membershipAlerts
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span className="slider"></span>

                                            </label>

                                        </div>


                                        {/* PAYMENT */}

                                        <div className="notification-row">

                                            <div className="notification-info">

                                                <div className="notification-icon green-bg">

                                                    <i className="fa-solid fa-credit-card"></i>

                                                </div>

                                                <div>

                                                    <strong>
                                                        Payment Alerts
                                                    </strong>

                                                    <p>
                                                        Receive alerts for
                                                        successful and failed
                                                        payments.
                                                    </p>

                                                </div>

                                            </div>


                                            <label className="switch">

                                                <input
                                                    type="checkbox"
                                                    name="paymentAlerts"
                                                    checked={
                                                        settings.paymentAlerts
                                                    }
                                                    onChange={
                                                        handleChange
                                                    }
                                                />

                                                <span className="slider"></span>

                                            </label>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                SECURITY
                            ================================================== */}

                            {activeSection === "security" && (

                                <>

                                    {/* ADMIN PROFILE */}

                                    <div className="settings-card">

                                        <div className="card-heading">

                                            <div className="heading-icon red">

                                                <i className="fa-solid fa-user-shield"></i>

                                            </div>

                                            <div>

                                                <h2>
                                                    Administrator Profile
                                                </h2>

                                                <p>
                                                    Manage administrator
                                                    account information.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="admin-profile-box">

                                            <div className="large-avatar">
                                                A
                                            </div>

                                            <div>

                                                <h3>
                                                    {settings.adminName}
                                                </h3>

                                                <p>
                                                    {settings.adminEmail}
                                                </p>

                                                <span className="admin-role">
                                                    Super Administrator
                                                </span>

                                            </div>

                                        </div>


                                        <div className="form-grid">


                                            <div className="form-group">

                                                <label>
                                                    Administrator Name
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-solid fa-user"></i>

                                                    <input
                                                        type="text"
                                                        name="adminName"
                                                        value={
                                                            settings.adminName
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            <div className="form-group">

                                                <label>
                                                    Administrator Email
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-solid fa-envelope"></i>

                                                    <input
                                                        type="email"
                                                        name="adminEmail"
                                                        value={
                                                            settings.adminEmail
                                                        }
                                                        onChange={
                                                            handleChange
                                                        }
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* CHANGE PASSWORD */}

                                    <div className="settings-card">

                                        <div className="card-heading">

                                            <div className="heading-icon red">

                                                <i className="fa-solid fa-lock"></i>

                                            </div>

                                            <div>

                                                <h2>
                                                    Change Password
                                                </h2>

                                                <p>
                                                    Update your administrator
                                                    account password.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="form-grid">


                                            <div className="form-group">

                                                <label>
                                                    New Password
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-solid fa-key"></i>

                                                    <input
                                                        type="password"
                                                        value={
                                                            newPassword
                                                        }
                                                        onChange={(e) =>
                                                            setNewPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter new password"
                                                    />

                                                </div>

                                            </div>


                                            <div className="form-group">

                                                <label>
                                                    Confirm Password
                                                </label>

                                                <div className="input-wrapper">

                                                    <i className="fa-solid fa-lock"></i>

                                                    <input
                                                        type="password"
                                                        value={
                                                            confirmPassword
                                                        }
                                                        onChange={(e) =>
                                                            setConfirmPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Confirm new password"
                                                    />

                                                </div>

                                            </div>

                                        </div>


                                        <button
                                            className="password-btn"
                                            onClick={
                                                handlePasswordChange
                                            }
                                        >
                                            <i className="fa-solid fa-key"></i>

                                            Update Password
                                        </button>

                                    </div>


                                    {/* PAYMENT SETTINGS */}

                                    <div className="settings-card">

                                        <div className="card-heading">

                                            <div className="heading-icon payment-purple">

                                                <i className="fa-solid fa-credit-card"></i>

                                            </div>

                                            <div>

                                                <h2>
                                                    Payment Settings
                                                </h2>

                                                <p>
                                                    Configure the payment
                                                    gateway used by LibraSpace.
                                                </p>

                                            </div>

                                        </div>


                                        <div className="payment-status-box">

                                            <div className="payment-logo">

                                                <i className="fa-solid fa-bolt"></i>

                                            </div>

                                            <div>

                                                <strong>
                                                    Razorpay
                                                </strong>

                                                <span>
                                                    Payment Gateway
                                                </span>

                                            </div>

                                            <span className="test-badge">
                                                Test Mode
                                            </span>

                                        </div>


                                        <div className="payment-fields">


                                            <div className="payment-field">

                                                <label>
                                                    Gateway Status
                                                </label>

                                                <div className="gateway-status">

                                                    <span></span>

                                                    Connected for testing

                                                </div>

                                            </div>


                                            <div className="payment-field">

                                                <label>
                                                    Key ID
                                                </label>

                                                <input
                                                    type="text"
                                                    value={
                                                        settings.razorpayKey
                                                    }
                                                    readOnly
                                                />

                                            </div>

                                        </div>


                                        <div className="payment-note">

                                            <i className="fa-solid fa-shield-halved"></i>

                                            <div>

                                                <strong>
                                                    Secure Payment Configuration
                                                </strong>

                                                <p>
                                                    Razorpay is currently
                                                    configured for Test Mode.
                                                    Production credentials
                                                    should be connected through
                                                    the backend before going
                                                    live.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </>

                            )}

                        </div>

                    </div>


                    {/* =================================================
                        BOTTOM ACTIONS
                    ================================================== */}

                    <div className="settings-bottom-actions">

                        <div>

                            <i className="fa-solid fa-circle-info"></i>

                            <span>
                                Changes are currently stored in the
                                frontend demo only.
                            </span>

                        </div>


                        <div className="bottom-buttons">

                            <button
                                className="reset-btn"
                                onClick={handleReset}
                            >
                                Cancel
                            </button>


                            <button
                                className="save-btn"
                                onClick={handleSave}
                            >
                                <i className="fa-solid fa-floppy-disk"></i>

                                Save Settings
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer className="admin-settings-footer">

                        <span>
                            © 2026 LibraSpace Library Management System
                        </span>

                        <span>
                            Admin Panel • v1.0
                        </span>

                    </footer>

                </section>

            </main>

        </div>
    );
}

export default AdminSettings;