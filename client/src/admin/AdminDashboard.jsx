import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // SIDEBAR
  // =====================================================

  const navigationSections = [
    {
      title: "MAIN",
      items: [
        {
          name: "Dashboard",
          path: "/admin/dashboard",
          icon: "▦",
        },
        {
          name: "Seat Management",
          path: "/admin/seats",
          icon: "▤",
        },
        {
          name: "Reservations",
          path: "/admin/reservations",
          icon: "◫",
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          name: "Members",
          path: "/admin/members",
          icon: "♙",
        },
        {
          name: "Memberships",
          path: "/admin/memberships",
          icon: "▣",
        },
        {
          name: "Payments",
          path: "/admin/payments",
          icon: "₹",
        },
      ],
    },
    {
      title: "REPORTS & SETTINGS",
      items: [
        {
          name: "Reports",
          path: "/admin/reports",
          icon: "◩",
        },
        {
          name: "Settings",
          path: "/admin/settings",
          icon: "⚙",
        },
      ],
    },
  ];

  // =====================================================
  // FETCH DASHBOARD
  // =====================================================

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("adminToken") ||
          localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {},
          }
        );

        if (!response.ok) {
          throw new Error("Unable to load dashboard");
        }

        const data = await response.json();

        setDashboardData(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard information.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // =====================================================
  // HELPERS
  // =====================================================

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "—";

    if (
      typeof value === "string" &&
      (
        value.includes("AM") ||
        value.includes("PM") ||
        /^\d{1,2}:\d{2}$/.test(value)
      )
    ) {
      return value;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReservationDate = (reservation) => {
    return (
      reservation.date ||
      reservation.reservationDate ||
      reservation.bookingDate ||
      reservation.createdAt ||
      reservation.updatedAt
    );
  };

  const getReservationTime = (reservation) => {
    return (
      reservation.time ||
      reservation.startTime ||
      reservation.reservationTime ||
      reservation.bookingTime
    );
  };

  const getStatusClass = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value.includes("completed") ||
      value.includes("paid") ||
      value.includes("active") ||
      value.includes("confirmed")
    ) {
      return "status-success";
    }

    if (
      value.includes("pending") ||
      value.includes("processing")
    ) {
      return "status-warning";
    }

    if (
      value.includes("cancel") ||
      value.includes("failed") ||
      value.includes("reject")
    ) {
      return "status-danger";
    }

    return "status-neutral";
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");
  };

  // =====================================================
  // DATA
  // =====================================================

  const stats =
    dashboardData?.stats ||
    dashboardData?.statistics ||
    {};

  const totalSeats =
    stats.totalSeats ??
    dashboardData?.totalSeats ??
    0;

  const occupiedSeats =
    stats.occupiedSeats ??
    dashboardData?.occupiedSeats ??
    0;

  const availableSeats =
    stats.availableSeats ??
    dashboardData?.availableSeats ??
    Math.max(totalSeats - occupiedSeats, 0);

  const totalMembers =
    stats.totalMembers ??
    stats.totalUsers ??
    dashboardData?.totalMembers ??
    0;

  const activeMemberships =
    stats.activeMemberships ??
    dashboardData?.activeMemberships ??
    0;

  const totalReservations =
    stats.totalReservations ??
    dashboardData?.totalReservations ??
    0;

  const totalRevenue =
    stats.totalRevenue ??
    dashboardData?.totalRevenue ??
    0;

  const recentReservations =
    dashboardData?.recentReservations ||
    dashboardData?.recentBookings ||
    dashboardData?.reservations ||
    [];

  const occupancyPercentage =
    totalSeats > 0
      ? Math.round(
          (occupiedSeats / totalSeats) * 100
        )
      : 0;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>

        <p>
          Loading dashboard
          <span className="loading-dots">
            ...
          </span>
        </p>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="admin-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">

        <div className="sidebar-brand">

          <div className="sidebar-brand-text">
            <h1>LibraSpace</h1>
            <span>ADMIN PORTAL</span>
          </div>

        </div>

        <div className="sidebar-divider"></div>

        <nav className="sidebar-navigation">

          {navigationSections.map(
            (section, sectionIndex) => (
              <div
                className="sidebar-section"
                key={section.title}
                style={{
                  animationDelay:
                    `${sectionIndex * 0.08}s`,
                }}
              >

                <div className="sidebar-section-title">
                  {section.title}
                </div>

                <div className="sidebar-section-items">

                  {section.items.map(
                    (item, itemIndex) => {

                      const isActive =
                        location.pathname ===
                        item.path;

                      return (
                        <Link
                          to={item.path}
                          key={item.path}
                          className={`sidebar-link ${
                            isActive
                              ? "active"
                              : ""
                          }`}
                          style={{
                            animationDelay:
                              `${
                                sectionIndex * 0.08 +
                                itemIndex * 0.04
                              }s`,
                          }}
                        >

                          <span className="sidebar-icon">
                            {item.icon}
                          </span>

                          <span className="sidebar-link-text">
                            {item.name}
                          </span>

                          {isActive && (
                            <span className="sidebar-active-bar"></span>
                          )}

                        </Link>
                      );
                    }
                  )}

                </div>

              </div>
            )
          )}

        </nav>

        <div className="sidebar-bottom">

          <div className="admin-profile-mini">

            <div className="admin-avatar">
              A
            </div>

            <div className="admin-profile-info">
              <strong>
                Administrator
              </strong>

              <span>
                Admin Account
              </span>
            </div>

          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <span className="logout-icon">
              ↪
            </span>

            Logout
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <div>

            <p className="topbar-label">
              ADMINISTRATION
            </p>

            <h2>
              Dashboard
            </h2>

          </div>

          <div className="topbar-right">

            <button
              className="notification-button"
            >
              <span>
                ♢
              </span>

              <i></i>
            </button>

            <div className="topbar-profile">

              <div className="topbar-avatar">
                A
              </div>

              <div>
                <strong>
                  Administrator
                </strong>

                <span>
                  Admin
                </span>
              </div>

            </div>

          </div>

        </header>

        <div className="admin-content">

          {/* =================================================
              WELCOME
          ================================================= */}

          <section className="welcome-section">

            <div>

              <p className="welcome-small">
                Welcome back
              </p>

              <h1>
                Library Overview
              </h1>

              <p className="welcome-description">
                Monitor your library operations,
                reservations and memberships from
                one place.
              </p>

            </div>

            <div className="welcome-date">

              <span>
                Today
              </span>

              <strong>
                {new Date().toLocaleDateString(
                  "en-IN",
                  {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </strong>

            </div>

          </section>

          {error && (
            <div className="dashboard-error">
              <span>!</span>
              {error}
            </div>
          )}

          {/* =================================================
              STAT CARDS
          ================================================= */}

          <section className="stats-grid">

            {/* TOTAL SEATS */}

            <div className="stat-card blue-card">

              <div className="stat-card-glow"></div>

              <div className="stat-card-top">

                <div className="stat-icon blue">
                  ◉
                </div>

                <span className="stat-label">
                  TOTAL SEATS
                </span>

              </div>

              <div className="stat-value">
                {totalSeats}
              </div>

              <div className="stat-footer">

                <span className="stat-positive">
                  {availableSeats}
                </span>

                <span>
                  available now
                </span>

              </div>

            </div>

            {/* MEMBERS */}

            <div className="stat-card orange-card">

              <div className="stat-card-glow"></div>

              <div className="stat-card-top">

                <div className="stat-icon orange">
                  ♙
                </div>

                <span className="stat-label">
                  MEMBERS
                </span>

              </div>

              <div className="stat-value">
                {totalMembers}
              </div>

              <div className="stat-footer">

                <span className="stat-positive">
                  {activeMemberships}
                </span>

                <span>
                  active memberships
                </span>

              </div>

            </div>

            {/* RESERVATIONS */}

            <div className="stat-card purple-card">

              <div className="stat-card-glow"></div>

              <div className="stat-card-top">

                <div className="stat-icon purple">
                  ◫
                </div>

                <span className="stat-label">
                  RESERVATIONS
                </span>

              </div>

              <div className="stat-value">
                {totalReservations}
              </div>

              <div className="stat-footer">

                <span>
                  All reservations
                </span>

              </div>

            </div>

            {/* REVENUE */}

            <div className="stat-card green-card">

              <div className="stat-card-glow"></div>

              <div className="stat-card-top">

                <div className="stat-icon green">
                  ₹
                </div>

                <span className="stat-label">
                  REVENUE
                </span>

              </div>

              <div className="stat-value revenue">
                {formatCurrency(totalRevenue)}
              </div>

              <div className="stat-footer">

                <span>
                  Overall collection
                </span>

              </div>

            </div>

          </section>

          {/* =================================================
              OCCUPANCY + MEMBERSHIP
          ================================================= */}

          <section className="dashboard-grid">

            {/* SEAT OCCUPANCY */}

            <div className="dashboard-card occupancy-card">

              <div className="card-color-line blue-line"></div>

              <div className="card-header">

                <div>

                  <p className="card-overline">
                    LIBRARY STATUS
                  </p>

                  <h3>
                    Seat Occupancy
                  </h3>

                </div>

                <button className="card-more">
                  •••
                </button>

              </div>

              <div className="occupancy-content">

                <div
                  className="occupancy-ring"
                  style={{
                    "--occupancy":
                      `${occupancyPercentage}%`,
                  }}
                >

                  <div className="occupancy-ring-inner">

                    <strong>
                      {occupancyPercentage}%
                    </strong>

                    <span>
                      occupied
                    </span>

                  </div>

                </div>

                <div className="occupancy-details">

                  <div className="occupancy-stat">

                    <span className="occupancy-dot occupied"></span>

                    <div>

                      <strong>
                        {occupiedSeats}
                      </strong>

                      <span>
                        Occupied seats
                      </span>

                    </div>

                  </div>

                  <div className="occupancy-stat">

                    <span className="occupancy-dot available"></span>

                    <div>

                      <strong>
                        {availableSeats}
                      </strong>

                      <span>
                        Available seats
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              <div className="occupancy-progress">

                <div
                  className="occupancy-progress-bar"
                  style={{
                    width:
                      `${Math.min(
                        Math.max(
                          occupancyPercentage,
                          0
                        ),
                        100
                      )}%`,
                  }}
                ></div>

              </div>

              <p className="occupancy-note">
                Current library seat utilization
              </p>

            </div>

            {/* MEMBERSHIP */}

            <div className="dashboard-card membership-card">

              <div className="card-color-line orange-line"></div>

              <div className="card-header">

                <div>

                  <p className="card-overline">
                    MEMBERSHIP
                  </p>

                  <h3>
                    Membership Overview
                  </h3>

                </div>

                <Link
                  to="/admin/memberships"
                  className="view-link"
                >
                  View all
                </Link>

              </div>

              <div className="membership-main">

                <div className="membership-number">
                  {activeMemberships}
                </div>

                <div className="membership-label">
                  Active Memberships
                </div>

              </div>

              <div className="membership-bars">

                <div className="membership-bar-row">

                  <div>
                    <span>
                      Active
                    </span>

                    <strong>
                      {activeMemberships}
                    </strong>
                  </div>

                  <div className="mini-bar">

                    <span
                      className="orange-progress"
                      style={{
                        width:
                          activeMemberships
                            ? "78%"
                            : "0%",
                      }}
                    ></span>

                  </div>

                </div>

                <div className="membership-bar-row">

                  <div>

                    <span>
                      Total Members
                    </span>

                    <strong>
                      {totalMembers}
                    </strong>

                  </div>

                  <div className="mini-bar">

                    <span
                      className="purple-progress"
                      style={{
                        width:
                          totalMembers
                            ? "92%"
                            : "0%",
                      }}
                    ></span>

                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              RECENT RESERVATIONS
          ================================================= */}

          <section className="dashboard-card reservations-card">

            <div className="card-color-line purple-line"></div>

            <div className="card-header">

              <div>

                <p className="card-overline">
                  ACTIVITY
                </p>

                <h3>
                  Recent Reservations
                </h3>

              </div>

              <Link
                to="/admin/reservations"
                className="view-link"
              >
                View all reservations →
              </Link>

            </div>

            {recentReservations.length > 0 ? (
              <div className="table-wrapper">

                <table className="reservations-table">

                  <thead>

                    <tr>
                      <th>MEMBER</th>
                      <th>SEAT</th>
                      <th>DATE</th>
                      <th>TIME</th>
                      <th>STATUS</th>
                    </tr>

                  </thead>

                  <tbody>

                    {recentReservations
                      .slice(0, 6)
                      .map(
                        (
                          reservation,
                          index
                        ) => {

                          const memberName =
                            reservation.user?.name ||
                            reservation.member?.name ||
                            reservation.userName ||
                            reservation.customerName ||
                            "Member";

                          const seatNumber =
                            reservation.seat?.seatNumber ||
                            reservation.seatNumber ||
                            reservation.seat?.number ||
                            "—";

                          const dateValue =
                            getReservationDate(
                              reservation
                            );

                          const timeValue =
                            getReservationTime(
                              reservation
                            );

                          const status =
                            reservation.status ||
                            "Pending";

                          return (
                            <tr
                              key={
                                reservation._id ||
                                reservation.id ||
                                index
                              }
                            >

                              <td>

                                <div className="member-cell">

                                  <div className="member-avatar">
                                    {memberName
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>

                                  <div>

                                    <strong>
                                      {memberName}
                                    </strong>

                                    <span>
                                      Library Member
                                    </span>

                                  </div>

                                </div>

                              </td>

                              <td>

                                <span className="seat-number">
                                  {seatNumber}
                                </span>

                              </td>

                              <td>
                                {formatDate(
                                  dateValue
                                )}
                              </td>

                              <td>
                                {formatTime(
                                  timeValue
                                )}
                              </td>

                              <td>

                                <span
                                  className={`status-badge ${getStatusClass(
                                    status
                                  )}`}
                                >
                                  <span className="status-dot"></span>

                                  {status}
                                </span>

                              </td>

                            </tr>
                          );
                        }
                      )}

                  </tbody>

                </table>

              </div>
            ) : (
              <div className="empty-state">

                <div className="empty-icon">
                  ◫
                </div>

                <h4>
                  No recent reservations
                </h4>

                <p>
                  New reservations will appear here.
                </p>

              </div>
            )}

          </section>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <section className="quick-actions-section">

            <div className="section-heading">

              <div>

                <p className="card-overline">
                  SHORTCUTS
                </p>

                <h3>
                  Quick Actions
                </h3>

              </div>

            </div>

            <div className="quick-actions-grid">

              <Link
                to="/admin/seats"
                className="quick-action blue-action"
              >

                <div className="quick-action-icon blue">
                  ▤
                </div>

                <div>
                  <strong>
                    Manage Seats
                  </strong>

                  <span>
                    Add or update library seats
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </Link>

              <Link
                to="/admin/members"
                className="quick-action orange-action"
              >

                <div className="quick-action-icon orange">
                  ♙
                </div>

                <div>
                  <strong>
                    Manage Members
                  </strong>

                  <span>
                    View registered members
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </Link>

              <Link
                to="/admin/payments"
                className="quick-action green-action"
              >

                <div className="quick-action-icon green">
                  ₹
                </div>

                <div>
                  <strong>
                    View Payments
                  </strong>

                  <span>
                    Track membership payments
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </Link>

              <Link
                to="/admin/reports"
                className="quick-action purple-action"
              >

                <div className="quick-action-icon purple">
                  ◩
                </div>

                <div>
                  <strong>
                    View Reports
                  </strong>

                  <span>
                    Analyze library activity
                  </span>
                </div>

                <span className="quick-arrow">
                  →
                </span>

              </Link>

            </div>

          </section>

          <footer className="admin-footer">

            <span>
              © {new Date().getFullYear()} LibraSpace
            </span>

            <span>
              Library Administration System
            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;