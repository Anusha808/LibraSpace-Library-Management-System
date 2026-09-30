import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminReservations.css";

const API_BASE = "http://localhost:5000/api/admin/reservations";

const STATUS_FILTERS = [
  "All",
  "Confirmed",
  "Pending",
  "Completed",
  "Cancelled",
];

function AdminReservations() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adminName, setAdminName] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState("admin@libraspace.com");

  const isActive = (path) =>
    location.pathname === path ? "admin-nav-link active" : "admin-nav-link";

  useEffect(() => {
    try {
      const stored = localStorage.getItem("adminUser");
      if (stored) {
        const user = JSON.parse(stored);
        setAdminName(user?.name || "Administrator");
        setAdminEmail(user?.email || "admin@libraspace.com");
      }
    } catch (err) {
      console.error("Unable to read admin details:", err);
    }
  }, []);

  const getToken = () => localStorage.getItem("adminToken");

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const handleUnauthorized = () => {
    logout();
  };

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
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
        throw new Error(data.message || "Unable to load reservations.");
      }

      setReservations(
        Array.isArray(data.reservations)
          ? data.reservations
          : Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error("Reservation loading error:", err);
      setError(
        err.message ||
          "Unable to connect to the reservation server."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const normalizeStatus = (status) => {
    const value = String(status || "confirmed").toLowerCase();
    if (value === "pending") return "Pending";
    if (value === "completed") return "Completed";
    if (value === "cancelled" || value === "canceled") return "Cancelled";
    return "Confirmed";
  };

  const memberName = (reservation) =>
    reservation.user?.name ||
    reservation.member?.name ||
    reservation.memberName ||
    "Library Member";

  const memberEmail = (reservation) =>
    reservation.user?.email ||
    reservation.member?.email ||
    reservation.email ||
    "—";

  const reservationId = (reservation, index = 0) =>
    reservation._id ||
    reservation.id ||
    `RES-${String(index + 1).padStart(3, "0")}`;

  const formatDate = (date) => {
    if (!date) return "—";
    const value = new Date(date.includes?.("T") ? date : `${date}T00:00:00`);
    if (Number.isNaN(value.getTime())) return String(date);
    return value.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    if (!time) return "—";
    const text = String(time);
    if (/AM|PM/i.test(text)) return text;
    const [hourText, minute = "00"] = text.split(":");
    let hour = Number(hourText);
    if (Number.isNaN(hour)) return text;
    const period = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${period}`;
  };

  const duration = (reservation) => {
    if (reservation.duration) {
      return typeof reservation.duration === "number"
        ? `${reservation.duration} Hours`
        : reservation.duration;
    }
    if (!reservation.startTime || !reservation.endTime) return "—";
    const toMinutes = (value) => {
      const [h, m] = String(value).split(":").map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    const diff = toMinutes(reservation.endTime) - toMinutes(reservation.startTime);
    return diff > 0 ? `${diff / 60} Hours` : "—";
  };

  const statusClass = (status) => {
    switch (normalizeStatus(status)) {
      case "Confirmed": return "reservation-confirmed";
      case "Pending": return "reservation-pending";
      case "Completed": return "reservation-completed";
      case "Cancelled": return "reservation-cancelled";
      default: return "";
    }
  };

  const totalReservations = reservations.length;
  const confirmedReservations = reservations.filter((r) => normalizeStatus(r.status) === "Confirmed").length;
  const pendingReservations = reservations.filter((r) => normalizeStatus(r.status) === "Pending").length;
  const completedReservations = reservations.filter((r) => normalizeStatus(r.status) === "Completed").length;
  const cancelledReservations = reservations.filter((r) => normalizeStatus(r.status) === "Cancelled").length;

  const filteredReservations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reservations.filter((reservation, index) => {
      const id = reservationId(reservation, index).toLowerCase();
      const name = memberName(reservation).toLowerCase();
      const email = memberEmail(reservation).toLowerCase();
      const seat = String(reservation.seatNumber || reservation.seat || "").toLowerCase();
      const purpose = String(reservation.purpose || "").toLowerCase();
      const matchesSearch =
        !query || id.includes(query) || name.includes(query) || email.includes(query) || seat.includes(query) || purpose.includes(query);
      const matchesStatus =
        filterStatus === "All" || normalizeStatus(reservation.status) === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, filterStatus]);

  const viewReservation = (reservation, index) => {
    setSelectedReservation({
      ...reservation,
      displayId: reservationId(reservation, index),
    });
    setShowDetails(true);
  };

  const updateStatus = async (reservation, newStatus) => {
    const id = reservation._id || reservation.id;
    if (!id) {
      setError("Reservation ID is missing.");
      return;
    }

    const oldStatus = normalizeStatus(reservation.status);
    if (newStatus === "Confirmed" && oldStatus !== "Pending") {
      alert("Only pending reservations can be confirmed.");
      return;
    }
    if (newStatus === "Cancelled" && oldStatus === "Completed") {
      alert("Completed reservations cannot be cancelled.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setActionId(id);

      const token = getToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE}/${id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus.toLowerCase() }),
      });

      if (response.status === 401 || response.status === 403) {
        handleUnauthorized();
        return;
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Unable to update reservation.");
      }

      const updated = data.reservation || { ...reservation, status: newStatus.toLowerCase() };
      setReservations((current) =>
        current.map((item) =>
          (item._id || item.id) === id ? updated : item
        )
      );
      setSelectedReservation((current) =>
        current && (current._id || current.id) === id
          ? { ...updated, displayId: current.displayId }
          : current
      );
      setSuccess(`${reservationId(reservation)} updated to ${newStatus}.`);
    } catch (err) {
      console.error("Reservation status update error:", err);
      setError(err.message || "Unable to update reservation.");
    } finally {
      setActionId(null);
    }
  };

  const deleteReservation = async (reservation, index) => {
    const id = reservation._id || reservation.id;
    if (!id) {
      setError("Reservation ID is missing.");
      return;
    }

    const displayId = reservationId(reservation, index);
    if (!window.confirm(`Delete ${displayId}? This action cannot be undone.`)) return;

    try {
      setError("");
      setSuccess("");
      setActionId(id);

      const token = getToken();
      if (!token) {
        handleUnauthorized();
        return;
      }

      const response = await fetch(`${API_BASE}/${id}`, {
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
        throw new Error(data.message || "Unable to delete reservation.");
      }

      setReservations((current) =>
        current.filter((item) => (item._id || item.id) !== id)
      );
      setSelectedReservation(null);
      setShowDetails(false);
      setSuccess(`${displayId} deleted successfully.`);
    } catch (err) {
      console.error("Reservation delete error:", err);
      setError(err.message || "Unable to delete reservation.");
    } finally {
      setActionId(null);
    }
  };

  const logoutAdmin = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    logout();
  };

  if (loading) {
    return (
      <div className="admin-reservations-page">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-logo">
            <div className="admin-logo-icon">📚</div>
            <div><h2>LibraSpace</h2><span>Admin Portal</span></div>
          </div>
        </aside>
        <main className="admin-reservations-main">
          <div className="admin-reservations-content" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "70vh" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "42px", marginBottom: "14px" }}>📅</div>
              <h2>Loading Reservations...</h2>
              <p>Fetching the latest reservation records.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-reservations-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="admin-logo-icon">📚</div>
          <div><h2>LibraSpace</h2><span>Admin Portal</span></div>
        </div>

        <nav className="admin-navigation">
          <div className="admin-nav-section">
            <span className="admin-nav-title">MAIN</span>
            <Link to="/admin/dashboard" className={isActive("/admin/dashboard")}><span className="nav-icon">▦</span>Dashboard</Link>
            <Link to="/admin/seats" className={isActive("/admin/seats")}><span className="nav-icon">💺</span>Manage Seats</Link>
            <Link to="/admin/reservations" className={isActive("/admin/reservations")}><span className="nav-icon">📅</span>Reservations</Link>
          </div>

          <div className="admin-nav-section">
            <span className="admin-nav-title">MANAGEMENT</span>
            <Link to="/admin/members" className={isActive("/admin/members")}><span className="nav-icon">👥</span>Members</Link>
            <Link to="/admin/memberships" className={isActive("/admin/memberships")}><span className="nav-icon">🎫</span>Memberships</Link>
            <Link to="/admin/payments" className={isActive("/admin/payments")}><span className="nav-icon">₹</span>Payments</Link>
            <Link to="/admin/reports" className={isActive("/admin/reports")}><span className="nav-icon">📊</span>Reports</Link>
          </div>

          <div className="admin-nav-section">
            <span className="admin-nav-title">SYSTEM</span>
            <Link to="/admin/settings" className={isActive("/admin/settings")}><span className="nav-icon">⚙</span>Settings</Link>
          </div>
        </nav>

        <div className="admin-sidebar-bottom">
          <button type="button" className="admin-bottom-link logout" onClick={logoutAdmin}><span>↪</span>Logout</button>
        </div>
      </aside>

      <main className="admin-reservations-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="mobile-admin-logo">📚</div>
            <div><span className="admin-page-label">ADMINISTRATION</span><h3>Reservation Management</h3></div>
          </div>
          <div className="admin-topbar-right">
            <button type="button" className="admin-notification" onClick={() => alert(`Pending reservations: ${pendingReservations}`)}>🔔{pendingReservations > 0 && <span className="notification-dot"></span>}</button>
            <div className="admin-profile">
              <div className="admin-avatar">{adminName.charAt(0).toUpperCase()}</div>
              <div className="admin-profile-info"><strong>{adminName}</strong><span>{adminEmail}</span></div>
            </div>
          </div>
        </header>

        <div className="admin-reservations-content">
          <div className="admin-breadcrumb"><Link to="/admin/dashboard">Dashboard</Link><span>›</span><span>Reservations</span></div>

          <div className="reservations-page-header">
            <div>
              <span className="reservations-eyebrow">📅 RESERVATION MANAGEMENT</span>
              <h1>Manage Reservations</h1>
              <p>Monitor, confirm and manage all library seat reservations.</p>
            </div>
          </div>

          {error && <div style={{ marginBottom: "18px", padding: "13px 16px", borderRadius: "10px", background: "#fff1f1", color: "#a94442", border: "1px solid #f2cccc" }}>{error}</div>}
          {success && <div style={{ marginBottom: "18px", padding: "13px 16px", borderRadius: "10px", background: "#effaf3", color: "#28734a", border: "1px solid #cbe8d6" }}>{success}</div>}

          <section className="reservation-stats-grid">
            <div className="reservation-stat-card"><div className="reservation-stat-icon total">📅</div><div><span>Total Reservations</span><strong>{totalReservations}</strong><small>All reservations</small></div></div>
            <div className="reservation-stat-card"><div className="reservation-stat-icon confirmed">✓</div><div><span>Confirmed</span><strong>{confirmedReservations}</strong><small>Active bookings</small></div></div>
            <div className="reservation-stat-card"><div className="reservation-stat-icon pending">⏳</div><div><span>Pending</span><strong>{pendingReservations}</strong><small>Need attention</small></div></div>
            <div className="reservation-stat-card"><div className="reservation-stat-icon completed">✓</div><div><span>Completed</span><strong>{completedReservations}</strong><small>Finished bookings</small></div></div>
          </section>

          <section className="reservation-summary">
            <div className="summary-card">
              <div className="summary-card-header"><div><h3>Reservation Overview</h3><p>Current reservation activity</p></div><span className="summary-live"><span></span>Live</span></div>
              <div className="summary-content">
                <div className="summary-progress"><div className="summary-progress-circle"><div><strong>{totalReservations}</strong><span>Total</span></div></div></div>
                <div className="summary-breakdown">
                  <div className="summary-item"><div><span className="summary-dot confirmed-dot"></span>Confirmed</div><strong>{confirmedReservations}</strong></div>
                  <div className="summary-item"><div><span className="summary-dot pending-dot"></span>Pending</div><strong>{pendingReservations}</strong></div>
                  <div className="summary-item"><div><span className="summary-dot completed-dot"></span>Completed</div><strong>{completedReservations}</strong></div>
                  <div className="summary-item"><div><span className="summary-dot cancelled-dot"></span>Cancelled</div><strong>{cancelledReservations}</strong></div>
                </div>
              </div>
            </div>
            <div className="reservation-tip"><div className="tip-icon">💡</div><div><h3>Reservation Tip</h3><p>Review pending reservations regularly and keep seat availability synchronized with reservation activity.</p></div></div>
          </section>

          <section className="reservations-panel">
            <div className="reservations-panel-header"><div><h2>All Reservations</h2><p>View and manage database reservation records.</p></div><span className="reservation-count">{filteredReservations.length} Records</span></div>

            <div className="reservation-toolbar">
              <div className="reservation-search"><span>🔍</span><input type="text" placeholder="Search reservation, member or seat..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
              <div className="reservation-filter"><span>Filter:</span><select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>{STATUS_FILTERS.map((status) => <option value={status} key={status}>{status === "All" ? "All Status" : status}</option>)}</select></div>
            </div>

            <div className="reservations-table-wrapper">
              <table className="reservations-table">
                <thead><tr><th>RESERVATION</th><th>MEMBER</th><th>SEAT</th><th>DATE</th><th>TIME</th><th>STATUS</th><th>ACTION</th></tr></thead>
                <tbody>
                  {filteredReservations.length > 0 ? filteredReservations.map((reservation, index) => {
                    const id = reservationId(reservation, index);
                    const name = memberName(reservation);
                    const email = memberEmail(reservation);
                    const seat = reservation.seatNumber || reservation.seat || "—";
                    const status = normalizeStatus(reservation.status);
                    const loadingAction = actionId === (reservation._id || reservation.id);
                    return (
                      <tr key={reservation._id || reservation.id || index}>
                        <td><div className="reservation-id"><div className="reservation-id-icon">📅</div><div><strong>{id}</strong><span>{duration(reservation)}</span></div></div></td>
                        <td><div className="member-cell"><div className="member-avatar">{name.charAt(0).toUpperCase()}</div><div><strong>{name}</strong><span>{email}</span></div></div></td>
                        <td><span className="seat-number-badge">💺 {seat}</span></td>
                        <td><span className="reservation-date">{formatDate(reservation.reservationDate)}</span></td>
                        <td><div className="reservation-time"><strong>{formatTime(reservation.startTime)}</strong><span>to</span><strong>{formatTime(reservation.endTime)}</strong></div></td>
                        <td><span className={`reservation-status ${statusClass(status)}`}><span></span>{status}</span></td>
                        <td>
                          <div className="reservation-actions">
                            <button type="button" className="view-reservation-btn" onClick={() => viewReservation(reservation, index)}>View</button>
                            {status === "Pending" && <button type="button" className="confirm-reservation-btn" disabled={loadingAction} onClick={() => updateStatus(reservation, "Confirmed")}>{loadingAction ? "..." : "Confirm"}</button>}
                            {status === "Confirmed" && <button type="button" className="confirm-reservation-btn" disabled={loadingAction} onClick={() => updateStatus(reservation, "Completed")}>{loadingAction ? "..." : "Complete"}</button>}
                            {status !== "Completed" && status !== "Cancelled" && <button type="button" className="cancel-reservation-btn" disabled={loadingAction} onClick={() => updateStatus(reservation, "Cancelled")}>Cancel</button>}
                            <button type="button" className="cancel-reservation-btn" disabled={loadingAction} onClick={() => deleteReservation(reservation, index)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="7" className="no-reservations"><div className="no-reservations-content"><span>🔍</span><strong>No reservations found</strong><p>Try changing your search or filter.</p></div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="reservation-guidelines">
            <div className="guideline-header"><div className="guideline-icon">📌</div><div><h2>Reservation Guidelines</h2><p>Important information for administrators.</p></div></div>
            <div className="guideline-grid">
              <div className="guideline-item"><span>01</span><div><strong>Confirm Pending Bookings</strong><p>Review pending reservations and confirm valid requests.</p></div></div>
              <div className="guideline-item"><span>02</span><div><strong>Avoid Double Booking</strong><p>Ensure the same seat is not assigned to multiple members at the same time.</p></div></div>
              <div className="guideline-item"><span>03</span><div><strong>Complete Finished Sessions</strong><p>Mark completed reservations after the student's session.</p></div></div>
            </div>
          </section>

          <footer className="admin-reservations-footer"><span>© {new Date().getFullYear()} LibraSpace. All Rights Reserved.</span><span>Library Administration System</span></footer>
        </div>
      </main>

      {showDetails && selectedReservation && (
        <div className="reservation-modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reservation-modal-header">
              <div className="modal-reservation-heading"><div className="modal-reservation-icon">📅</div><div><span>RESERVATION DETAILS</span><h2>{selectedReservation.displayId}</h2></div></div>
              <button type="button" className="reservation-modal-close" onClick={() => setShowDetails(false)}>×</button>
            </div>
            <div className="reservation-modal-body">
              <div className="modal-status-row"><span>Current Status</span><span className={`reservation-status ${statusClass(selectedReservation.status)}`}><span></span>{normalizeStatus(selectedReservation.status)}</span></div>
              <div className="modal-member-card"><div className="modal-member-avatar">{memberName(selectedReservation).charAt(0).toUpperCase()}</div><div><strong>{memberName(selectedReservation)}</strong><span>{memberEmail(selectedReservation)}</span></div></div>
              <div className="modal-details-grid">
                <div className="modal-detail"><span>SEAT</span><strong>💺 {selectedReservation.seatNumber || selectedReservation.seat || "—"}</strong></div>
                <div className="modal-detail"><span>DATE</span><strong>📅 {formatDate(selectedReservation.reservationDate)}</strong></div>
                <div className="modal-detail"><span>START TIME</span><strong>🕐 {formatTime(selectedReservation.startTime)}</strong></div>
                <div className="modal-detail"><span>END TIME</span><strong>🕐 {formatTime(selectedReservation.endTime)}</strong></div>
                <div className="modal-detail"><span>DURATION</span><strong>⏱ {duration(selectedReservation)}</strong></div>
                <div className="modal-detail"><span>PURPOSE</span><strong>{selectedReservation.purpose || "Library Study Session"}</strong></div>
              </div>
              <div className="modal-actions">
                {normalizeStatus(selectedReservation.status) === "Pending" && <button type="button" className="modal-confirm-btn" onClick={async () => { await updateStatus(selectedReservation, "Confirmed"); setShowDetails(false); }}>✓ Confirm Reservation</button>}
                {normalizeStatus(selectedReservation.status) === "Confirmed" && <button type="button" className="modal-confirm-btn" onClick={async () => { await updateStatus(selectedReservation, "Completed"); setShowDetails(false); }}>✓ Complete Reservation</button>}
                {normalizeStatus(selectedReservation.status) !== "Completed" && normalizeStatus(selectedReservation.status) !== "Cancelled" && <button type="button" className="modal-cancel-btn" onClick={async () => { await updateStatus(selectedReservation, "Cancelled"); setShowDetails(false); }}>Cancel Reservation</button>}
                <button type="button" className="modal-close-btn" onClick={() => setShowDetails(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReservations;
