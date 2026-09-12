import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSeats.css";

function AdminSeats() {
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [seats, setSeats] = useState(() => {
    const seatData = [];

    const statuses = {
      A3: "Reserved",
      A4: "Occupied",
      A5: "Occupied",
      B2: "Reserved",
      B4: "Occupied",
      B5: "Occupied",
      C1: "Occupied",
      C3: "Reserved",
      C4: "Occupied",
      D1: "Reserved",
      D3: "Occupied",
      D5: "Occupied",
    };

    for (const row of ["A", "B", "C", "D"]) {
      for (let number = 1; number <= 25; number++) {
        const seatNumber = `${row}${number}`;

        seatData.push({
          id: seatNumber,
          seatNumber,
          row,
          status: statuses[seatNumber] || "Available",
          section:
            row === "A"
              ? "Reading Hall"
              : row === "B"
              ? "Reading Hall"
              : row === "C"
              ? "Reference Hall"
              : "Silent Zone",
        });
      }
    }

    return seatData;
  });

  const [showAddModal, setShowAddModal] = useState(false);

  const [newSeat, setNewSeat] = useState({
    seatNumber: "",
    section: "Reading Hall",
  });

  const availableSeats = seats.filter(
    (seat) => seat.status === "Available"
  ).length;

  const reservedSeats = seats.filter(
    (seat) => seat.status === "Reserved"
  ).length;

  const occupiedSeats = seats.filter(
    (seat) => seat.status === "Occupied"
  ).length;

  const totalSeats = seats.length;

  const occupiedPercentage =
    totalSeats > 0
      ? Math.round((occupiedSeats / totalSeats) * 100)
      : 0;

  const reservedPercentage =
    totalSeats > 0
      ? Math.round((reservedSeats / totalSeats) * 100)
      : 0;

  const filteredSeats = seats.filter((seat) => {
    const matchesSearch = seat.seatNumber
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      seat.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    if (status === "Available") {
      return "seat-available";
    }

    if (status === "Reserved") {
      return "seat-reserved";
    }

    return "seat-occupied";
  };

  const handleSeatClick = (seat) => {
    if (seat.status === "Occupied") {
      alert(
        `Seat ${seat.seatNumber} is currently occupied.`
      );
      return;
    }

    if (seat.status === "Reserved") {
      alert(
        `Seat ${seat.seatNumber} is currently reserved.`
      );
      return;
    }

    alert(
      `Seat ${seat.seatNumber} is available.`
    );
  };

  const handleChangeStatus = (seat) => {
    let newStatus = "Available";

    if (seat.status === "Available") {
      newStatus = "Reserved";
    } else if (seat.status === "Reserved") {
      newStatus = "Occupied";
    } else {
      newStatus = "Available";
    }

    const confirmChange = window.confirm(
      `Change seat ${seat.seatNumber} from ${seat.status} to ${newStatus}?`
    );

    if (!confirmChange) {
      return;
    }

    setSeats((currentSeats) =>
      currentSeats.map((item) =>
        item.id === seat.id
          ? {
              ...item,
              status: newStatus,
            }
          : item
      )
    );
  };

  const handleAddSeat = (e) => {
    e.preventDefault();

    const seatNumber = newSeat.seatNumber
      .trim()
      .toUpperCase();

    if (!seatNumber) {
      alert("Please enter a seat number.");
      return;
    }

    const alreadyExists = seats.some(
      (seat) => seat.seatNumber === seatNumber
    );

    if (alreadyExists) {
      alert("This seat already exists.");
      return;
    }

    const newSeatObject = {
      id: seatNumber,
      seatNumber,
      row: seatNumber.charAt(0),
      status: "Available",
      section: newSeat.section,
    };

    setSeats((currentSeats) => [
      ...currentSeats,
      newSeatObject,
    ]);

    setNewSeat({
      seatNumber: "",
      section: "Reading Hall",
    });

    setShowAddModal(false);
  };

  return (
    <div className="admin-seats-page">

      {/* =====================================
          SIDEBAR
      ====================================== */}

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
              <span className="nav-icon">▦</span>
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
              <span className="nav-icon">📚</span>
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
              <span className="nav-icon">💺</span>
              Manage Seats
            </Link>

            <Link
              to="/admin/reservations"
              className="admin-nav-link"
            >
              <span className="nav-icon">📅</span>
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
              <span className="nav-icon">👥</span>
              Members
            </Link>

            <Link
              to="/admin/memberships"
              className="admin-nav-link"
            >
              <span className="nav-icon">💳</span>
              Memberships
            </Link>

            <Link
              to="/admin/payments"
              className="admin-nav-link"
            >
              <span className="nav-icon">₹</span>
              Payments
            </Link>

            <Link
              to="/admin/reports"
              className="admin-nav-link"
            >
              <span className="nav-icon">📊</span>
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
              <span className="nav-icon">⚙</span>
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
            <span>↪</span>
            Logout
          </Link>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <main className="admin-seats-main">

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
                Seat Management
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

        <div className="admin-seats-content">

          {/* BREADCRUMB */}

          <div className="admin-breadcrumb">

            <Link to="/admin/dashboard">
              Dashboard
            </Link>

            <span>›</span>

            <span>
              Manage Seats
            </span>

          </div>


          {/* HEADER */}

          <div className="seats-page-header">

            <div>

              <span className="seats-eyebrow">
                💺 LIBRARY SEAT MANAGEMENT
              </span>

              <h1>
                Manage Seats
              </h1>

              <p>
                Monitor library seating capacity and
                manage seat availability.
              </p>

            </div>


            <button
              className="add-seat-btn"
              onClick={() =>
                setShowAddModal(true)
              }
            >
              <span>＋</span>
              Add New Seat
            </button>

          </div>


          {/* =====================================
              STAT CARDS
          ====================================== */}

          <section className="seat-stats-grid">

            <div className="seat-stat-card">

              <div className="seat-stat-icon total">
                💺
              </div>

              <div className="seat-stat-content">

                <span>
                  Total Seats
                </span>

                <strong>
                  {totalSeats}
                </strong>

                <small>
                  Library capacity
                </small>

              </div>

            </div>


            <div className="seat-stat-card">

              <div className="seat-stat-icon available">
                ✓
              </div>

              <div className="seat-stat-content">

                <span>
                  Available
                </span>

                <strong>
                  {availableSeats}
                </strong>

                <small>
                  Ready for booking
                </small>

              </div>

            </div>


            <div className="seat-stat-card">

              <div className="seat-stat-icon reserved">
                📅
              </div>

              <div className="seat-stat-content">

                <span>
                  Reserved
                </span>

                <strong>
                  {reservedSeats}
                </strong>

                <small>
                  Upcoming bookings
                </small>

              </div>

            </div>


            <div className="seat-stat-card">

              <div className="seat-stat-icon occupied">
                👤
              </div>

              <div className="seat-stat-content">

                <span>
                  Occupied
                </span>

                <strong>
                  {occupiedSeats}
                </strong>

                <small>
                  Currently in use
                </small>

              </div>

            </div>

          </section>


          {/* =====================================
              OCCUPANCY OVERVIEW
          ====================================== */}

          <section className="seat-overview">

            <div className="occupancy-card">

              <div className="overview-header">

                <div>

                  <h2>
                    Seat Occupancy
                  </h2>

                  <p>
                    Current library seating status
                  </p>

                </div>

                <span className="live-status">
                  <span></span>
                  Live Status
                </span>

              </div>


              <div className="occupancy-body">

                <div className="occupancy-circle">

                  <div className="circle-inner">

                    <strong>
                      {occupiedPercentage}%
                    </strong>

                    <span>
                      Occupied
                    </span>

                  </div>

                </div>


                <div className="occupancy-details">

                  <div className="occupancy-item">

                    <div className="occupancy-label">

                      <span className="legend-dot available-dot"></span>

                      <span>
                        Available
                      </span>

                    </div>

                    <strong>
                      {availableSeats}
                    </strong>

                  </div>


                  <div className="occupancy-item">

                    <div className="occupancy-label">

                      <span className="legend-dot reserved-dot"></span>

                      <span>
                        Reserved
                      </span>

                    </div>

                    <strong>
                      {reservedSeats}
                    </strong>

                  </div>


                  <div className="occupancy-item">

                    <div className="occupancy-label">

                      <span className="legend-dot occupied-dot"></span>

                      <span>
                        Occupied
                      </span>

                    </div>

                    <strong>
                      {occupiedSeats}
                    </strong>

                  </div>


                  <div className="occupancy-progress">

                    <div className="progress-label">

                      <span>
                        Occupancy
                      </span>

                      <strong>
                        {occupiedPercentage}%
                      </strong>

                    </div>

                    <div className="progress-track">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${occupiedPercentage}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                </div>

              </div>

            </div>


            {/* QUICK INFO */}

            <div className="seat-info-card">

              <div className="seat-info-header">

                <div className="seat-info-icon">
                  💡
                </div>

                <div>

                  <h3>
                    Seat Information
                  </h3>

                  <p>
                    Library seating guidelines
                  </p>

                </div>

              </div>


              <div className="seat-info-list">

                <div className="seat-info-row">

                  <span className="info-symbol available-symbol">
                    ✓
                  </span>

                  <div>
                    <strong>
                      Available
                    </strong>

                    <small>
                      Students can reserve this seat.
                    </small>
                  </div>

                </div>


                <div className="seat-info-row">

                  <span className="info-symbol reserved-symbol">
                    📅
                  </span>

                  <div>
                    <strong>
                      Reserved
                    </strong>

                    <small>
                      Seat has an upcoming reservation.
                    </small>
                  </div>

                </div>


                <div className="seat-info-row">

                  <span className="info-symbol occupied-symbol">
                    👤
                  </span>

                  <div>
                    <strong>
                      Occupied
                    </strong>

                    <small>
                      Seat is currently being used.
                    </small>
                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =====================================
              SEAT MANAGEMENT PANEL
          ====================================== */}

          <section className="seats-panel">

            <div className="seats-panel-header">

              <div>

                <h2>
                  Library Seats
                </h2>

                <p>
                  Select a seat to view its current status.
                </p>

              </div>

              <div className="seat-count-badge">
                {filteredSeats.length} Seats
              </div>

            </div>


            {/* TOOLBAR */}

            <div className="seats-toolbar">

              <div className="seat-search">

                <span>
                  🔍
                </span>

                <input
                  type="text"
                  placeholder="Search seat number..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>


              <div className="seat-filter-buttons">

                <button
                  className={
                    filterStatus === "All"
                      ? "seat-filter active"
                      : "seat-filter"
                  }
                  onClick={() =>
                    setFilterStatus("All")
                  }
                >
                  All
                </button>

                <button
                  className={
                    filterStatus === "Available"
                      ? "seat-filter active available-filter"
                      : "seat-filter"
                  }
                  onClick={() =>
                    setFilterStatus("Available")
                  }
                >
                  Available
                </button>

                <button
                  className={
                    filterStatus === "Reserved"
                      ? "seat-filter active reserved-filter"
                      : "seat-filter"
                  }
                  onClick={() =>
                    setFilterStatus("Reserved")
                  }
                >
                  Reserved
                </button>

                <button
                  className={
                    filterStatus === "Occupied"
                      ? "seat-filter active occupied-filter"
                      : "seat-filter"
                  }
                  onClick={() =>
                    setFilterStatus("Occupied")
                  }
                >
                  Occupied
                </button>

              </div>

            </div>


            {/* LEGEND */}

            <div className="seat-legend">

              <div>
                <span className="legend-box available-box"></span>
                Available
              </div>

              <div>
                <span className="legend-box reserved-box"></span>
                Reserved
              </div>

              <div>
                <span className="legend-box occupied-box"></span>
                Occupied
              </div>

            </div>


            {/* SEAT GRID */}

            <div className="seat-grid-wrapper">

              {["A", "B", "C", "D"].map((row) => {

                const rowSeats = filteredSeats.filter(
                  (seat) => seat.row === row
                );

                return (
                  <div
                    className="seat-row"
                    key={row}
                  >

                    <div className="row-label">
                      <span>
                        ROW
                      </span>

                      <strong>
                        {row}
                      </strong>
                    </div>


                    <div className="seat-row-items">

                      {rowSeats.length > 0 ? (

                        rowSeats.map((seat) => (

                          <div
                            key={seat.id}
                            className={`seat-box ${getStatusClass(
                              seat.status
                            )}`}
                            onClick={() =>
                              handleSeatClick(seat)
                            }
                            title={`${seat.seatNumber} - ${seat.status}`}
                          >

                            <span className="seat-number">
                              {seat.seatNumber}
                            </span>

                            <span className="seat-status-dot"></span>

                          </div>

                        ))

                      ) : (

                        <div className="no-seat-row">
                          No seats found
                        </div>

                      )}

                    </div>

                  </div>
                );

              })}

            </div>


            {/* SEAT DETAILS TABLE */}

            <div className="seat-details-section">

              <div className="seat-details-header">

                <div>

                  <h3>
                    Seat Details
                  </h3>

                  <p>
                    Manage individual seat status.
                  </p>

                </div>

              </div>


              <div className="seat-details-table-wrapper">

                <table className="seat-details-table">

                  <thead>

                    <tr>

                      <th>
                        SEAT
                      </th>

                      <th>
                        SECTION
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

                    {filteredSeats
                      .slice(0, 12)
                      .map((seat) => (

                        <tr key={seat.id}>

                          <td>

                            <div className="seat-table-name">

                              <div
                                className={`mini-seat ${getStatusClass(
                                  seat.status
                                )}`}
                              >
                                💺
                              </div>

                              <strong>
                                Seat {seat.seatNumber}
                              </strong>

                            </div>

                          </td>


                          <td>
                            <span className="section-name">
                              {seat.section}
                            </span>
                          </td>


                          <td>

                            <span
                              className={`seat-status-badge ${getStatusClass(
                                seat.status
                              )}`}
                            >
                              <span></span>
                              {seat.status}
                            </span>

                          </td>


                          <td>

                            <button
                              className="change-status-btn"
                              onClick={() =>
                                handleChangeStatus(seat)
                              }
                            >
                              Change Status
                            </button>

                          </td>

                        </tr>

                      ))}

                  </tbody>

                </table>

              </div>

            </div>

          </section>


          {/* FOOTER */}

          <footer className="admin-seats-footer">

            <span>
              © 2026 LibraSpace. All Rights Reserved.
            </span>

            <span>
              Library Administration System
            </span>

          </footer>

        </div>

      </main>


      {/* =====================================
          ADD SEAT MODAL
      ====================================== */}

      {showAddModal && (

        <div
          className="seat-modal-overlay"
          onClick={() =>
            setShowAddModal(false)
          }
        >

          <div
            className="seat-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="seat-modal-header">

              <div className="modal-heading">

                <div className="modal-seat-icon">
                  💺
                </div>

                <div>

                  <h2>
                    Add New Seat
                  </h2>

                  <p>
                    Add a new seat to your library.
                  </p>

                </div>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ×
              </button>

            </div>


            <form
              className="add-seat-form"
              onSubmit={handleAddSeat}
            >

              <div className="seat-form-group">

                <label>
                  Seat Number *
                </label>

                <input
                  type="text"
                  placeholder="Example: E01"
                  value={newSeat.seatNumber}
                  onChange={(e) =>
                    setNewSeat({
                      ...newSeat,
                      seatNumber: e.target.value,
                    })
                  }
                />

                <small>
                  Use a unique seat number such as A26 or E01.
                </small>

              </div>


              <div className="seat-form-group">

                <label>
                  Library Section *
                </label>

                <select
                  value={newSeat.section}
                  onChange={(e) =>
                    setNewSeat({
                      ...newSeat,
                      section: e.target.value,
                    })
                  }
                >
                  <option>
                    Reading Hall
                  </option>

                  <option>
                    Reference Hall
                  </option>

                  <option>
                    Silent Zone
                  </option>

                  <option>
                    Computer Section
                  </option>
                </select>

              </div>


              <div className="seat-default-status">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Default Status
                  </strong>

                  <small>
                    New seats will be added as Available.
                  </small>

                </div>

              </div>


              <div className="modal-form-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit"
                >
                  ＋ Add Seat
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default AdminSeats;  