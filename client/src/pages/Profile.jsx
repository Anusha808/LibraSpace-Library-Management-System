import { Link } from "react-router-dom";
import { useState } from "react";
import "./Profile.css";

function Profile() {

    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        fullName: "Student",
        email: "student@example.com",
        phone: "+91 98765 43210",
        studentId: "LIB2026001",
        joinedDate: "12 Sep 2026"
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setProfile({
            ...profile,
            [name]: value
        });
    };

    const handleSave = () => {

        setIsEditing(false);

        alert("Profile updated successfully!");
    };

    return (

        <div className="profile-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="profile-sidebar">

                <div className="profile-sidebar-logo">

                    <div className="profile-logo-icon">
                        📚
                    </div>

                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>

                </div>


                <div className="profile-menu-title">
                    MAIN MENU
                </div>


                <nav className="profile-sidebar-nav">

                    <Link to="/dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link to="/seats">
                        <span>💺</span>
                        Reserve Seat
                    </Link>

                    <Link to="/reservations">
                        <span>▣</span>
                        My Reservations
                    </Link>

                    <Link to="/membership">
                        <span>♛</span>
                        Membership
                    </Link>

                </nav>


                <div className="profile-menu-title">
                    ACCOUNT
                </div>


                <nav className="profile-sidebar-nav">

                    <Link
                        to="/profile"
                        className="active"
                    >
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link to="/payment-history">
                        <span>▤</span>
                        Payment History
                    </Link>

                </nav>


                <div className="profile-sidebar-bottom">

                    <div className="profile-library-status">

                        <span className="profile-status-dot"></span>

                        <div>
                            <strong>Library Open</strong>
                            <small>8:00 AM - 10:00 PM</small>
                        </div>

                    </div>


                    <Link
                        to="/"
                        className="profile-logout"
                    >
                        ↪ Logout
                    </Link>

                </div>

            </aside>


            {/* ================= MAIN CONTENT ================= */}

            <div className="profile-content">

                {/* TOPBAR */}

                <header className="profile-topbar">

                    <div>

                        <span className="profile-top-label">
                            STUDENT PORTAL
                        </span>

                        <h1>
                            My Profile
                        </h1>

                    </div>


                    <div className="profile-top-user">

                        <div className="profile-top-avatar">
                            A
                        </div>

                        <div className="profile-top-user-info">

                            <strong>
                                {profile.fullName}
                            </strong>

                            <span>
                                Library Member
                            </span>

                        </div>

                    </div>

                </header>


                {/* ================= MAIN ================= */}

                <main className="profile-main">

                    {/* BREADCRUMB */}

                    <div className="profile-breadcrumb">

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span>/</span>

                        <strong>
                            My Profile
                        </strong>

                    </div>


                    {/* PAGE HEADER */}

                    <section className="profile-page-header">

                        <div>

                            <span>
                                ACCOUNT SETTINGS
                            </span>

                            <h2>
                                My Profile
                            </h2>

                            <p>
                                Manage your personal information and
                                library account details.
                            </p>

                        </div>


                        {!isEditing && (

                            <button
                                type="button"
                                className="profile-edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                ✎ Edit Profile
                            </button>

                        )}

                    </section>


                    {/* ================= PROFILE OVERVIEW ================= */}

                    <section className="profile-overview">

                        <div className="profile-card profile-main-card">

                            <div className="profile-card-header">

                                <div>

                                    <span>
                                        PERSONAL INFORMATION
                                    </span>

                                    <h3>
                                        Profile Details
                                    </h3>

                                </div>

                                <div className="profile-large-avatar">
                                    A
                                </div>

                            </div>


                            <div className="profile-form-grid">

                                <div className="profile-form-group">

                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={profile.fullName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label>
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label>
                                        Phone Number
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />

                                </div>


                                <div className="profile-form-group">

                                    <label>
                                        Student ID
                                    </label>

                                    <input
                                        type="text"
                                        name="studentId"
                                        value={profile.studentId}
                                        disabled
                                    />

                                </div>

                            </div>


                            {isEditing && (

                                <div className="profile-form-actions">

                                    <button
                                        type="button"
                                        className="profile-cancel-button"
                                        onClick={() =>
                                            setIsEditing(false)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="button"
                                        className="profile-save-button"
                                        onClick={handleSave}
                                    >
                                        ✓ Save Changes
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* MEMBERSHIP CARD */}

                        <div className="profile-card profile-membership-card">

                            <div className="profile-membership-icon">
                                ♛
                            </div>

                            <span className="profile-membership-label">
                                MEMBERSHIP
                            </span>

                            <h3>
                                Premium Reader
                            </h3>

                            <span className="profile-membership-status">
                                ✓ Active
                            </span>


                            <div className="profile-membership-details">

                                <div>

                                    <span>
                                        Monthly Fee
                                    </span>

                                    <strong>
                                        ₹499
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Valid Until
                                    </span>

                                    <strong>
                                        10 Oct 2026
                                    </strong>

                                </div>

                            </div>


                            <Link
                                to="/membership"
                                className="profile-membership-button"
                            >
                                Manage Membership →
                            </Link>

                        </div>

                    </section>


                    {/* ================= ACCOUNT INFORMATION ================= */}

                    <section className="profile-account-section">

                        <div className="profile-section-heading">

                            <span>
                                ACCOUNT INFORMATION
                            </span>

                            <h3>
                                Account Details
                            </h3>

                        </div>


                        <div className="profile-account-grid">

                            <div className="profile-info-card">

                                <div className="profile-info-icon">
                                    🆔
                                </div>

                                <div>

                                    <span>
                                        Student ID
                                    </span>

                                    <strong>
                                        {profile.studentId}
                                    </strong>

                                </div>

                            </div>


                            <div className="profile-info-card">

                                <div className="profile-info-icon">
                                    📅
                                </div>

                                <div>

                                    <span>
                                        Member Since
                                    </span>

                                    <strong>
                                        {profile.joinedDate}
                                    </strong>

                                </div>

                            </div>


                            <div className="profile-info-card">

                                <div className="profile-info-icon">
                                    ✓
                                </div>

                                <div>

                                    <span>
                                        Account Status
                                    </span>

                                    <strong className="profile-active-text">
                                        Active
                                    </strong>

                                </div>

                            </div>


                            <div className="profile-info-card">

                                <div className="profile-info-icon">
                                    🔐
                                </div>

                                <div>

                                    <span>
                                        Account Security
                                    </span>

                                    <strong>
                                        Password Protected
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ================= SECURITY ================= */}

                    <section className="profile-security-card">

                        <div className="profile-security-icon">
                            🔒
                        </div>

                        <div className="profile-security-content">

                            <span>
                                ACCOUNT SECURITY
                            </span>

                            <h3>
                                Keep your account secure
                            </h3>

                            <p>
                                Change your password regularly to
                                keep your LibraSpace account protected.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="profile-password-button"
                            onClick={() =>
                                alert("Password change feature will be added later.")
                            }
                        >
                            Change Password
                        </button>

                    </section>


                    {/* INFORMATION */}

                    <section className="profile-info-notice">

                        <div className="profile-notice-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                Profile Information
                            </strong>

                            <p>
                                Your profile information is used to manage
                                seat reservations, membership services and
                                payment records within LibraSpace.
                            </p>

                        </div>

                    </section>

                </main>


                {/* FOOTER */}

                <footer className="profile-footer">

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

export default Profile;