import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Membership.css";

const API_BASE_URL = "http://localhost:5000";

function Membership() {

    const [membership, setMembership] = useState(null);
    const [daysRemaining, setDaysRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getToken = () => {
        return localStorage.getItem("token");
    };

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "—";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const calculateProgress = () => {
        if (!membership) {
            return 0;
        }

        const start = new Date(membership.startDate);
        const expiry = new Date(membership.expiryDate);
        const today = new Date();

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(expiry.getTime()) ||
            expiry <= start
        ) {
            return 0;
        }

        const totalDuration = expiry.getTime() - start.getTime();
        const elapsedDuration = today.getTime() - start.getTime();

        const progress =
            ((elapsedDuration / totalDuration) * 100);

        return Math.min(
            100,
            Math.max(0, progress)
        );
    };

    const loadMembership = async () => {
        try {
            setLoading(true);
            setError("");

            const token = getToken();

            if (!token) {
                setError("Please login to view your membership.");
                setLoading(false);
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-cache"
            };

            const membershipResponse = await fetch(
                `${API_BASE_URL}/api/memberships/my`,
                {
                    method: "GET",
                    headers
                }
            );

            const membershipData =
                await membershipResponse.json();

            if (!membershipResponse.ok) {
                throw new Error(
                    membershipData.message ||
                    "Unable to fetch membership details"
                );
            }

            setMembership(
                membershipData.membership || null
            );

            const daysResponse = await fetch(
                `${API_BASE_URL}/api/memberships/days-remaining`,
                {
                    method: "GET",
                    headers
                }
            );

            const daysData = await daysResponse.json();

            if (daysResponse.ok) {
                setDaysRemaining(
                    Number(daysData.daysRemaining) || 0
                );
            } else {
                setDaysRemaining(0);
            }

        } catch (err) {
            console.error(
                "Membership loading error:",
                err
            );

            setError(
                err.message ||
                "Unable to load membership details."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMembership();
    }, []);

    const progress = calculateProgress();

    const membershipStatus =
        membership?.status || "inactive";

    const statusLabel =
        membershipStatus === "active"
            ? "Active"
            : membershipStatus === "expired"
                ? "Expired"
                : membershipStatus === "cancelled"
                    ? "Cancelled"
                    : "Inactive";

    const planName =
        membership?.planName || "No Membership";

    const planType =
        membership?.planType || "—";

    const monthlyFee =
        membership?.monthlyFee ?? 0;

    return (
        <div className="membership-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="membership-sidebar">

                <div className="membership-sidebar-logo">

                    <div className="membership-logo-icon">
                        📚
                    </div>

                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>

                </div>

                <div className="membership-menu-title">
                    MAIN MENU
                </div>

                <nav className="membership-sidebar-nav">

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

                    <Link
                        to="/membership"
                        className="active"
                    >
                        <span>♛</span>
                        Membership
                    </Link>

                </nav>

                <div className="membership-menu-title">
                    ACCOUNT
                </div>

                <nav className="membership-sidebar-nav">

                    <Link to="/profile">
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link to="/payment-history">
                        <span>▤</span>
                        Payment History
                    </Link>

                </nav>

                <div className="membership-sidebar-bottom">

                    <div className="membership-library-status">

                        <span className="membership-status-dot"></span>

                        <div>
                            <strong>Library Open</strong>
                            <small>8:00 AM - 10:00 PM</small>
                        </div>

                    </div>

                    <Link
                        to="/"
                        className="membership-logout"
                    >
                        ↪ Logout
                    </Link>

                </div>

            </aside>


            {/* ================= MAIN CONTENT ================= */}

            <div className="membership-content">

                {/* ================= TOPBAR ================= */}

                <header className="membership-topbar">

                    <div>

                        <span className="membership-top-label">
                            STUDENT PORTAL
                        </span>

                        <h1>
                            Membership
                        </h1>

                    </div>

                    <Link
                        to="/profile"
                        className="membership-user"
                    >

                        <div className="membership-user-avatar">
                            A
                        </div>

                        <div className="membership-user-info">

                            <strong>
                                Student
                            </strong>

                            <span>
                                Library Member
                            </span>

                        </div>

                    </Link>

                </header>


                {/* ================= PAGE ================= */}

                <main className="membership-main">

                    {/* BREADCRUMB */}

                    <div className="membership-breadcrumb">

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span>/</span>

                        <strong>
                            Membership
                        </strong>

                    </div>


                    {/* HEADER */}

                    <section className="membership-page-header">

                        <div>

                            <span className="membership-eyebrow">
                                MEMBERSHIP PLAN
                            </span>

                            <h2>
                                Manage Your Membership
                            </h2>

                            <p>
                                View your current membership plan,
                                benefits and renewal information.
                            </p>

                        </div>

                        <span className="membership-active-badge">
                            {loading
                                ? "Loading..."
                                : membership
                                    ? `✓ ${statusLabel} Membership`
                                    : "No Active Membership"}
                        </span>

                    </section>


                    {/* ================= CURRENT PLAN ================= */}

                    <section className="membership-overview">

                        <div className="membership-plan-card">

                            <div className="membership-plan-top">

                                <div className="membership-crown">
                                    ♛
                                </div>

                                <div>

                                    <span>
                                        CURRENT PLAN
                                    </span>

                                    <h3>
                                        {loading
                                            ? "Loading..."
                                            : planName}
                                    </h3>

                                </div>

                                <div className="membership-plan-status">
                                    {loading
                                        ? "Loading"
                                        : statusLabel}
                                </div>

                            </div>


                            <div className="membership-price-row">

                                <div>

                                    <strong>
                                        ₹{monthlyFee}
                                    </strong>

                                    <span>
                                        / month
                                    </span>

                                </div>

                                <span className="membership-renew-label">
                                    {planType === "—"
                                        ? "Membership"
                                        : `${planType} Membership`}
                                </span>

                            </div>


                            <div className="membership-progress-area">

                                <div className="membership-progress-header">

                                    <span>
                                        Membership validity
                                    </span>

                                    <strong>
                                        {loading
                                            ? "Loading..."
                                            : membershipStatus === "active"
                                                ? `${daysRemaining} days remaining`
                                                : "0 days remaining"}
                                    </strong>

                                </div>

                                <div className="membership-progress-track">

                                    <div
                                        className="membership-progress-fill"
                                        style={{
                                            width: `${progress}%`
                                        }}
                                    ></div>

                                </div>

                            </div>


                            <div className="membership-dates">

                                <div>

                                    <span>
                                        START DATE
                                    </span>

                                    <strong>
                                        {loading
                                            ? "Loading..."
                                            : formatDate(
                                                membership?.startDate
                                            )}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        EXPIRY DATE
                                    </span>

                                    <strong>
                                        {loading
                                            ? "Loading..."
                                            : formatDate(
                                                membership?.expiryDate
                                            )}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* QUICK RENEW CARD */}

                        <div className="membership-renew-card">

                            <div className="renew-icon">
                                ↻
                            </div>

                            <span className="renew-eyebrow">
                                RENEWAL
                            </span>

                            <h3>
                                Keep your study routine going
                            </h3>

                            <p>
                                Renew your membership before it expires
                                to continue enjoying uninterrupted library
                                access.
                            </p>

                            <Link
                                to="/renew-membership"
                                className="renew-button"
                            >
                                Renew Membership
                                <span>→</span>
                            </Link>

                        </div>

                    </section>


                    {/* ================= BENEFITS ================= */}

                    <section className="membership-benefits-section">

                        <div className="membership-section-heading">

                            <div>

                                <span>
                                    PLAN BENEFITS
                                </span>

                                <h3>
                                    What you get with Premium Reader
                                </h3>

                            </div>

                        </div>


                        <div className="membership-benefits-grid">

                            <div className="membership-benefit-card">

                                <div className="benefit-icon">
                                    💺
                                </div>

                                <div>

                                    <h4>
                                        Seat Reservation
                                    </h4>

                                    <p>
                                        Reserve your preferred library
                                        seat in advance.
                                    </p>

                                </div>

                            </div>


                            <div className="membership-benefit-card">

                                <div className="benefit-icon">
                                    📚
                                </div>

                                <div>

                                    <h4>
                                        Extended Library Access
                                    </h4>

                                    <p>
                                        Enjoy access to library facilities
                                        throughout operating hours.
                                    </p>

                                </div>

                            </div>


                            <div className="membership-benefit-card">

                                <div className="benefit-icon">
                                    ⚡
                                </div>

                                <div>

                                    <h4>
                                        Priority Booking
                                    </h4>

                                    <p>
                                        Get convenient access to available
                                        study seats.
                                    </p>

                                </div>

                            </div>


                            <div className="membership-benefit-card">

                                <div className="benefit-icon">
                                    🔔
                                </div>

                                <div>

                                    <h4>
                                        Reservation Alerts
                                    </h4>

                                    <p>
                                        Receive reminders about your
                                        upcoming reservations.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* ================= MEMBERSHIP INFO ================= */}

                    <section className="membership-info-card">

                        <div className="membership-info-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                Membership Information
                            </strong>

                            <p>
                                {membership
                                    ? `Your ${planName} membership is currently ${statusLabel.toLowerCase()}. You can renew your plan before the expiry date to maintain uninterrupted access to LibraSpace services.`
                                    : "You currently do not have a membership. Please choose a membership plan to access LibraSpace services."}
                            </p>

                        </div>

                    </section>

                    {/* ================= ERROR ================= */}

                    {error && (

                        <section
                            className="membership-info-card"
                            style={{ marginTop: "20px" }}
                        >

                            <div className="membership-info-icon">
                                ⚠️
                            </div>

                            <div>

                                <strong>
                                    Unable to load membership
                                </strong>

                                <p>
                                    {error}
                                </p>

                            </div>

                        </section>

                    )}

                </main>


                {/* ================= FOOTER ================= */}

                <footer className="membership-footer">

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

export default Membership;
