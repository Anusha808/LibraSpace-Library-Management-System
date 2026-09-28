import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SeatReservation.css";

const API_BASE_URL = "http://localhost:5000";

function SeatReservation() {

    const navigate = useNavigate();

    const [selectedSeat, setSelectedSeat] = useState(null);

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [startTime, setStartTime] = useState("10:00");
    const [duration, setDuration] = useState("3");

    const [myReservations, setMyReservations] = useState([]);

    const [loadingReservations, setLoadingReservations] =
        useState(true);

    const [processing, setProcessing] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const rows = ["A", "B", "C", "D"];
    const seatsPerRow = 5;

    /*
     * Existing reserved seats from your original design.
     */
    const fixedReservedSeats = [
        "A3",
        "B2",
        "C3",
        "D1",
        "D5"
    ];

    /*
     * Available start times
     */
    const timeOptions = [
        {
            value: "08:00",
            label: "08:00 AM"
        },
        {
            value: "09:00",
            label: "09:00 AM"
        },
        {
            value: "10:00",
            label: "10:00 AM"
        },
        {
            value: "11:00",
            label: "11:00 AM"
        },
        {
            value: "12:00",
            label: "12:00 PM"
        },
        {
            value: "14:00",
            label: "02:00 PM"
        },
        {
            value: "16:00",
            label: "04:00 PM"
        },
        {
            value: "18:00",
            label: "06:00 PM"
        }
    ];


    /* =========================================
       GET LOGIN TOKEN
    ========================================= */

    const getToken = () => {

        return localStorage.getItem("token");

    };


    /* =========================================
       CALCULATE END TIME
    ========================================= */

    const getEndTime = () => {

        const [
            hours,
            minutes
        ] = startTime
            .split(":")
            .map(Number);

        const end = new Date();

        end.setHours(
            hours,
            minutes,
            0,
            0
        );

        end.setHours(
            end.getHours() +
            Number(duration)
        );

        return end
            .toTimeString()
            .slice(0, 5);
    };


    /* =========================================
       FORMAT TIME
    ========================================= */

    const formatTime = (time) => {

        if (!time) {
            return "—";
        }

        const [
            hours,
            minutes
        ] = time
            .split(":")
            .map(Number);

        const tempDate = new Date();

        tempDate.setHours(
            hours,
            minutes,
            0,
            0
        );

        return tempDate.toLocaleTimeString(
            "en-US",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };


    /* =========================================
       FORMAT DATE
    ========================================= */

    const formatDate = (dateValue) => {

        if (!dateValue) {
            return "—";
        }

        const parsedDate =
            new Date(dateValue);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return dateValue;
        }

        return parsedDate.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    /* =========================================
       RESERVATION START DATE/TIME
    ========================================= */

    const reservationStart = (
        reservation
    ) => {

        const reservationDate =
            new Date(
                reservation.reservationDate
            );

        const time =
            reservation.startTime || "";

        const match =
            time.match(
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

            reservationDate.setHours(
                hours,
                minutes,
                0,
                0
            );
        }

        return reservationDate;
    };


    /* =========================================
       RESERVATION END DATE/TIME
    ========================================= */

    const reservationEnd = (
        reservation
    ) => {

        const start =
            reservationStart(
                reservation
            );

        const time =
            reservation.endTime || "";

        const match =
            time.match(
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

            const end =
                new Date(start);

            end.setHours(
                hours,
                minutes,
                0,
                0
            );

            if (end < start) {

                end.setDate(
                    end.getDate() + 1
                );

            }

            return end;
        }

        return start;
    };


    /* =========================================
       SELECTED START DATE/TIME
    ========================================= */

    const selectedStartDate = () => {

        const [
            hours,
            minutes
        ] = startTime
            .split(":")
            .map(Number);

        const result =
            new Date(
                `${date}T00:00:00`
            );

        result.setHours(
            hours,
            minutes,
            0,
            0
        );

        return result;
    };


    /* =========================================
       SELECTED END DATE/TIME
    ========================================= */

    const selectedEndDate = () => {

        const result =
            new Date(
                selectedStartDate()
            );

        result.setHours(
            result.getHours() +
            Number(duration)
        );

        return result;
    };


    /* =========================================
       CHECK TIME OVERLAP
    ========================================= */

    const reservationOverlapsSelection = (
        reservation
    ) => {

        if (
            reservation.status !==
            "confirmed"
        ) {
            return false;
        }

        const existingStart =
            reservationStart(
                reservation
            );

        const existingEnd =
            reservationEnd(
                reservation
            );

        const selectedStart =
            selectedStartDate();

        const selectedEnd =
            selectedEndDate();

        return (
            existingStart <
            selectedEnd &&
            existingEnd >
            selectedStart
        );
    };


    /* =========================================
       LOAD MY RESERVATIONS
    ========================================= */

    const loadReservations = async () => {

        try {

            setLoadingReservations(true);
            setError("");

            const token =
                getToken();

            if (!token) {

                setError(
                    "Please login to reserve a seat."
                );

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
                    "Unable to load reservations."
                );
            }

            setMyReservations(
                data.reservations || []
            );

        } catch (err) {

            console.error(
                "Reservation loading error:",
                err
            );

            setError(
                err.message ||
                "Unable to load reservations."
            );

        } finally {

            setLoadingReservations(false);

        }

    };


    /* =========================================
       LOAD RESERVATIONS ON PAGE LOAD
    ========================================= */

    useEffect(() => {

        loadReservations();

    }, []);


    /* =========================================
       CHECK WHETHER SELECTED SEAT BECAME
       RESERVED AFTER DATE/TIME CHANGE
    ========================================= */

    useEffect(() => {

        if (!selectedSeat) {
            return;
        }

        const selectedSeatReserved =
            fixedReservedSeats.includes(
                selectedSeat
            ) ||
            myReservations.some(
                (reservation) =>
                    reservation.seatNumber ===
                        selectedSeat &&
                    reservationOverlapsSelection(
                        reservation
                    )
            );

        if (selectedSeatReserved) {

            setSelectedSeat(null);

        }

    }, [
        date,
        startTime,
        duration,
        myReservations
    ]);


    /* =========================================
       CHECK SEAT AVAILABILITY
    ========================================= */

    const isSeatReserved = (seat) => {

        /*
         * Existing seats from original design
         */
        if (
            fixedReservedSeats.includes(
                seat
            )
        ) {
            return true;
        }

        /*
         * Reservations stored in MongoDB
         */
        return myReservations.some(
            (reservation) =>
                reservation.seatNumber ===
                    seat &&
                reservationOverlapsSelection(
                    reservation
                )
        );

    };


    /* =========================================
       SELECT SEAT
    ========================================= */

    const handleSeatClick = (seat) => {

        if (
            isSeatReserved(seat)
        ) {
            return;
        }

        setMessage("");
        setError("");

        setSelectedSeat(seat);

    };


    /* =========================================
       CONFIRM RESERVATION
    ========================================= */

    const handleReservation = async () => {

        setMessage("");
        setError("");


        /*
         * Check seat
         */
        if (!selectedSeat) {

            setError(
                "Please select an available seat."
            );

            return;
        }


        /*
         * Check date
         */
        if (!date) {

            setError(
                "Please select a reservation date."
            );

            return;
        }


        /*
         * Prevent past date
         */
        const selectedDate =
            new Date(
                `${date}T00:00:00`
            );

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        if (
            selectedDate < today
        ) {

            setError(
                "Please select today or a future date."
            );

            return;
        }


        /*
         * Check seat one more time
         */
        if (
            isSeatReserved(
                selectedSeat
            )
        ) {

            setError(
                `Seat ${selectedSeat} is already reserved for the selected time.`
            );

            return;
        }


        try {

            setProcessing(true);

            const token =
                getToken();


            /*
             * Check login
             */
            if (!token) {

                setError(
                    "Please login to reserve a seat."
                );

                return;
            }


            /*
             * Send reservation to backend
             */
            const response =
                await fetch(
                    `${API_BASE_URL}/api/reservations`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            seatNumber:
                                selectedSeat,

                            reservationDate:
                                date,

                            startTime:
                                formatTime(
                                    startTime
                                ),

                            endTime:
                                formatTime(
                                    getEndTime()
                                ),

                            purpose:
                                "Library Study Session"

                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Unable to reserve the seat."
                );

            }


            /*
             * Success
             */
            setMessage(
                `Seat ${selectedSeat} reserved successfully!`
            );


            setSelectedSeat(null);


            /*
             * Reload reservations
             */
            await loadReservations();


            /*
             * Go to My Reservations
             */
            setTimeout(() => {

                navigate(
                    "/reservations"
                );

            }, 1200);


        } catch (err) {

            console.error(
                "Reservation error:",
                err
            );

            setError(
                err.message ||
                "Unable to reserve the seat."
            );

        } finally {

            setProcessing(false);

        }

    };


    return (

        <div className="seat-page">


            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside className="seat-sidebar">

                <div className="seat-sidebar-logo">

                    <div className="seat-logo-icon">
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


                <div className="seat-menu-title">
                    MAIN MENU
                </div>


                <nav className="seat-sidebar-nav">

                    <Link to="/dashboard">

                        <span>
                            ⌂
                        </span>

                        Dashboard

                    </Link>


                    <Link
                        to="/seats"
                        className="active"
                    >

                        <span>
                            💺
                        </span>

                        Reserve Seat

                    </Link>


                    <Link to="/reservations">

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


                <div className="seat-menu-title">
                    ACCOUNT
                </div>


                <nav className="seat-sidebar-nav">

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


                <div className="seat-sidebar-bottom">

                    <div className="seat-library-status">

                        <span className="seat-status-dot"></span>

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
                        className="seat-logout"
                    >

                        ↪ Logout

                    </Link>

                </div>

            </aside>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <div className="seat-content">


                {/* TOPBAR */}

                <header className="seat-topbar">

                    <div>

                        <span className="seat-top-label">
                            STUDENT PORTAL
                        </span>

                        <h1>
                            Reserve a Seat
                        </h1>

                    </div>


                    <Link
                        to="/profile"
                        className="seat-user"
                    >

                        <div className="seat-user-avatar">
                            A
                        </div>

                        <div>

                            <strong>
                                Student
                            </strong>

                            <span>
                                Library Member
                            </span>

                        </div>

                    </Link>

                </header>


                {/* MAIN */}

                <main className="seat-main">


                    {/* BREADCRUMB */}

                    <div className="seat-breadcrumb">

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span>
                            /
                        </span>

                        <strong>
                            Reserve Seat
                        </strong>

                    </div>


                    {/* PAGE INTRO */}

                    <section className="seat-intro">

                        <div>

                            <span>
                                LIBRARY SEATING
                            </span>

                            <h2>
                                Find your perfect study spot
                            </h2>

                            <p>
                                Select your preferred date, time and
                                available seat for your study session.
                            </p>

                        </div>

                    </section>


                    {/* =====================================
                        BOOKING SETTINGS
                    ===================================== */}

                    <section className="booking-settings">


                        {/* DATE */}

                        <div className="setting-group">

                            <label>
                                Reservation Date
                            </label>

                            <div className="input-with-icon">

                                <span>
                                    📅
                                </span>

                                <input
                                    type="date"
                                    value={date}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split("T")[0]
                                    }
                                    onChange={(e) => {

                                        setDate(
                                            e.target.value
                                        );

                                        setMessage("");
                                        setError("");

                                    }}
                                />

                            </div>

                        </div>


                        {/* START TIME */}

                        <div className="setting-group">

                            <label>
                                Start Time
                            </label>

                            <div className="input-with-icon">

                                <span>
                                    🕐
                                </span>

                                <select
                                    value={startTime}
                                    onChange={(e) => {

                                        setStartTime(
                                            e.target.value
                                        );

                                        setMessage("");
                                        setError("");

                                    }}
                                >

                                    {timeOptions.map(
                                        (option) => (

                                            <option
                                                key={
                                                    option.value
                                                }
                                                value={
                                                    option.value
                                                }
                                            >

                                                {
                                                    option.label
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>

                        </div>


                        {/* DURATION */}

                        <div className="setting-group">

                            <label>
                                Duration
                            </label>

                            <div className="input-with-icon">

                                <span>
                                    ⏱️
                                </span>

                                <select
                                    value={duration}
                                    onChange={(e) => {

                                        setDuration(
                                            e.target.value
                                        );

                                        setMessage("");
                                        setError("");

                                    }}
                                >

                                    <option value="1">
                                        1 Hour
                                    </option>

                                    <option value="2">
                                        2 Hours
                                    </option>

                                    <option value="3">
                                        3 Hours
                                    </option>

                                    <option value="4">
                                        4 Hours
                                    </option>

                                    <option value="5">
                                        5 Hours
                                    </option>

                                </select>

                            </div>

                        </div>

                    </section>


                    {/* =====================================
                        SEAT + SUMMARY
                    ===================================== */}

                    <section className="seat-layout">


                        {/* =================================
                            SEAT MAP
                        ================================= */}

                        <div className="seat-map-card">


                            <div className="seat-card-header">

                                <div>

                                    <span>
                                        LIBRARY FLOOR
                                    </span>

                                    <h3>
                                        Select Your Seat
                                    </h3>

                                </div>

                                <span className="seat-capacity">
                                    20 Seats
                                </span>

                            </div>


                            {/* ENTRANCE */}

                            <div className="library-entrance">

                                ENTRANCE

                            </div>


                            {/* SEATS */}

                            <div className="seat-grid">

                                {rows.map(
                                    (row) => (

                                        <div
                                            className="seat-row"
                                            key={row}
                                        >

                                            <span className="row-label">
                                                {row}
                                            </span>


                                            {Array.from(
                                                {
                                                    length:
                                                        seatsPerRow
                                                },
                                                (_, index) => {

                                                    const seat =
                                                        `${row}${index + 1}`;

                                                    const isReserved =
                                                        isSeatReserved(
                                                            seat
                                                        );

                                                    const isSelected =
                                                        selectedSeat ===
                                                        seat;

                                                    return (

                                                        <button
                                                            key={seat}
                                                            type="button"
                                                            disabled={
                                                                isReserved ||
                                                                loadingReservations
                                                            }
                                                            className={`
                                                                library-seat
                                                                ${
                                                                    isReserved
                                                                        ? "reserved"
                                                                        : ""
                                                                }
                                                                ${
                                                                    isSelected
                                                                        ? "selected"
                                                                        : ""
                                                                }
                                                            `}
                                                            onClick={() =>
                                                                handleSeatClick(
                                                                    seat
                                                                )
                                                            }
                                                        >

                                                            <span>
                                                                {seat}
                                                            </span>

                                                        </button>

                                                    );

                                                }
                                            )}

                                        </div>

                                    )
                                )}

                            </div>


                            {/* STUDY TABLES */}

                            <div className="study-tables">

                                <div>
                                    STUDY TABLE
                                </div>

                                <div>
                                    STUDY TABLE
                                </div>

                            </div>


                            {/* LEGEND */}

                            <div className="seat-legend">

                                <div>

                                    <span className="legend-box available"></span>

                                    Available

                                </div>


                                <div>

                                    <span className="legend-box selected"></span>

                                    Selected

                                </div>


                                <div>

                                    <span className="legend-box reserved"></span>

                                    Reserved

                                </div>

                            </div>

                        </div>


                        {/* =================================
                            RESERVATION SUMMARY
                        ================================= */}

                        <aside className="reservation-summary">

                            <div className="summary-header">

                                <span>
                                    RESERVATION SUMMARY
                                </span>

                                <h3>
                                    Your Booking
                                </h3>

                            </div>


                            {/* CONFIRM BUTTON
                                Kept directly below the heading so the
                                booking action is clearly separated.
                            */}

                            <button
                                type="button"
                                className="confirm-seat-button"
                                onClick={
                                    handleReservation
                                }
                                disabled={
                                    processing ||
                                    loadingReservations
                                }
                            >

                                <span className="confirm-button-text">
                                    {
                                        processing
                                            ? "Reserving..."
                                            : "Confirm Reservation"
                                    }
                                </span>

                                <span className="confirm-button-arrow">
                                    →
                                </span>

                            </button>


                            {/* BOOKING INFORMATION */}

                            <div className="summary-booking-info">

                                {/* DATE */}

                                <div className="summary-date">

                                    <div className="summary-date-icon">
                                        📅
                                    </div>

                                    <div className="summary-date-content">

                                        <span>
                                            DATE
                                        </span>

                                        <strong>
                                            {formatDate(date)}
                                        </strong>

                                    </div>

                                </div>


                                {/* DETAILS */}

                                <div className="summary-details">

                                    <div>

                                        <span>
                                            Seat
                                        </span>

                                        <strong>
                                            {
                                                selectedSeat ||
                                                "Not selected"
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Start Time
                                        </span>

                                        <strong>
                                            {
                                                formatTime(
                                                    startTime
                                                )
                                            }
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Duration
                                        </span>

                                        <strong>

                                            {duration}
                                            {" "}
                                            Hour
                                            {
                                                duration !== "1"
                                                    ? "s"
                                                    : ""
                                            }

                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            End Time
                                        </span>

                                        <strong>
                                            {
                                                formatTime(
                                                    getEndTime()
                                                )
                                            }
                                        </strong>

                                    </div>

                                </div>


                                <div className="summary-divider"></div>


                                {/* NOTE */}

                                <div className="summary-note">

                                    <span>
                                        ✓
                                    </span>

                                    <p>
                                        Your seat will be reserved exclusively
                                        for the selected time period.
                                    </p>

                                </div>


                                {/* SUCCESS MESSAGE */}

                                {message && (

                                    <div
                                        className="reservation-success-message"
                                    >
                                        ✓ {message}
                                    </div>

                                )}


                                {/* ERROR MESSAGE */}

                                {error && (

                                    <div
                                        className="reservation-error-message"
                                    >
                                        ⚠️ {error}
                                    </div>

                                )}

                            </div>


                            {/* BACK */}

                            <Link
                                to="/dashboard"
                                className="cancel-booking"
                            >

                                ← Back to Dashboard

                            </Link>

                        </aside>

                    </section>

                </main>


                {/* =========================================
                    FOOTER
                ========================================= */}

                <footer className="seat-footer">

                    <strong>
                        📚 LibraSpace
                    </strong>

                    <span>
                        Smart Library Seat Reservation &
                        Membership System
                    </span>

                    <span>
                        © 2026 LibraSpace
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default SeatReservation;