import { Link } from "react-router-dom";
import "./MyReservations.css";

function MyReservations() {

    const reservations = [
        {
            id: "RES-001",
            date: "18 Sep 2026",
            day: "18",
            month: "SEP",
            year: "2026",
            seat: "A12",
            time: "10:00 AM - 1:00 PM",
            duration: "3 Hours",
            status: "Confirmed"
        },
        {
            id: "RES-002",
            date: "15 Sep 2026",
            day: "15",
            month: "SEP",
            year: "2026",
            seat: "B04",
            time: "02:00 PM - 04:00 PM",
            duration: "2 Hours",
            status: "Confirmed"
        },
        {
            id: "RES-003",
            date: "10 Sep 2026",
            day: "10",
            month: "SEP",
            year: "2026",
            seat: "C08",
            time: "09:00 AM - 12:00 PM",
            duration: "3 Hours",
            status: "Completed"
        },
        {
            id: "RES-004",
            date: "05 Sep 2026",
            day: "05",
            month: "SEP",
            year: "2026",
            seat: "D03",
            time: "04:00 PM - 06:00 PM",
            duration: "2 Hours",
            status: "Completed"
        }
    ];


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
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>

                </div>


                <div className="reservations-menu-title">
                    MAIN MENU
                </div>


                <nav className="reservations-sidebar-nav">

                    <Link to="/dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link to="/seats">
                        <span>💺</span>
                        Reserve Seat
                    </Link>

                    <Link
                        to="/reservations"
                        className="active"
                    >
                        <span>▣</span>
                        My Reservations
                    </Link>

                    <Link to="/membership">
                        <span>♛</span>
                        Membership
                    </Link>

                </nav>


                <div className="reservations-menu-title">
                    ACCOUNT
                </div>


                <nav className="reservations-sidebar-nav">

                    <Link to="/profile">
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link to="/payment-history">
                        <span>▤</span>
                        Payment History
                    </Link>

                </nav>


                <div className="reservations-sidebar-bottom">

                    <div className="reservations-library-status">

                        <span className="reservations-status-dot"></span>

                        <div>
                            <strong>Library Open</strong>

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
                            <span>+</span>
                            Reserve a Seat
                        </Link>

                    </section>


                    {/* =========================================
                        SUMMARY CARDS
                    ========================================= */}

                    <section className="reservation-summary-grid">

                        <div className="reservation-stat-card">

                            <div className="reservation-stat-icon">
                                📅
                            </div>

                            <div>
                                <strong>2</strong>

                                <span>
                                    Upcoming
                                </span>
                            </div>

                        </div>


                        <div className="reservation-stat-card">

                            <div className="reservation-stat-icon completed-stat">
                                ✓
                            </div>

                            <div>
                                <strong>2</strong>

                                <span>
                                    Completed
                                </span>
                            </div>

                        </div>


                        <div className="reservation-stat-card">

                            <div className="reservation-stat-icon total-stat">
                                ▣
                            </div>

                            <div>
                                <strong>12</strong>

                                <span>
                                    Total Reservations
                                </span>
                            </div>

                        </div>

                    </section>


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

                                <select defaultValue="all">

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


                        <div className="reservation-list">

                            {reservations.map((reservation) => (

                                <div
                                    className="reservation-item"
                                    key={reservation.id}
                                >


                                    {/* DATE */}

                                    <div className="reservation-date-box">

                                        <span>
                                            {reservation.month}
                                        </span>

                                        <strong>
                                            {reservation.day}
                                        </strong>

                                        <small>
                                            {reservation.year}
                                        </small>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="reservation-information">

                                        <div className="reservation-title-row">

                                            <h4>
                                                Library Study Session
                                            </h4>

                                            <span
                                                className={
                                                    reservation.status ===
                                                    "Confirmed"
                                                        ? "reservation-status confirmed"
                                                        : "reservation-status completed"
                                                }
                                            >
                                                {reservation.status ===
                                                "Confirmed"
                                                    ? "✓ "
                                                    : "✓ "
                                                }

                                                {reservation.status}
                                            </span>

                                        </div>


                                        <div className="reservation-meta-row">

                                            <span>
                                                💺 Seat{" "}
                                                <strong>
                                                    {reservation.seat}
                                                </strong>
                                            </span>

                                            <span>
                                                🕐{" "}
                                                {reservation.time}
                                            </span>

                                            <span>
                                                ⏱️{" "}
                                                {reservation.duration}
                                            </span>

                                        </div>


                                        <small className="reservation-id">
                                            Reservation ID:{" "}
                                            {reservation.id}
                                        </small>

                                    </div>


                                    {/* ACTION */}

                                    <div className="reservation-action">

                                        {reservation.status ===
                                        "Confirmed" ? (

                                            <button
                                                type="button"
                                                className="manage-reservation-button"
                                                onClick={() =>
                                                    alert(
                                                        `Managing reservation ${reservation.id}`
                                                    )
                                                }
                                            >
                                                Manage
                                            </button>

                                        ) : (

                                            <button
                                                type="button"
                                                className="view-reservation-button"
                                                onClick={() =>
                                                    alert(
                                                        `Reservation ${reservation.id}`
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

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