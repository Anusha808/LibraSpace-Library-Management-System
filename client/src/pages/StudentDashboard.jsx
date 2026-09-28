import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./StudentDashboard.css";

function StudentDashboard() {

    const navigate = useNavigate();

    // =========================================
    // GET LOGGED-IN USER
    // =========================================

    const storedUser = localStorage.getItem("user");

    let user = null;

    try {
        user = storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
        console.error(
            "Unable to read user data:",
            error
        );
    }

    // =========================================
    // USER INFORMATION
    // =========================================

    const userName = user?.name || "Student";

    const avatarLetter = userName
        .charAt(0)
        .toUpperCase();

    // Use a stable primitive value for API/effect dependencies.
    const userId = user?.id || user?._id || null;

    const API_BASE_URL =
        "http://localhost:5000";


    // =========================================
    // RESERVATION STATE
    // =========================================

    const [reservations, setReservations] = useState([]);

    const [loadingReservations, setLoadingReservations] =
        useState(true);

    const [reservationError, setReservationError] =
        useState("");


    // =========================================
    // MEMBERSHIP STATE
    // =========================================

    const [membership, setMembership] =
        useState(null);

    const [membershipDays, setMembershipDays] =
        useState(0);

    const [loadingMembership, setLoadingMembership] =
        useState(true);

    const [membershipError, setMembershipError] =
        useState("");


    // =========================================
    // REDIRECT IF USER IS NOT LOGGED IN
    // =========================================

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!user || !token) {
            navigate("/login");
        }

    }, [navigate, userId]);


    // =========================================
    // FETCH USER RESERVATIONS
    // =========================================

    useEffect(() => {

        const fetchReservations = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {

                const response = await fetch(
                    `${API_BASE_URL}/api/reservations/my`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                `Bearer ${token}`,
                            "Cache-Control": "no-cache"
                        }
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    console.error(
                        "Reservation API error:",
                        response.status,
                        data
                    );

                    setReservationError(
                        data.message ||
                        "Unable to load reservations"
                    );

                    setLoadingReservations(false);

                    return;
                }

                setReservations(
                    data.reservations || []
                );

            } catch (error) {

                console.error(
                    "Reservation fetch error:",
                    error
                );

                setReservationError(
                    "Unable to connect to the server"
                );

            } finally {

                setLoadingReservations(false);

            }
        };

        if (userId) {
            fetchReservations();
        }

    }, [userId]);


    // =========================================
    // FETCH MEMBERSHIP
    // =========================================

    useEffect(() => {

        const fetchMembership = async () => {

            const token =
                localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {

                // Get membership
                const membershipResponse =
                    await fetch(
                        `${API_BASE_URL}/api/memberships/my`,
                        {
                            method: "GET",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`,
                                "Cache-Control": "no-cache"
                            }
                        }
                    );

                const membershipData =
                    await membershipResponse.json();

                if (!membershipResponse.ok) {

                    console.error(
                        "Membership API error:",
                        membershipResponse.status,
                        membershipData
                    );

                    setMembershipError(
                        membershipData.message ||
                        "Unable to load membership"
                    );

                    setLoadingMembership(false);

                    return;
                }

                setMembership(
                    membershipData.membership || null
                );


                // Get remaining days
                const daysResponse =
                    await fetch(
                        `${API_BASE_URL}/api/memberships/days-remaining`,
                        {
                            method: "GET",

                            headers: {
                                "Authorization":
                                    `Bearer ${token}`,
                                "Cache-Control": "no-cache"
                            }
                        }
                    );

                const daysData =
                    await daysResponse.json();

                if (daysResponse.ok) {

                    setMembershipDays(
                        Number(
                            daysData.daysRemaining
                        ) || 0
                    );

                } else {

                    console.error(
                        "Membership days API error:",
                        daysResponse.status,
                        daysData
                    );

                }

            } catch (error) {

                console.error(
                    "Membership fetch error:",
                    error
                );

                setMembershipError(
                    "Unable to connect to the server"
                );

            } finally {

                setLoadingMembership(false);

            }
        };

        if (userId) {
            fetchMembership();
        }

    }, [userId]);


    // =========================================
    // RESERVATION DATA
    // =========================================

    const confirmedReservations =
        reservations.filter(
            (reservation) =>
                reservation.status === "confirmed"
        );


    const totalReservations =
        reservations.length;


    // Convert a reservation's date + start time into one Date value.
    // This prevents a same-day reservation from being treated as past
    // simply because reservationDate is stored at midnight.
    const getReservationStartDate = (reservation) => {

        const date = new Date(
            reservation.reservationDate
        );

        const time = reservation.startTime || "";

        const timeMatch = time.match(
            /^(\\d{1,2}):(\\d{2})\\s*(AM|PM)$/i
        );

        if (timeMatch) {

            let hours =
                parseInt(timeMatch[1], 10);

            const minutes =
                parseInt(timeMatch[2], 10);

            const period =
                timeMatch[3].toUpperCase();

            if (period === "PM" && hours !== 12) {
                hours += 12;
            }

            if (period === "AM" && hours === 12) {
                hours = 0;
            }

            date.setHours(
                hours,
                minutes,
                0,
                0
            );
        }

        return date;
    };

    const nextReservation =
        confirmedReservations
            .filter(
                (reservation) =>
                    getReservationStartDate(
                        reservation
                    ) >= new Date()
            )
            .sort(
                (a, b) =>
                    getReservationStartDate(a) -
                    getReservationStartDate(b)
            )[0] || null;


    const currentSeat =
        nextReservation
            ? nextReservation.seatNumber
            : "—";


    const currentSeatTime =
        nextReservation
            ? nextReservation.startTime
            : "No active reservation";


    // =========================================
    // MEMBERSHIP DATA
    // =========================================

    const membershipPlan =
        membership?.planName || "No Membership";


    const membershipType =
        membership?.planType || "Not Available";


    const membershipFee =
        membership?.monthlyFee ?? 0;


    const membershipStatus =
        membership?.status || "inactive";


    const membershipStatusText =
        membershipStatus.charAt(0).toUpperCase() +
        membershipStatus.slice(1);


    const formattedExpiryDate =
        membership?.expiryDate
            ? new Date(
                membership.expiryDate
            ).toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            )
            : "Not available";


    // Calculate membership progress
    let membershipProgress = 0;

    if (
        membership?.startDate &&
        membership?.expiryDate
    ) {

        const startDate =
            new Date(
                membership.startDate
            ).getTime();

        const expiryDate =
            new Date(
                membership.expiryDate
            ).getTime();

        const today =
            new Date().getTime();

        const totalDuration =
            expiryDate - startDate;

        const elapsedDuration =
            today - startDate;

        if (
            Number.isFinite(startDate) &&
            Number.isFinite(expiryDate) &&
            totalDuration > 0
        ) {

            membershipProgress =
                Math.min(
                    100,
                    Math.max(
                        0,
                        (elapsedDuration /
                            totalDuration) *
                        100
                    )
                );
        }
    }


    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        localStorage.removeItem("libraryUser");

        navigate("/login");
    };


    // =========================================
    // IF USER IS NOT AVAILABLE
    // =========================================

    if (!user) {
        return null;
    }


    // =========================================
    // PAGE
    // =========================================

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
                        <strong>
                            LibraSpace
                        </strong>

                        <span>
                            Smart Library
                        </span>
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
                        <span className="sidebar-icon">
                            ⌂
                        </span>

                        <span>
                            Dashboard
                        </span>
                    </Link>


                    <Link
                        to="/seats"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            💺
                        </span>

                        <span>
                            Reserve Seat
                        </span>
                    </Link>


                    <Link
                        to="/reservations"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ▣
                        </span>

                        <span>
                            My Reservations
                        </span>
                    </Link>


                    <Link
                        to="/membership"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ♛
                        </span>

                        <span>
                            Membership
                        </span>
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
                        <span className="sidebar-icon">
                            ◯
                        </span>

                        <span>
                            My Profile
                        </span>
                    </Link>


                    <Link
                        to="/payment-history"
                        className="sidebar-link"
                    >
                        <span className="sidebar-icon">
                            ▤
                        </span>

                        <span>
                            Payment History
                        </span>
                    </Link>

                </nav>


                <div className="sidebar-bottom">

                    <div className="library-status">

                        <div className="status-dot"></div>

                        <div>

                            <strong>
                                Library Open
                            </strong>

                            <span>
                                Today · 8:00 AM - 10:00 PM
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="logout-link"
                        onClick={handleLogout}
                    >
                        <span>
                            ↪
                        </span>

                        Logout
                    </button>

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
                        📚
                        <strong>
                            LibraSpace
                        </strong>
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
                                {avatarLetter}
                            </div>


                            <div className="top-profile-info">

                                <strong>
                                    {userName}
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
                                Welcome back, {userName}! 👋
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

                                <span>
                                    →
                                </span>

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


                        {/* CURRENT SEAT */}

                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon seat-icon">
                                    💺
                                </div>

                                <span
                                    className={
                                        nextReservation
                                            ? "stat-trend positive"
                                            : "stat-trend warning"
                                    }
                                >
                                    {nextReservation
                                        ? "● Active"
                                        : "No booking"}
                                </span>

                            </div>


                            <div className="professional-stat-value">

                                {loadingReservations
                                    ? "..."
                                    : currentSeat}

                            </div>


                            <div className="professional-stat-label">
                                Current Seat
                            </div>


                            <div className="stat-description">

                                {loadingReservations
                                    ? "Loading..."
                                    : currentSeatTime}

                            </div>

                        </div>


                        {/* TOTAL RESERVATIONS */}

                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon reservation-icon">
                                    📅
                                </div>


                                <span className="stat-trend">

                                    {totalReservations === 1
                                        ? "1 booking"
                                        : `${totalReservations} bookings`}

                                </span>

                            </div>


                            <div className="professional-stat-value">

                                {loadingReservations
                                    ? "..."
                                    : totalReservations}

                            </div>


                            <div className="professional-stat-label">
                                Total Reservations
                            </div>


                            <div className="stat-description">
                                Successful bookings
                            </div>

                        </div>


                        {/* MEMBERSHIP PLAN */}

                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon membership-icon">
                                    ♛
                                </div>


                                <span
                                    className={
                                        membershipStatus === "active"
                                            ? "stat-trend positive"
                                            : "stat-trend warning"
                                    }
                                >
                                    {loadingMembership
                                        ? "..."
                                        : `● ${membershipStatusText}`}
                                </span>

                            </div>


                            <div className="professional-stat-value">

                                {loadingMembership
                                    ? "..."
                                    : membershipPlan}

                            </div>


                            <div className="professional-stat-label">
                                Membership Plan
                            </div>


                            <div className="stat-description">

                                {loadingMembership
                                    ? "Loading..."
                                    : membershipType}

                            </div>

                        </div>


                        {/* MEMBERSHIP REMAINING */}

                        <div className="professional-stat-card">

                            <div className="stat-card-top">

                                <div className="professional-stat-icon expiry-icon">
                                    ⏳
                                </div>


                                <span
                                    className={
                                        membershipDays > 7
                                            ? "stat-trend positive"
                                            : "stat-trend warning"
                                    }
                                >
                                    {loadingMembership
                                        ? "..."
                                        : membershipDays > 7
                                            ? "● Active"
                                            : "Renew soon"}
                                </span>

                            </div>


                            <div className="professional-stat-value">

                                {loadingMembership
                                    ? "..."
                                    : `${membershipDays} Days`}

                            </div>


                            <div className="professional-stat-label">
                                Membership Remaining
                            </div>


                            <div className="stat-description">

                                {loadingMembership
                                    ? "Loading..."
                                    : `Expires ${formattedExpiryDate}`}

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


                                {/* CALENDAR */}

                                <div className="reservation-calendar">

                                    {loadingReservations ? (

                                        <>
                                            <span>
                                                ---
                                            </span>

                                            <strong>
                                                --
                                            </strong>

                                            <small>
                                                ----
                                            </small>
                                        </>

                                    ) : nextReservation ? (

                                        <>
                                            <span>

                                                {new Date(
                                                    nextReservation.reservationDate
                                                )
                                                    .toLocaleString(
                                                        "en-US",
                                                        {
                                                            month: "short"
                                                        }
                                                    )
                                                    .toUpperCase()}

                                            </span>


                                            <strong>

                                                {new Date(
                                                    nextReservation.reservationDate
                                                ).getDate()}

                                            </strong>


                                            <small>

                                                {new Date(
                                                    nextReservation.reservationDate
                                                ).getFullYear()}

                                            </small>

                                        </>

                                    ) : (

                                        <>
                                            <span>
                                                ---
                                            </span>

                                            <strong>
                                                --
                                            </strong>

                                            <small>
                                                ----
                                            </small>
                                        </>

                                    )}

                                </div>


                                {/* RESERVATION DETAILS */}

                                <div className="reservation-main">

                                    <h4>

                                        {loadingReservations
                                            ? "Loading reservation..."
                                            : nextReservation
                                                ? nextReservation.purpose
                                                : "No upcoming reservation"}

                                    </h4>


                                    {nextReservation && (

                                        <div className="reservation-meta">

                                            <span>
                                                💺 Seat{" "}
                                                {nextReservation.seatNumber}
                                            </span>


                                            <span>
                                                🕐{" "}
                                                {nextReservation.startTime}
                                                {" - "}
                                                {nextReservation.endTime}
                                            </span>

                                        </div>

                                    )}


                                    {nextReservation && (

                                        <span className="confirmed-status">

                                            ✓{" "}
                                            {nextReservation.status}

                                        </span>

                                    )}

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
                                        {loadingMembership
                                            ? "Loading..."
                                            : membershipPlan}
                                    </h3>

                                </div>


                                <span className="membership-active">

                                    {loadingMembership
                                        ? "..."
                                        : membershipStatusText}

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

                                        {loadingMembership
                                            ? "Loading..."
                                            : membershipPlan}

                                    </strong>

                                </div>

                            </div>


                            <div className="membership-details">

                                <div>

                                    <span>
                                        Monthly Fee
                                    </span>


                                    <strong>

                                        {loadingMembership
                                            ? "..."
                                            : `₹${membershipFee}`}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Valid Until
                                    </span>


                                    <strong>

                                        {loadingMembership
                                            ? "..."
                                            : formattedExpiryDate}

                                    </strong>

                                </div>

                            </div>


                            <div className="membership-progress">

                                <div className="progress-header">

                                    <span>
                                        Membership period
                                    </span>


                                    <strong>

                                        {loadingMembership
                                            ? "..."
                                            : `${membershipDays} days left`}

                                    </strong>

                                </div>


                                <div className="progress-track">

                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${membershipProgress}%`
                                        }}
                                    ></div>

                                </div>

                            </div>


                            <Link
                                to="/membership"
                                className="membership-manage-button"
                            >
                                Manage Membership →
                            </Link>

                            {membershipError && (

                                <div
                                    style={{
                                        marginTop: "10px",
                                        fontSize: "12px",
                                        color: "#dc2626"
                                    }}
                                >
                                    {membershipError}
                                </div>

                            )}

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


                            {/* RESERVE */}

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


                            {/* RESERVATIONS */}

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


                            {/* MEMBERSHIP */}

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


                            {/* PROFILE */}

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

                                {reservations.length} recent{" "}

                                {reservations.length === 1
                                    ? "activity"
                                    : "activities"}

                            </span>

                        </div>


                        <div className="professional-activity-list">


                            {/* ERROR */}

                            {reservationError && (

                                <div className="professional-activity">

                                    <div className="activity-circle booking">
                                        !
                                    </div>


                                    <div className="activity-details">

                                        <strong>
                                            Unable to load activity
                                        </strong>


                                        <span>
                                            {reservationError}
                                        </span>

                                    </div>

                                </div>

                            )}


                            {/* LOADING */}

                            {!reservationError &&
                                loadingReservations && (

                                    <div className="professional-activity">

                                        <div className="activity-circle booking">
                                            ⏳
                                        </div>


                                        <div className="activity-details">

                                            <strong>
                                                Loading reservations...
                                            </strong>


                                            <span>
                                                Fetching your latest
                                                library activity.
                                            </span>

                                        </div>

                                    </div>

                                )}


                            {/* NO RESERVATIONS */}

                            {!reservationError &&
                                !loadingReservations &&
                                reservations.length === 0 && (

                                    <div className="professional-activity">

                                        <div className="activity-circle booking">
                                            📚
                                        </div>


                                        <div className="activity-details">

                                            <strong>
                                                No reservation activity yet
                                            </strong>


                                            <span>
                                                Your library reservations
                                                will appear here.
                                            </span>

                                        </div>

                                    </div>

                                )}


                            {/* RESERVATIONS */}

                            {!reservationError &&
                                !loadingReservations &&
                                reservations.length > 0 && (

                                    reservations
                                        .slice(0, 3)
                                        .map((reservation) => (

                                            <div
                                                className="professional-activity"
                                                key={
                                                    reservation._id
                                                }
                                            >

                                                <div className="activity-circle success">
                                                    ✓
                                                </div>


                                                <div className="activity-details">

                                                    <strong>

                                                        Seat{" "}
                                                        {reservation.seatNumber}{" "}
                                                        reservation

                                                    </strong>


                                                    <span>

                                                        {reservation.purpose}
                                                        {" · "}
                                                        {reservation.startTime}
                                                        {" - "}
                                                        {reservation.endTime}

                                                    </span>

                                                </div>


                                                <time>

                                                    {new Date(
                                                        reservation.reservationDate
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}

                                                </time>

                                            </div>

                                        ))

                                )}

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