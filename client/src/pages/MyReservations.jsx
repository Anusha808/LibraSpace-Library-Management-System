import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./MyReservations.css";

const API_BASE_URL = "http://localhost:5000";

function MyReservations() {

    /* =========================================
       STATES
    ========================================= */

    const [reservations, setReservations] = useState([]);

    const [filter, setFilter] = useState("all");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [actionLoading, setActionLoading] = useState(null);


    /* =========================================
       TOKEN
    ========================================= */

    const getToken = () => {
        return localStorage.getItem("token");
    };


    /* =========================================
       DATE + TIME HELPERS
    ========================================= */

    const convertTimeToMinutes = (time) => {

        if (!time) {
            return 0;
        }

        const match = time.match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );

        if (!match) {
            return 0;
        }

        let hours = Number(match[1]);

        const minutes = Number(match[2]);

        const period = match[3].toUpperCase();

        if (period === "PM" && hours !== 12) {
            hours += 12;
        }

        if (period === "AM" && hours === 12) {
            hours = 0;
        }

        return (
            hours * 60 +
            minutes
        );
    };


    const getReservationStartDate = (reservation) => {

        const date = new Date(
            reservation.reservationDate
        );

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        const time =
            reservation.startTime || "";

        const match = time.match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );

        if (match) {

            let hours =
                Number(match[1]);

            const minutes =
                Number(match[2]);

            const period =
                match[3].toUpperCase();

            if (
                period === "PM" &&
                hours !== 12
            ) {
                hours += 12;
            }

            if (
                period === "AM" &&
                hours === 12
            ) {
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


    const getReservationEndDate = (reservation) => {

        const date = new Date(
            reservation.reservationDate
        );

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        const time =
            reservation.endTime || "";

        const match = time.match(
            /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
        );

        if (match) {

            let hours =
                Number(match[1]);

            const minutes =
                Number(match[2]);

            const period =
                match[3].toUpperCase();

            if (
                period === "PM" &&
                hours !== 12
            ) {
                hours += 12;
            }

            if (
                period === "AM" &&
                hours === 12
            ) {
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


    /* =========================================
       FORMAT DATE
    ========================================= */

    const getDateParts = (dateValue) => {

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {

            return {
                day: "--",
                month: "---",
                year: "----"
            };
        }

        return {
            day: date.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit"
                }
            ),

            month: date.toLocaleDateString(
                "en-US",
                {
                    month: "short"
                }
            ).toUpperCase(),

            year: date.toLocaleDateString(
                "en-US",
                {
                    year: "numeric"
                }
            )
        };
    };


    /* =========================================
       FORMAT TIME
    ========================================= */

    const formatTime = (time) => {

        if (!time) {
            return "—";
        }

        /*
         * Backend already stores values such as:
         * 10:00 AM
         * 01:00 PM
         *
         * So return them directly.
         */

        return time;
    };


    /* =========================================
       CALCULATE DURATION
    ========================================= */

    const calculateDuration = (
        startTime,
        endTime
    ) => {

        const start =
            convertTimeToMinutes(
                startTime
            );

        const end =
            convertTimeToMinutes(
                endTime
            );

        if (
            !startTime ||
            !endTime ||
            end <= start
        ) {
            return "—";
        }

        const difference =
            end - start;

        const hours =
            difference / 60;

        if (
            Number.isInteger(hours)
        ) {

            return `${hours} ${
                hours === 1
                    ? "Hour"
                    : "Hours"
            }`;
        }

        return `${hours.toFixed(1)} Hours`;
    };


    /* =========================================
       USER-FRIENDLY RESERVATION ID
    ========================================= */

    const getDisplayReservationId = (
        reservation,
        index
    ) => {

        /*
         * MongoDB _id is the real database ID.
         *
         * We display a simple RES-001 style
         * identifier in the UI.
         */

        if (reservation.displayId) {
            return reservation.displayId;
        }

        return `RES-${String(
            reservations.length - index
        ).padStart(3, "0")}`;
    };


    /* =========================================
       FETCH RESERVATIONS
    ========================================= */

    const fetchReservations = async () => {

        try {

            setLoading(true);

            setError("");

            const token =
                getToken();

            if (!token) {

                setError(
                    "Please login to view your reservations."
                );

                setReservations([]);

                return;
            }

            const response =
                await fetch(
                    `${API_BASE_URL}/api/reservations/my`,
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Cache-Control":
                                "no-cache"
                        }
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to fetch reservations."
                );
            }

            const fetchedReservations =
                data.reservations || [];

            /*
             * Sort newest reservation first.
             */

            const sortedReservations =
                [...fetchedReservations].sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                a.reservationDate
                            );

                        const dateB =
                            new Date(
                                b.reservationDate
                            );

                        return (
                            dateB - dateA
                        );
                    }
                );

            setReservations(
                sortedReservations
            );

        } catch (err) {

            console.error(
                "Fetch reservations error:",
                err
            );

            setError(
                err.message ||
                "Unable to load reservations."
            );

            setReservations([]);

        } finally {

            setLoading(false);
        }
    };


    /* =========================================
       LOAD DATA
    ========================================= */

    useEffect(() => {

        fetchReservations();

    }, []);


    /* =========================================
       DETERMINE UPCOMING RESERVATION
    ========================================= */

    const isUpcomingReservation = (
        reservation
    ) => {

        if (
            reservation.status ===
            "cancelled"
        ) {
            return false;
        }

        if (
            reservation.status ===
            "completed"
        ) {
            return false;
        }

        const startDate =
            getReservationStartDate(
                reservation
            );

        if (!startDate) {
            return false;
        }

        return (
            startDate >= new Date()
        );
    };


    /* =========================================
       DETERMINE COMPLETED RESERVATION
    ========================================= */

    const isCompletedReservation = (
        reservation
    ) => {

        if (
            reservation.status ===
            "completed"
        ) {
            return true;
        }

        const endDate =
            getReservationEndDate(
                reservation
            );

        if (!endDate) {
            return false;
        }

        return (
            endDate < new Date() &&
            reservation.status !==
                "cancelled"
        );
    };


    /* =========================================
       SUMMARY COUNTS
    ========================================= */

    const upcomingCount =
        useMemo(() => {

            return reservations.filter(
                isUpcomingReservation
            ).length;

        }, [reservations]);


    const completedCount =
        useMemo(() => {

            return reservations.filter(
                isCompletedReservation
            ).length;

        }, [reservations]);


    const totalCount =
        reservations.length;


    /* =========================================
       FILTERED RESERVATIONS
    ========================================= */

    const filteredReservations =
        useMemo(() => {

            if (filter === "upcoming") {

                return reservations.filter(
                    isUpcomingReservation
                );
            }

            if (filter === "completed") {

                return reservations.filter(
                    isCompletedReservation
                );
            }

            return reservations;

        }, [
            reservations,
            filter
        ]);


    /* =========================================
       CANCEL RESERVATION
    ========================================= */

    const handleCancelReservation = async (
        reservation
    ) => {

        if (
            !reservation?._id
        ) {
            return;
        }

        const confirmCancel =
            window.confirm(
                `Are you sure you want to cancel the reservation for seat ${reservation.seatNumber}?`
            );

        if (!confirmCancel) {
            return;
        }

        try {

            setActionLoading(
                reservation._id
            );

            setError("");

            const token =
                getToken();

            if (!token) {

                setError(
                    "Please login again."
                );

                return;
            }

            const response =
                await fetch(
                    `${API_BASE_URL}/api/reservations/${reservation._id}/cancel`,
                    {
                        method: "PUT",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to cancel reservation."
                );
            }

            /*
             * Reload reservations so the
             * status comes directly from MongoDB.
             */

            await fetchReservations();

        } catch (err) {

            console.error(
                "Cancel reservation error:",
                err
            );

            setError(
                err.message ||
                "Unable to cancel reservation."
            );

        } finally {

            setActionLoading(null);
        }
    };


    /* =========================================
       VIEW RESERVATION
    ========================================= */

    const handleViewReservation = (
        reservation
    ) => {

        const date =
            getDateParts(
                reservation.reservationDate
            );

        window.alert(
            `Reservation Details\n\n` +
            `Reservation ID: ${
                reservation._id
            }\n` +
            `Seat: ${
                reservation.seatNumber
            }\n` +
            `Date: ${
                date.day
            } ${
                date.month
            } ${
                date.year
            }\n` +
            `Time: ${
                reservation.startTime
            } - ${
                reservation.endTime
            }\n` +
            `Purpose: ${
                reservation.purpose ||
                "Library Study Session"
            }\n` +
            `Status: ${
                reservation.status
            }`
        );
    };


    return (

        <div className="reservations-page">


            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="reservations-sidebar">

                <div className="reservations-sidebar-logo">

                    <div className="reservations-logo-icon">
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


                <div className="reservations-menu-title">
                    MAIN MENU
                </div>


                <nav className="reservations-sidebar-nav">

                    <Link to="/dashboard">

                        <span>
                            ⌂
                        </span>

                        Dashboard

                    </Link>


                    <Link to="/seats">

                        <span>
                            💺
                        </span>

                        Reserve Seat

                    </Link>


                    <Link
                        to="/reservations"
                        className="active"
                    >

                        <span>
                            ▣
                        </span>

                        My Reservations

                    </Link>


                    <Link to="/membership">

                        <span>
                            ♛
                        </span>

                        Membership

                    </Link>

                </nav>


                <div className="reservations-menu-title">
                    ACCOUNT
                </div>


                <nav className="reservations-sidebar-nav">

                    <Link to="/profile">

                        <span>
                            ◯
                        </span>

                        My Profile

                    </Link>


                    <Link to="/payment-history">

                        <span>
                            ▤
                        </span>

                        Payment History

                    </Link>

                </nav>


                <div className="reservations-sidebar-bottom">

                    <div className="reservations-library-status">

                        <span className="reservations-status-dot"></span>

                        <div>

                            <strong>
                                Library Open
                            </strong>

                            <small>
                                8:00 AM - 10:00 PM
                            </small>

                        </div>

                    </div>


                    <Link
                        to="/"
                        className="reservations-logout"
                    >
                        ↪ Logout
                    </Link>

                </div>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <div className="reservations-content">


                {/* =========================================
                    TOPBAR
                ========================================= */}

                <header className="reservations-topbar">

                    <div>

                        <span className="reservations-top-label">
                            STUDENT PORTAL
                        </span>

                        <h1>
                            My Reservations
                        </h1>

                    </div>


                    <Link
                        to="/profile"
                        className="reservations-user"
                    >

                        <div className="reservations-user-avatar">
                            A
                        </div>

                        <div className="reservations-user-info">

                            <strong>
                                Student
                            </strong>

                            <span>
                                Library Member
                            </span>

                        </div>

                    </Link>

                </header>


                {/* =========================================
                    MAIN
                ========================================= */}

                <main className="reservations-main">


                    {/* BREADCRUMB */}

                    <div className="reservations-breadcrumb">

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span>
                            /
                        </span>

                        <strong>
                            My Reservations
                        </strong>

                    </div>


                    {/* PAGE HEADER */}

                    <section className="reservations-page-header">

                        <div>

                            <span className="reservations-eyebrow">
                                BOOKING HISTORY
                            </span>

                            <h2>
                                My Reservations
                            </h2>

                            <p>
                                View and manage all your library seat
                                reservations in one place.
                            </p>

                        </div>


                        <Link
                            to="/seats"
                            className="new-reservation-button"
                        >

                            <span>
                                +
                            </span>

                            Reserve a Seat

                        </Link>

                    </section>


                    {/* =========================================
                        SUMMARY CARDS
                    ========================================= */}

                    <section className="reservation-summary-grid">


                        {/* UPCOMING */}

                        <div className="reservation-stat-card">

                            <div className="reservation-stat-icon">
                                📅
                            </div>

                            <div>

                                <strong>
                                    {upcomingCount}
                                </strong>

                                <span>
                                    Upcoming
                                </span>

                            </div>

                        </div>


                        {/* COMPLETED */}

                        <div className="reservation-stat-card">

                            <div className="reservation-stat-icon completed-stat">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    {completedCount}
                                </strong>

                                <span>
                                    Completed
                                </span>

                            </div>

                        </div>


                        {/* TOTAL */}

                        <div className="reservation-stat-card">

                            <div className="reservation-stat-icon total-stat">
                                ▣
                            </div>

                            <div>

                                <strong>
                                    {totalCount}
                                </strong>

                                <span>
                                    Total Reservations
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =========================================
                        ERROR
                    ========================================= */}

                    {error && (

                        <div
                            className="reservation-error-message"
                            style={{
                                marginBottom:
                                    "20px"
                            }}
                        >

                            ⚠️ {error}

                        </div>

                    )}


                    {/* =========================================
                        RESERVATION LIST
                    ========================================= */}

                    <section className="reservations-card">


                        <div className="reservations-card-header">

                            <div>

                                <span className="reservations-card-eyebrow">
                                    YOUR BOOKINGS
                                </span>

                                <h3>
                                    Reservation History
                                </h3>

                            </div>


                            <div className="reservation-filter">

                                <select
                                    value={filter}
                                    onChange={(e) =>
                                        setFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="all">
                                        All Reservations
                                    </option>

                                    <option value="upcoming">
                                        Upcoming
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* =========================================
                            LOADING
                        ========================================= */}

                        {loading ? (

                            <div
                                className="reservation-empty"
                                style={{
                                    padding:
                                        "50px",
                                    textAlign:
                                        "center"
                                }}
                            >

                                <p>
                                    Loading your reservations...
                                </p>

                            </div>

                        ) : filteredReservations.length === 0 ? (

                            /* =====================================
                               EMPTY STATE
                            ===================================== */

                            <div
                                className="reservation-empty"
                                style={{
                                    padding:
                                        "50px",
                                    textAlign:
                                        "center"
                                }}
                            >

                                <div
                                    style={{
                                        fontSize:
                                            "40px",
                                        marginBottom:
                                            "12px"
                                    }}
                                >
                                    📅
                                </div>

                                <h3>
                                    No Reservations Found
                                </h3>

                                <p>
                                    {filter === "upcoming"
                                        ? "You do not have any upcoming reservations."
                                        : filter === "completed"
                                            ? "You do not have any completed reservations."
                                            : "You have not made any seat reservations yet."
                                    }
                                </p>

                                <Link
                                    to="/seats"
                                    className="new-reservation-button"
                                    style={{
                                        display:
                                            "inline-flex",
                                        marginTop:
                                            "18px"
                                    }}
                                >

                                    <span>
                                        +
                                    </span>

                                    Reserve a Seat

                                </Link>

                            </div>

                        ) : (

                            /* =====================================
                               RESERVATION LIST
                            ===================================== */

                            <div className="reservation-list">

                                {filteredReservations.map(
                                    (
                                        reservation,
                                        index
                                    ) => {

                                        const date =
                                            getDateParts(
                                                reservation.reservationDate
                                            );

                                        const upcoming =
                                            isUpcomingReservation(
                                                reservation
                                            );

                                        const completed =
                                            isCompletedReservation(
                                                reservation
                                            );

                                        const cancelled =
                                            reservation.status ===
                                            "cancelled";

                                        const displayId =
                                            getDisplayReservationId(
                                                reservation,
                                                index
                                            );

                                        return (

                                            <div
                                                className="reservation-item"
                                                key={
                                                    reservation._id
                                                }
                                            >


                                                {/* DATE */}

                                                <div className="reservation-date-box">

                                                    <span>
                                                        {
                                                            date.month
                                                        }
                                                    </span>

                                                    <strong>
                                                        {
                                                            date.day
                                                        }
                                                    </strong>

                                                    <small>
                                                        {
                                                            date.year
                                                        }
                                                    </small>

                                                </div>


                                                {/* DETAILS */}

                                                <div className="reservation-information">

                                                    <div className="reservation-title-row">

                                                        <h4>
                                                            {
                                                                reservation.purpose ||
                                                                "Library Study Session"
                                                            }
                                                        </h4>


                                                        <span
                                                            className={
                                                                `reservation-status ${
                                                                    cancelled
                                                                        ? "cancelled"
                                                                        : completed
                                                                            ? "completed"
                                                                            : "confirmed"
                                                                }`
                                                            }
                                                        >

                                                            {cancelled
                                                                ? "✕ Cancelled"
                                                                : completed
                                                                    ? "✓ Completed"
                                                                    : "✓ Confirmed"
                                                            }

                                                        </span>

                                                    </div>


                                                    <div className="reservation-meta-row">

                                                        <span>

                                                            💺 Seat{" "}

                                                            <strong>
                                                                {
                                                                    reservation.seatNumber
                                                                }
                                                            </strong>

                                                        </span>


                                                        <span>

                                                            🕐{" "}

                                                            {
                                                                formatTime(
                                                                    reservation.startTime
                                                                )
                                                            }

                                                            {" - "}

                                                            {
                                                                formatTime(
                                                                    reservation.endTime
                                                                )
                                                            }

                                                        </span>


                                                        <span>

                                                            ⏱️{" "}

                                                            {
                                                                calculateDuration(
                                                                    reservation.startTime,
                                                                    reservation.endTime
                                                                )
                                                            }

                                                        </span>

                                                    </div>


                                                    <small className="reservation-id">

                                                        Reservation ID:{" "}

                                                        {
                                                            displayId
                                                        }

                                                    </small>

                                                </div>


                                                {/* ACTION */}

                                                <div className="reservation-action">

                                                    {upcoming ? (

                                                        <button
                                                            type="button"
                                                            className="manage-reservation-button"
                                                            disabled={
                                                                actionLoading ===
                                                                reservation._id
                                                            }
                                                            onClick={() =>
                                                                handleCancelReservation(
                                                                    reservation
                                                                )
                                                            }
                                                        >

                                                            {
                                                                actionLoading ===
                                                                reservation._id
                                                                    ? "Cancelling..."
                                                                    : "Cancel"
                                                            }

                                                        </button>

                                                    ) : (

                                                        <button
                                                            type="button"
                                                            className="view-reservation-button"
                                                            onClick={() =>
                                                                handleViewReservation(
                                                                    reservation
                                                                )
                                                            }
                                                        >

                                                            View

                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>

                        )}

                    </section>


                    {/* =========================================
                        INFORMATION BOX
                    ========================================= */}

                    <section className="reservation-info-box">

                        <div className="reservation-info-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                Reservation Guidelines
                            </strong>

                            <p>
                                Please arrive on time for your reservation.
                                Seats may be released if you do not arrive
                                within 30 minutes of your booking start time.
                            </p>

                        </div>

                    </section>


                </main>


                {/* =========================================
                    FOOTER
                ========================================= */}

                <footer className="reservations-footer">

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

export default MyReservations;