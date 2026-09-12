import { Link } from "react-router-dom";
import { useState } from "react";
import "./SeatReservation.css";

function SeatReservation() {

    const [selectedSeat, setSelectedSeat] = useState(null);

    const [date, setDate] = useState("2026-09-18");
    const [startTime, setStartTime] = useState("10:00");
    const [duration, setDuration] = useState("3");

    const reservedSeats = [
        "A3",
        "B2",
        "C3",
        "D1",
        "D5"
    ];

    const rows = ["A", "B", "C", "D"];
    const seatsPerRow = 5;


    const handleSeatClick = (seat) => {

        if (reservedSeats.includes(seat)) {
            return;
        }

        setSelectedSeat(seat);
    };


    const handleReservation = () => {

        if (!selectedSeat) {
            alert("Please select an available seat.");
            return;
        }

        alert(
            `Seat ${selectedSeat} reserved successfully!`
        );
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
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>

                </div>


                <div className="seat-menu-title">
                    MAIN MENU
                </div>


                <nav className="seat-sidebar-nav">

                    <Link to="/dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/seats"
                        className="active"
                    >
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


                <div className="seat-menu-title">
                    ACCOUNT
                </div>


                <nav className="seat-sidebar-nav">

                    <Link to="/profile">
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link to="/payment-history">
                        <span>▤</span>
                        Payment History
                    </Link>

                </nav>


                <div className="seat-sidebar-bottom">

                    <div className="seat-library-status">

                        <span className="seat-status-dot"></span>

                        <div>
                            <strong>Library Open</strong>
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


                        <div className="setting-group">

                            <label>
                                Reservation Date
                            </label>

                            <div className="input-with-icon">

                                <span>📅</span>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        <div className="setting-group">

                            <label>
                                Start Time
                            </label>

                            <div className="input-with-icon">

                                <span>🕐</span>

                                <select
                                    value={startTime}
                                    onChange={(e) =>
                                        setStartTime(e.target.value)
                                    }
                                >

                                    <option value="08:00">
                                        08:00 AM
                                    </option>

                                    <option value="09:00">
                                        09:00 AM
                                    </option>

                                    <option value="10:00">
                                        10:00 AM
                                    </option>

                                    <option value="11:00">
                                        11:00 AM
                                    </option>

                                    <option value="12:00">
                                        12:00 PM
                                    </option>

                                    <option value="14:00">
                                        02:00 PM
                                    </option>

                                    <option value="16:00">
                                        04:00 PM
                                    </option>

                                    <option value="18:00">
                                        06:00 PM
                                    </option>

                                </select>

                            </div>

                        </div>


                        <div className="setting-group">

                            <label>
                                Duration
                            </label>

                            <div className="input-with-icon">

                                <span>⏱️</span>

                                <select
                                    value={duration}
                                    onChange={(e) =>
                                        setDuration(e.target.value)
                                    }
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


                        {/* SEAT MAP */}

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

                                {rows.map((row) => (

                                    <div
                                        className="seat-row"
                                        key={row}
                                    >

                                        <span className="row-label">
                                            {row}
                                        </span>


                                        {Array.from(
                                            {
                                                length: seatsPerRow
                                            },
                                            (_, index) => {

                                                const seat =
                                                    `${row}${index + 1}`;

                                                const isReserved =
                                                    reservedSeats.includes(
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
                                                            isReserved
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

                                ))}

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
                            SUMMARY
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


                            <div className="summary-date">

                                <div className="summary-date-icon">
                                    📅
                                </div>

                                <div>

                                    <span>
                                        DATE
                                    </span>

                                    <strong>
                                        {date}
                                    </strong>

                                </div>

                            </div>


                            <div className="summary-details">

                                <div>

                                    <span>
                                        Seat
                                    </span>

                                    <strong>
                                        {selectedSeat || "Not selected"}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Start Time
                                    </span>

                                    <strong>
                                        {startTime}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Duration
                                    </span>

                                    <strong>
                                        {duration} Hour
                                        {duration !== "1" ? "s" : ""}
                                    </strong>

                                </div>

                            </div>


                            <div className="summary-divider"></div>


                            <div className="summary-note">

                                <span>
                                    ✓
                                </span>

                                <p>
                                    Your seat will be reserved exclusively
                                    for the selected time period.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="confirm-seat-button"
                                onClick={handleReservation}
                            >

                                Confirm Reservation

                                <span>
                                    →
                                </span>

                            </button>


                            <Link
                                to="/dashboard"
                                className="cancel-booking"
                            >
                                ← Back to Dashboard
                            </Link>

                        </aside>

                    </section>

                </main>


                {/* FOOTER */}

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