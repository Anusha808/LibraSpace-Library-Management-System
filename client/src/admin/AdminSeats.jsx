import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminSeats.css";

const API_BASE = "http://localhost:5000/api/admin/seats";

const EMPTY_SEAT = {
  seatNumber: "",
  section: "Reading Hall",
};

const sections = [
  "Reading Hall",
  "Reference Hall",
  "Silent Zone",
  "Computer Section",
];

function AdminSeats() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSection, setFilterSection] = useState("All");

  const [seats, setSeats] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSeat, setNewSeat] = useState(EMPTY_SEAT);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionSeatId, setActionSeatId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [adminName, setAdminName] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState("admin@libraspace.com");

  const [page, setPage] = useState(1);
  const pageSize = 20;

  const isActive = (path) =>
    location.pathname === path ? "admin-nav-link active" : "admin-nav-link";

  // ==========================================================
  // ADMIN DETAILS
  // ==========================================================

  useEffect(() => {
    try {
      const storedAdmin = localStorage.getItem("adminUser");

      if (storedAdmin) {
        const parsedAdmin = JSON.parse(storedAdmin);

        if (parsedAdmin.name) {
          setAdminName(parsedAdmin.name);
        }

        if (parsedAdmin.email) {
          setAdminEmail(parsedAdmin.email);
        }
      }
    } catch (error) {
      console.error("Unable to read administrator information:", error);
    }
  }, []);

  // ==========================================================
  // AUTH
  // ==========================================================

  const getAdminToken = () => {
    return localStorage.getItem("adminToken");
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  // ==========================================================
  // LOAD SEATS
  // ==========================================================

  const fetchSeats = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(API_BASE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load seats.");
      }

      setSeats(Array.isArray(data.seats) ? data.seats : []);
    } catch (error) {
      console.error("Seat loading error:", error);
      setError(
        error.message ||
          "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  // ==========================================================
  // STATISTICS
  // ==========================================================

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
    totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0;

  const reservedPercentage =
    totalSeats > 0 ? Math.round((reservedSeats / totalSeats) * 100) : 0;

  const filteredSeats = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return seats
      .filter((seat) => {
        const matchesSearch =
          !normalizedSearch ||
          seat.seatNumber?.toLowerCase().includes(normalizedSearch) ||
          seat.section?.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
          filterStatus === "All" || seat.status === filterStatus;

        const matchesSection =
          filterSection === "All" || seat.section === filterSection;

        return matchesSearch && matchesStatus && matchesSection;
      })
      .sort((a, b) => {
        const rowA = String(a.seatNumber || "").charAt(0);
        const rowB = String(b.seatNumber || "").charAt(0);

        if (rowA !== rowB) {
          return rowA.localeCompare(rowB);
        }

        return (
          parseInt(String(a.seatNumber || "").slice(1), 10) -
          parseInt(String(b.seatNumber || "").slice(1), 10)
        );
      });
  }, [seats, search, filterStatus, filterSection]);

  const totalPages = Math.max(1, Math.ceil(filteredSeats.length / pageSize));

  const visibleSeats = filteredSeats.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterSection]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  // ==========================================================
  // HELPERS
  // ==========================================================

  const getStatusClass = (status) => {
    if (status === "Available") {
      return "seat-available";
    }

    if (status === "Reserved") {
      return "seat-reserved";
    }

    return "seat-occupied";
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ==========================================================
  // SEAT ACTIONS
  // ==========================================================

  const handleSeatClick = (seat) => {
    if (seat.status === "Occupied") {
      alert(`Seat ${seat.seatNumber} is currently occupied.`);
      return;
    }

    if (seat.status === "Reserved") {
      alert(`Seat ${seat.seatNumber} is currently reserved.`);
      return;
    }

    alert(`Seat ${seat.seatNumber} is available.`);
  };

  const getNextStatus = (status) => {
    if (status === "Available") return "Reserved";
    if (status === "Reserved") return "Occupied";
    return "Available";
  };

  const handleChangeStatus = async (seat) => {
    const newStatus = getNextStatus(seat.status);

    const confirmed = window.confirm(
      `Change seat ${seat.seatNumber} from ${seat.status} to ${newStatus}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();
      setActionSeatId(seat._id);

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE}/${seat._id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update seat status.");
      }

      setSeats((currentSeats) =>
        currentSeats.map((item) =>
          item._id === seat._id ? data.seat : item
        )
      );

      setSuccess(
        `Seat ${seat.seatNumber} status changed to ${newStatus}.`
      );
    } catch (error) {
      console.error("Seat status update error:", error);
      setError(error.message || "Unable to update seat status.");
    } finally {
      setActionSeatId(null);
    }
  };

  const handleDeleteSeat = async (seat) => {
    const confirmed = window.confirm(
      `Delete seat ${seat.seatNumber}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      clearMessages();
      setActionSeatId(seat._id);

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE}/${seat._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete seat.");
      }

      setSeats((currentSeats) =>
        currentSeats.filter((item) => item._id !== seat._id)
      );

      setSuccess(`Seat ${seat.seatNumber} deleted successfully.`);
    } catch (error) {
      console.error("Seat delete error:", error);
      setError(error.message || "Unable to delete seat.");
    } finally {
      setActionSeatId(null);
    }
  };

  const handleAddSeat = async (event) => {
    event.preventDefault();

    const seatNumber = newSeat.seatNumber.trim().toUpperCase();

    if (!seatNumber) {
      setError("Please enter a seat number.");
      return;
    }

    if (!/^[A-Z]\d{1,3}$/.test(seatNumber)) {
      setError("Use a valid seat number such as A01, A26, or E01.");
      return;
    }

    try {
      clearMessages();
      setSaving(true);

      const token = getAdminToken();

      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seatNumber,
          section: newSeat.section,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to add seat.");
      }

      setSeats((currentSeats) => [...currentSeats, data.seat]);

      setNewSeat(EMPTY_SEAT);
      setShowAddModal(false);
      setSuccess(`Seat ${seatNumber} added successfully.`);
    } catch (error) {
      console.error("Add seat error:", error);
      setError(error.message || "Unable to add seat.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="admin-seats-page">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <div className="admin-logo-icon">📚</div>

            <div>
              <h2>LibraSpace</h2>
              <span>Admin Portal</span>
            </div>
          </div>
        </aside>

        <main className="admin-seats-main">
          <div
            className="admin-seats-content"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "70vh",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "42px", marginBottom: "14px" }}>💺</div>
              <h2>Loading Seat Management...</h2>
              <p>Fetching the latest seating information.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="admin-seats-page">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">📚</div>

          <div>
            <h2>LibraSpace</h2>
            <span>Admin Portal</span>
          </div>
        </div>

        <nav className="admin-navigation">
          <div className="admin-nav-section">
            <span className="admin-nav-title">MAIN</span>

            <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>
              <span className="nav-icon">▦</span>
              Dashboard
            </Link>

            <Link to="/admin/seats" className={isActive("/admin/seats")}>
              <span className="nav-icon">💺</span>
              Manage Seats
            </Link>

            <Link
              to="/admin/reservations"
              className={isActive("/admin/reservations")}
            >
              <span className="nav-icon">📅</span>
              Reservations
            </Link>
          </div>

          <div className="admin-nav-section">
            <span className="admin-nav-title">MANAGEMENT</span>

            <Link to="/admin/members" className={isActive("/admin/members")}>
              <span className="nav-icon">👥</span>
              Members
            </Link>

            <Link
              to="/admin/memberships"
              className={isActive("/admin/memberships")}
            >
              <span className="nav-icon">🎫</span>
              Memberships
            </Link>

            <Link to="/admin/payments" className={isActive("/admin/payments")}>
              <span className="nav-icon">₹</span>
              Payments
            </Link>

            <Link to="/admin/reports" className={isActive("/admin/reports")}>
              <span className="nav-icon">📊</span>
              Reports
            </Link>
          </div>

          <div className="admin-nav-section">
            <span className="admin-nav-title">SYSTEM</span>

            <Link to="/admin/settings" className={isActive("/admin/settings")}>
              <span className="nav-icon">⚙</span>
              Settings
            </Link>
          </div>
        </nav>

        <div className="admin-sidebar-bottom">
          <button
            type="button"
            className="admin-bottom-link logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="admin-seats-main">
        {/* TOPBAR */}
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="mobile-admin-logo">📚</div>

            <div>
              <span className="admin-page-label">ADMINISTRATION</span>
              <h3>Seat Management</h3>
            </div>
          </div>

          <div className="admin-topbar-right">
            <button
              type="button"
              className="admin-notification"
              title="Seat notifications"
              onClick={() =>
                alert(
                  `Current seat status: ${availableSeats} available, ${reservedSeats} reserved, ${occupiedSeats} occupied.`
                )
              }
            >
              🔔
              {reservedSeats > 0 && <span className="notification-dot"></span>}
            </button>

            <div className="admin-profile">
              <div className="admin-avatar">
                {adminName ? adminName.charAt(0).toUpperCase() : "A"}
              </div>

              <div className="admin-profile-info">
                <strong>{adminName}</strong>
                <span>{adminEmail}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-seats-content">
          {/* BREADCRUMB */}
          <div className="admin-breadcrumb">
            <Link to="/admin/dashboard">Dashboard</Link>
            <span>›</span>
            <span>Manage Seats</span>
          </div>

          {/* PAGE HEADER */}
          <div className="seats-page-header">
            <div>
              <span className="seats-eyebrow">💺 LIBRARY SEAT MANAGEMENT</span>

              <h1>Manage Seats</h1>

              <p>
                Monitor library seating capacity and manage seat availability
                from one place.
              </p>
            </div>

            <button
              type="button"
              className="add-seat-btn"
              onClick={() => {
                clearMessages();
                setNewSeat(EMPTY_SEAT);
                setShowAddModal(true);
              }}
            >
              <span>＋</span>
              Add New Seat
            </button>
          </div>

          {/* MESSAGES */}
          {error && (
            <div
              style={{
                marginBottom: "18px",
                padding: "13px 16px",
                borderRadius: "10px",
                background: "#fff1f1",
                color: "#a94442",
                border: "1px solid #f2cccc",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                marginBottom: "18px",
                padding: "13px 16px",
                borderRadius: "10px",
                background: "#effaf3",
                color: "#28734a",
                border: "1px solid #cbe8d6",
              }}
            >
              {success}
            </div>
          )}

          {/* STAT CARDS */}
          <section className="seat-stats-grid">
            <div className="seat-stat-card">
              <div className="seat-stat-icon total">💺</div>

              <div className="seat-stat-content">
                <span>Total Seats</span>
                <strong>{totalSeats}</strong>
                <small>Library capacity</small>
              </div>
            </div>

            <div className="seat-stat-card">
              <div className="seat-stat-icon available">✓</div>

              <div className="seat-stat-content">
                <span>Available</span>
                <strong>{availableSeats}</strong>
                <small>Ready for booking</small>
              </div>
            </div>

            <div className="seat-stat-card">
              <div className="seat-stat-icon reserved">📅</div>

              <div className="seat-stat-content">
                <span>Reserved</span>
                <strong>{reservedSeats}</strong>
                <small>
                  {reservedPercentage}% of total seats
                </small>
              </div>
            </div>

            <div className="seat-stat-card">
              <div className="seat-stat-icon occupied">👤</div>

              <div className="seat-stat-content">
                <span>Occupied</span>
                <strong>{occupiedSeats}</strong>
                <small>{occupiedPercentage}% currently in use</small>
              </div>
            </div>
          </section>

          {/* OCCUPANCY */}
          <section className="seat-overview">
            <div className="occupancy-card">
              <div className="overview-header">
                <div>
                  <h2>Seat Occupancy</h2>
                  <p>Current library seating status</p>
                </div>

                <span className="live-status">
                  <span></span>
                  Live Status
                </span>
              </div>

              <div className="occupancy-body">
                <div className="occupancy-circle">
                  <div className="circle-inner">
                    <strong>{occupiedPercentage}%</strong>
                    <span>Occupied</span>
                  </div>
                </div>

                <div className="occupancy-details">
                  <div className="occupancy-item">
                    <div className="occupancy-label">
                      <span className="legend-dot available-dot"></span>
                      <span>Available</span>
                    </div>

                    <strong>{availableSeats}</strong>
                  </div>

                  <div className="occupancy-item">
                    <div className="occupancy-label">
                      <span className="legend-dot reserved-dot"></span>
                      <span>Reserved</span>
                    </div>

                    <strong>{reservedSeats}</strong>
                  </div>

                  <div className="occupancy-item">
                    <div className="occupancy-label">
                      <span className="legend-dot occupied-dot"></span>
                      <span>Occupied</span>
                    </div>

                    <strong>{occupiedSeats}</strong>
                  </div>

                  <div className="occupancy-progress">
                    <div className="progress-label">
                      <span>Occupancy</span>
                      <strong>{occupiedPercentage}%</strong>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${occupiedPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="seat-info-card">
              <div className="seat-info-header">
                <div className="seat-info-icon">💡</div>

                <div>
                  <h3>Seat Information</h3>
                  <p>Library seating guidelines</p>
                </div>
              </div>

              <div className="seat-info-list">
                <div className="seat-info-row">
                  <span className="info-symbol available-symbol">✓</span>

                  <div>
                    <strong>Available</strong>
                    <small>Students can reserve this seat.</small>
                  </div>
                </div>

                <div className="seat-info-row">
                  <span className="info-symbol reserved-symbol">📅</span>

                  <div>
                    <strong>Reserved</strong>
                    <small>Seat has an upcoming reservation.</small>
                  </div>
                </div>

                <div className="seat-info-row">
                  <span className="info-symbol occupied-symbol">👤</span>

                  <div>
                    <strong>Occupied</strong>
                    <small>Seat is currently being used.</small>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SEAT MANAGEMENT */}
          <section className="seats-panel">
            <div className="seats-panel-header">
              <div>
                <h2>Library Seats</h2>
                <p>
                  Search, filter, update, add, and remove seats dynamically.
                </p>
              </div>

              <div className="seat-count-badge">
                {filteredSeats.length} Seats
              </div>
            </div>

            <div className="seats-toolbar">
              <div className="seat-search">
                <span>🔍</span>

                <input
                  type="text"
                  placeholder="Search seat or section..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <div className="seat-filter-buttons">
                {["All", "Available", "Reserved", "Occupied"].map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={
                      filterStatus === status
                        ? `seat-filter active ${
                            status === "Available"
                              ? "available-filter"
                              : status === "Reserved"
                              ? "reserved-filter"
                              : status === "Occupied"
                              ? "occupied-filter"
                              : ""
                          }`
                        : "seat-filter"
                    }
                    onClick={() => setFilterStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "18px",
              }}
            >
              <strong style={{ fontSize: "13px" }}>Section:</strong>

              <button
                type="button"
                className={
                  filterSection === "All"
                    ? "seat-filter active"
                    : "seat-filter"
                }
                onClick={() => setFilterSection("All")}
              >
                All
              </button>

              {sections.map((section) => (
                <button
                  type="button"
                  className={
                    filterSection === section
                      ? "seat-filter active"
                      : "seat-filter"
                  }
                  key={section}
                  onClick={() => setFilterSection(section)}
                >
                  {section}
                </button>
              ))}
            </div>

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
              {["A", "B", "C", "D", "E", "F", "G"].map((row) => {
                const rowSeats = visibleSeats.filter(
                  (seat) => seat.row === row
                );

                if (
                  rowSeats.length === 0 &&
                  search.trim() !== ""
                ) {
                  return null;
                }

                return (
                  <div className="seat-row" key={row}>
                    <div className="row-label">
                      <span>ROW</span>
                      <strong>{row}</strong>
                    </div>

                    <div className="seat-row-items">
                      {rowSeats.length > 0 ? (
                        rowSeats.map((seat) => (
                          <div
                            key={seat._id}
                            className={`seat-box ${getStatusClass(
                              seat.status
                            )}`}
                            onClick={() => handleSeatClick(seat)}
                            title={`${seat.seatNumber} - ${seat.status}`}
                          >
                            <span className="seat-number">
                              {seat.seatNumber}
                            </span>

                            <span className="seat-status-dot"></span>
                          </div>
                        ))
                      ) : (
                        <div className="no-seat-row">No seats found</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TABLE */}
            <div className="seat-details-section">
              <div className="seat-details-header">
                <div>
                  <h3>Seat Details</h3>
                  <p>Manage individual seat status and records.</p>
                </div>
              </div>

              <div className="seat-details-table-wrapper">
                <table className="seat-details-table">
                  <thead>
                    <tr>
                      <th>SEAT</th>
                      <th>SECTION</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleSeats.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          style={{
                            textAlign: "center",
                            padding: "30px",
                          }}
                        >
                          No seats found.
                        </td>
                      </tr>
                    ) : (
                      visibleSeats.map((seat) => (
                        <tr key={seat._id}>
                          <td>
                            <div className="seat-table-name">
                              <div
                                className={`mini-seat ${getStatusClass(
                                  seat.status
                                )}`}
                              >
                                💺
                              </div>

                              <strong>Seat {seat.seatNumber}</strong>
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
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                type="button"
                                className="change-status-btn"
                                disabled={actionSeatId === seat._id}
                                onClick={() => handleChangeStatus(seat)}
                              >
                                {actionSeatId === seat._id
                                  ? "Updating..."
                                  : "Change Status"}
                              </button>

                              <button
                                type="button"
                                className="change-status-btn"
                                disabled={actionSeatId === seat._id}
                                onClick={() => handleDeleteSeat(seat)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                marginTop: "18px",
                flexWrap: "wrap",
              }}
            >
              <span style={{ fontSize: "13px", color: "#66808B" }}>
                Showing{" "}
                {filteredSeats.length === 0
                  ? 0
                  : (page - 1) * pageSize + 1}{" "}
                -{" "}
                {Math.min(page * pageSize, filteredSeats.length)} of{" "}
                {filteredSeats.length}
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  className="seat-filter"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                >
                  ← Previous
                </button>

                <span style={{ fontSize: "13px", fontWeight: 700 }}>
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  className="seat-filter"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                >
                  Next →
                </button>
              </div>
            </div>
          </section>

          <footer className="admin-seats-footer">
            <span>© {new Date().getFullYear()} LibraSpace. All Rights Reserved.</span>
            <span>Library Administration System</span>
          </footer>
        </div>
      </main>

      {/* ADD SEAT MODAL */}
      {showAddModal && (
        <div
          className="seat-modal-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="seat-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="seat-modal-header">
              <div className="modal-heading">
                <div className="modal-seat-icon">💺</div>

                <div>
                  <h2>Add New Seat</h2>
                  <p>Add a new seat to your library.</p>
                </div>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>

            <form className="add-seat-form" onSubmit={handleAddSeat}>
              <div className="seat-form-group">
                <label>Seat Number *</label>

                <input
                  type="text"
                  placeholder="Example: E01"
                  value={newSeat.seatNumber}
                  onChange={(event) =>
                    setNewSeat((current) => ({
                      ...current,
                      seatNumber: event.target.value.toUpperCase(),
                    }))
                  }
                  required
                />

                <small>
                  Use a unique seat number such as A26 or E01.
                </small>
              </div>

              <div className="seat-form-group">
                <label>Library Section *</label>

                <select
                  value={newSeat.section}
                  onChange={(event) =>
                    setNewSeat((current) => ({
                      ...current,
                      section: event.target.value,
                    }))
                  }
                >
                  {sections.map((section) => (
                    <option value={section} key={section}>
                      {section}
                    </option>
                  ))}
                </select>
              </div>

              <div className="seat-default-status">
                <span>✓</span>

                <div>
                  <strong>Default Status</strong>

                  <small>
                    New seats will be added as Available.
                  </small>
                </div>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowAddModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-submit"
                  disabled={saving}
                >
                  {saving ? "Adding..." : "＋ Add Seat"}
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
