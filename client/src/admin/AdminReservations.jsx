import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminReservations.css";

function AdminReservations() {
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [reservations, setReservations] = useState([
    {
      id: "RES-001",
      member: "Ananya Sharma",
      email: "ananya.sharma@gmail.com",
      seat: "A12",
      date: "12 Sep 2026",
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      duration: "3 Hours",
      status: "Confirmed",
    },
    {
      id: "RES-002",
      member: "Rahul Kumar",
      email: "rahul.kumar@gmail.com",
      seat: "B04",
      date: "12 Sep 2026",
      startTime: "02:00 PM",
      endTime: "04:00 PM",
      duration: "2 Hours",
      status: "Confirmed",
    },
    {
      id: "RES-003",
      member: "Priya Nair",
      email: "priya.nair@gmail.com",
      seat: "C08",
      date: "12 Sep 2026",
      startTime: "09:00 AM",
      endTime: "12:00 PM",
      duration: "3 Hours",
      status: "Completed",
    },
    {
      id: "RES-004",
      member: "Arjun Menon",
      email: "arjun.menon@gmail.com",
      seat: "D03",
      date: "12 Sep 2026",
      startTime: "04:00 PM",
      endTime: "06:00 PM",
      duration: "2 Hours",
      status: "Pending",
    },
    {
      id: "RES-005",
      member: "Sneha Reddy",
      email: "sneha.reddy@gmail.com",
      seat: "A05",
      date: "13 Sep 2026",
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      duration: "3 Hours",
      status: "Confirmed",
    },
    {
      id: "RES-006",
      member: "Vikram Singh",
      email: "vikram.singh@gmail.com",
      seat: "B15",
      date: "13 Sep 2026",
      startTime: "02:00 PM",
      endTime: "05:00 PM",
      duration: "3 Hours",
      status: "Pending",
    },
    {
      id: "RES-007",
      member: "Meera Iyer",
      email: "meera.iyer@gmail.com",
      seat: "C12",
      date: "10 Sep 2026",
      startTime: "09:00 AM",
      endTime: "11:00 AM",
      duration: "2 Hours",
      status: "Completed",
    },
    {
      id: "RES-008",
      member: "Karan Patel",
      email: "karan.patel@gmail.com",
      seat: "D08",
      date: "09 Sep 2026",
      startTime: "03:00 PM",
      endTime: "05:00 PM",
      duration: "2 Hours",
      status: "Cancelled",
    },
    {
      id: "RES-009",
      member: "Divya Krishnan",
      email: "divya.krishnan@gmail.com",
      seat: "A19",
      date: "14 Sep 2026",
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      duration: "3 Hours",
      status: "Confirmed",
    },
    {
      id: "RES-010",
      member: "Aditya Rao",
      email: "aditya.rao@gmail.com",
      seat: "B21",
      date: "14 Sep 2026",
      startTime: "04:00 PM",
      endTime: "06:00 PM",
      duration: "2 Hours",
      status: "Pending",
    },
    {
      id: "RES-011",
      member: "Nisha Kapoor",
      email: "nisha.kapoor@gmail.com",
      seat: "C04",
      date: "08 Sep 2026",
      startTime: "10:00 AM",
      endTime: "01:00 PM",
      duration: "3 Hours",
      status: "Completed",
    },
    {
      id: "RES-012",
      member: "Rohan Das",
      email: "rohan.das@gmail.com",
      seat: "D17",
      date: "07 Sep 2026",
      startTime: "01:00 PM",
      endTime: "03:00 PM",
      duration: "2 Hours",
      status: "Cancelled",
    },
  ]);

  const [selectedReservation, setSelectedReservation] =
    useState(null);

  const [showDetails, setShowDetails] = useState(false);

  const totalReservations = reservations.length;

  const confirmedReservations = reservations.filter(
    (reservation) =>
      reservation.status === "Confirmed"
  ).length;

  const pendingReservations = reservations.filter(
    (reservation) =>
      reservation.status === "Pending"
  ).length;

  const completedReservations = reservations.filter(
    (reservation) =>
      reservation.status === "Completed"
  ).length;

  const cancelledReservations = reservations.filter(
    (reservation) =>
      reservation.status === "Cancelled"
  ).length;

  const filteredReservations = reservations.filter(
    (reservation) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        reservation.id
          .toLowerCase()
          .includes(searchText) ||
        reservation.member
          .toLowerCase()
          .includes(searchText) ||
        reservation.email
          .toLowerCase()
          .includes(searchText) ||
        reservation.seat
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        filterStatus === "All" ||
        reservation.status === filterStatus;

      return matchesSearch && matchesStatus;
    }
  );

  const getStatusClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "reservation-confirmed";

      case "Pending":
        return "reservation-pending";

      case "Completed":
        return "reservation-completed";

      case "Cancelled":
        return "reservation-cancelled";

      default:
        return "";
    }
  };

  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowDetails(true);
  };

  const handleCancelReservation = (reservation) => {
    if (
      reservation.status === "Cancelled"
    ) {
      alert("This reservation is already cancelled.");
      return;
    }

    if (
      reservation.status === "Completed"
    ) {
      alert("Completed reservations cannot be cancelled.");
      return;
    }

    const confirmCancel = window.confirm(
      `Are you sure you want to cancel ${reservation.id}?`
    );

    if (!confirmCancel) {
      return;
    }

    setReservations((currentReservations) =>
      currentReservations.map((item) =>
        item.id === reservation.id
          ? {
              ...item,
              status: "Cancelled",
            }
          : item
      )
    );
  };

  const handleConfirmReservation = (reservation) => {
    if (reservation.status !== "Pending") {
      alert(
        "Only pending reservations can be confirmed."
      );
      return;
    }

    setReservations((currentReservations) =>
      currentReservations.map((item) =>
        item.id === reservation.id
          ? {
              ...item,
              status: "Confirmed",
            }
          : item
      )
    );

    alert(
      `${reservation.id} has been confirmed successfully.`
    );
  };

  return (
    <div className="admin-reservations-page">

      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside className="admin-sidebar">

        <div className="admin-sidebar-logo">

          <div className="admin-logo-icon">
            📚
          </div>

          <div>
            <h2>LibraSpace</h2>
            <span>Admin Portal</span>
          </div>

        </div>


        <nav className="admin-navigation">

          {/* MAIN */}

          <div className="admin-nav-section">

            <span className="admin-nav-title">
              MAIN
            </span>

            <Link
              to="/admin/dashboard"
              className={
                location.pathname === "/admin/dashboard"
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="nav-icon">
                ▦
              </span>

              Dashboard
            </Link>


            <Link
              to="/admin/books"
              className={
                location.pathname === "/admin/books"
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="nav-icon">
                📚
              </span>

              Manage Books
            </Link>


            <Link
              to="/admin/seats"
              className={
                location.pathname === "/admin/seats"
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="nav-icon">
                💺
              </span>

              Manage Seats
            </Link>


            <Link
              to="/admin/reservations"
              className={
                location.pathname ===
                "/admin/reservations"
                  ? "admin-nav-link active"
                  : "admin-nav-link"
              }
            >
              <span className="nav-icon">
                📅
              </span>

              Reservations
            </Link>

          </div>


          {/* MANAGEMENT */}

          <div className="admin-nav-section">

            <span className="admin-nav-title">
              MANAGEMENT
            </span>

            <Link
              to="/admin/members"
              className="admin-nav-link"
            >
              <span className="nav-icon">
                👥
              </span>

              Members
            </Link>


            <Link
              to="/admin/memberships"
              className="admin-nav-link"
            >
              <span className="nav-icon">
                💳
              </span>

              Memberships
            </Link>


            <Link
              to="/admin/payments"
              className="admin-nav-link"
            >
              <span className="nav-icon">
                ₹
              </span>

              Payments
            </Link>


            <Link
              to="/admin/reports"
              className="admin-nav-link"
            >
              <span className="nav-icon">
                📊
              </span>

              Reports
            </Link>

          </div>


          {/* SYSTEM */}

          <div className="admin-nav-section">

            <span className="admin-nav-title">
              SYSTEM
            </span>

            <Link
              to="/admin/settings"
              className="admin-nav-link"
            >
              <span className="nav-icon">
                ⚙
              </span>

              Settings
            </Link>

          </div>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="admin-sidebar-bottom">

          


          <Link
            to="/admin/login"
            className="admin-bottom-link logout"
          >
            <span>
              ↪
            </span>

            Logout
          </Link>

        </div>

      </aside>


      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <main className="admin-reservations-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <div className="mobile-admin-logo">
              📚
            </div>

            <div>

              <span className="admin-page-label">
                ADMINISTRATION
              </span>

              <h3>
                Reservation Management
              </h3>

            </div>

          </div>


          <div className="admin-topbar-right">

            <button
              className="admin-notification"
              onClick={() =>
                alert(
                  "You have 3 new notifications."
                )
              }
            >
              🔔

              <span className="notification-dot"></span>
            </button>


            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div className="admin-profile-info">

                <strong>
                  Administrator
                </strong>

                <span>
                  admin@libraspace.com
                </span>

              </div>

            </div>

          </div>

        </header>


        {/* PAGE CONTENT */}

        <div className="admin-reservations-content">

          {/* BREADCRUMB */}

          <div className="admin-breadcrumb">

            <Link to="/admin/dashboard">
              Dashboard
            </Link>

            <span>
              ›
            </span>

            <span>
              Reservations
            </span>

          </div>


          {/* PAGE HEADER */}

          <div className="reservations-page-header">

            <div>

              <span className="reservations-eyebrow">
                📅 RESERVATION MANAGEMENT
              </span>

              <h1>
                Manage Reservations
              </h1>

              <p>
                Monitor, confirm and manage all library
                seat reservations.
              </p>

            </div>

          </div>


          {/* =========================================
              STATISTICS
          ========================================= */}

          <section className="reservation-stats-grid">

            <div className="reservation-stat-card">

              <div className="reservation-stat-icon total">
                📅
              </div>

              <div>

                <span>
                  Total Reservations
                </span>

                <strong>
                  {totalReservations}
                </strong>

                <small>
                  All reservations
                </small>

              </div>

            </div>


            <div className="reservation-stat-card">

              <div className="reservation-stat-icon confirmed">
                ✓
              </div>

              <div>

                <span>
                  Confirmed
                </span>

                <strong>
                  {confirmedReservations}
                </strong>

                <small>
                  Active bookings
                </small>

              </div>

            </div>


            <div className="reservation-stat-card">

              <div className="reservation-stat-icon pending">
                ⏳
              </div>

              <div>

                <span>
                  Pending
                </span>

                <strong>
                  {pendingReservations}
                </strong>

                <small>
                  Need attention
                </small>

              </div>

            </div>


            <div className="reservation-stat-card">

              <div className="reservation-stat-icon completed">
                ✓
              </div>

              <div>

                <span>
                  Completed
                </span>

                <strong>
                  {completedReservations}
                </strong>

                <small>
                  Finished bookings
                </small>

              </div>

            </div>

          </section>


          {/* =========================================
              RESERVATION SUMMARY
          ========================================= */}

          <section className="reservation-summary">

            <div className="summary-card">

              <div className="summary-card-header">

                <div>

                  <h3>
                    Reservation Overview
                  </h3>

                  <p>
                    Current reservation activity
                  </p>

                </div>

                <span className="summary-live">
                  <span></span>
                  Live
                </span>

              </div>


              <div className="summary-content">

                <div className="summary-progress">

                  <div className="summary-progress-circle">

                    <div>
                      <strong>
                        {totalReservations}
                      </strong>

                      <span>
                        Total
                      </span>
                    </div>

                  </div>

                </div>


                <div className="summary-breakdown">

                  <div className="summary-item">

                    <div>
                      <span className="summary-dot confirmed-dot"></span>
                      Confirmed
                    </div>

                    <strong>
                      {confirmedReservations}
                    </strong>

                  </div>


                  <div className="summary-item">

                    <div>
                      <span className="summary-dot pending-dot"></span>
                      Pending
                    </div>

                    <strong>
                      {pendingReservations}
                    </strong>

                  </div>


                  <div className="summary-item">

                    <div>
                      <span className="summary-dot completed-dot"></span>
                      Completed
                    </div>

                    <strong>
                      {completedReservations}
                    </strong>

                  </div>


                  <div className="summary-item">

                    <div>
                      <span className="summary-dot cancelled-dot"></span>
                      Cancelled
                    </div>

                    <strong>
                      {cancelledReservations}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            <div className="reservation-tip">

              <div className="tip-icon">
                💡
              </div>

              <div>

                <h3>
                  Reservation Tip
                </h3>

                <p>
                  Review pending reservations regularly
                  and confirm them before the requested
                  booking time.
                </p>

              </div>

            </div>

          </section>


          {/* =========================================
              RESERVATIONS TABLE
          ========================================= */}

          <section className="reservations-panel">

            <div className="reservations-panel-header">

              <div>

                <h2>
                  All Reservations
                </h2>

                <p>
                  View and manage library seat bookings.
                </p>

              </div>

              <span className="reservation-count">
                {filteredReservations.length} Records
              </span>

            </div>


            {/* TOOLBAR */}

            <div className="reservation-toolbar">

              <div className="reservation-search">

                <span>
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search reservation, member or seat..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              <div className="reservation-filter">

                <span>
                  Filter:
                </span>

                <select
                  value={filterStatus}
                  onChange={(e) =>
                    setFilterStatus(e.target.value)
                  }
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

            </div>


            {/* TABLE */}

            <div className="reservations-table-wrapper">

              <table className="reservations-table">

                <thead>

                  <tr>

                    <th>
                      RESERVATION
                    </th>

                    <th>
                      MEMBER
                    </th>

                    <th>
                      SEAT
                    </th>

                    <th>
                      DATE
                    </th>

                    <th>
                      TIME
                    </th>

                    <th>
                      STATUS
                    </th>

                    <th>
                      ACTION
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredReservations.length > 0 ? (

                    filteredReservations.map(
                      (reservation) => (

                        <tr key={reservation.id}>

                          {/* RESERVATION */}

                          <td>

                            <div className="reservation-id">

                              <div className="reservation-id-icon">
                                📅
                              </div>

                              <div>

                                <strong>
                                  {reservation.id}
                                </strong>

                                <span>
                                  {reservation.duration}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* MEMBER */}

                          <td>

                            <div className="member-cell">

                              <div className="member-avatar">
                                {reservation.member
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>

                                <strong>
                                  {reservation.member}
                                </strong>

                                <span>
                                  {reservation.email}
                                </span>

                              </div>

                            </div>

                          </td>


                          {/* SEAT */}

                          <td>

                            <span className="seat-number-badge">
                              💺 {reservation.seat}
                            </span>

                          </td>


                          {/* DATE */}

                          <td>

                            <span className="reservation-date">
                              {reservation.date}
                            </span>

                          </td>


                          {/* TIME */}

                          <td>

                            <div className="reservation-time">

                              <strong>
                                {reservation.startTime}
                              </strong>

                              <span>
                                to
                              </span>

                              <strong>
                                {reservation.endTime}
                              </strong>

                            </div>

                          </td>


                          {/* STATUS */}

                          <td>

                            <span
                              className={`reservation-status ${getStatusClass(
                                reservation.status
                              )}`}
                            >

                              <span></span>

                              {reservation.status}

                            </span>

                          </td>


                          {/* ACTION */}

                          <td>

                            <div className="reservation-actions">

                              <button
                                className="view-reservation-btn"
                                onClick={() =>
                                  handleViewReservation(
                                    reservation
                                  )
                                }
                              >
                                View
                              </button>


                              {reservation.status ===
                                "Pending" && (

                                <button
                                  className="confirm-reservation-btn"
                                  onClick={() =>
                                    handleConfirmReservation(
                                      reservation
                                    )
                                  }
                                >
                                  Confirm
                                </button>

                              )}


                              {reservation.status !==
                                "Completed" &&
                                reservation.status !==
                                  "Cancelled" && (

                                <button
                                  className="cancel-reservation-btn"
                                  onClick={() =>
                                    handleCancelReservation(
                                      reservation
                                    )
                                  }
                                >
                                  Cancel
                                </button>

                              )}

                            </div>

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="7"
                        className="no-reservations"
                      >

                        <div className="no-reservations-content">

                          <span>
                            🔍
                          </span>

                          <strong>
                            No reservations found
                          </strong>

                          <p>
                            Try changing your search or
                            filter.
                          </p>

                        </div>

                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>


          {/* =========================================
              GUIDELINES
          ========================================= */}

          <section className="reservation-guidelines">

            <div className="guideline-header">

              <div className="guideline-icon">
                📌
              </div>

              <div>

                <h2>
                  Reservation Guidelines
                </h2>

                <p>
                  Important information for administrators.
                </p>

              </div>

            </div>


            <div className="guideline-grid">

              <div className="guideline-item">

                <span>
                  01
                </span>

                <div>

                  <strong>
                    Confirm Pending Bookings
                  </strong>

                  <p>
                    Review pending reservations and
                    confirm valid requests.
                  </p>

                </div>

              </div>


              <div className="guideline-item">

                <span>
                  02
                </span>

                <div>

                  <strong>
                    Avoid Double Booking
                  </strong>

                  <p>
                    Ensure the same seat is not assigned
                    to multiple members at the same time.
                  </p>

                </div>

              </div>


              <div className="guideline-item">

                <span>
                  03
                </span>

                <div>

                  <strong>
                    Monitor Occupancy
                  </strong>

                  <p>
                    Keep track of current reservations to
                    maintain accurate seat availability.
                  </p>

                </div>

              </div>

            </div>

          </section>


          {/* FOOTER */}

          <footer className="admin-reservations-footer">

            <span>
              © 2026 LibraSpace. All Rights Reserved.
            </span>

            <span>
              Library Administration System
            </span>

          </footer>

        </div>

      </main>


      {/* =========================================
          RESERVATION DETAILS MODAL
      ========================================= */}

      {showDetails &&
        selectedReservation && (

          <div
            className="reservation-modal-overlay"
            onClick={() =>
              setShowDetails(false)
            }
          >

            <div
              className="reservation-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="reservation-modal-header">

                <div className="modal-reservation-heading">

                  <div className="modal-reservation-icon">
                    📅
                  </div>

                  <div>

                    <span>
                      RESERVATION DETAILS
                    </span>

                    <h2>
                      {selectedReservation.id}
                    </h2>

                  </div>

                </div>


                <button
                  className="reservation-modal-close"
                  onClick={() =>
                    setShowDetails(false)
                  }
                >
                  ×
                </button>

              </div>


              <div className="reservation-modal-body">

                <div className="modal-status-row">

                  <span>
                    Current Status
                  </span>

                  <span
                    className={`reservation-status ${getStatusClass(
                      selectedReservation.status
                    )}`}
                  >
                    <span></span>
                    {selectedReservation.status}
                  </span>

                </div>


                <div className="modal-member-card">

                  <div className="modal-member-avatar">
                    {selectedReservation.member
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>

                    <strong>
                      {selectedReservation.member}
                    </strong>

                    <span>
                      {selectedReservation.email}
                    </span>

                  </div>

                </div>


                <div className="modal-details-grid">

                  <div className="modal-detail">

                    <span>
                      SEAT
                    </span>

                    <strong>
                      💺 {selectedReservation.seat}
                    </strong>

                  </div>


                  <div className="modal-detail">

                    <span>
                      DATE
                    </span>

                    <strong>
                      📅 {selectedReservation.date}
                    </strong>

                  </div>


                  <div className="modal-detail">

                    <span>
                      START TIME
                    </span>

                    <strong>
                      🕐 {selectedReservation.startTime}
                    </strong>

                  </div>


                  <div className="modal-detail">

                    <span>
                      END TIME
                    </span>

                    <strong>
                      🕐 {selectedReservation.endTime}
                    </strong>

                  </div>


                  <div className="modal-detail">

                    <span>
                      DURATION
                    </span>

                    <strong>
                      ⏱ {selectedReservation.duration}
                    </strong>

                  </div>


                  <div className="modal-detail">

                    <span>
                      RESERVATION ID
                    </span>

                    <strong>
                      {selectedReservation.id}
                    </strong>

                  </div>

                </div>


                <div className="modal-actions">

                  {selectedReservation.status ===
                    "Pending" && (

                    <button
                      className="modal-confirm-btn"
                      onClick={() => {
                        handleConfirmReservation(
                          selectedReservation
                        );

                        setShowDetails(false);
                      }}
                    >
                      ✓ Confirm Reservation
                    </button>

                  )}


                  {selectedReservation.status !==
                    "Completed" &&
                    selectedReservation.status !==
                      "Cancelled" && (

                    <button
                      className="modal-cancel-btn"
                      onClick={() => {
                        handleCancelReservation(
                          selectedReservation
                        );

                        setShowDetails(false);
                      }}
                    >
                      Cancel Reservation
                    </button>

                  )}


                  <button
                    className="modal-close-btn"
                    onClick={() =>
                      setShowDetails(false)
                    }
                  >
                    Close
                  </button>

                </div>

              </div>

            </div>

          </div>

        )}

    </div>
  );
}

export default AdminReservations;