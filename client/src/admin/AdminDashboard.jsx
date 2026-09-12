import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    navigate("/admin/login");
  };

  return (
    <div className="admin-dashboard">

      {/* =========================
          SIDEBAR
      ========================== */}
      <aside className="admin-sidebar">

        {/* Logo */}
        <div className="admin-sidebar-logo">

          <Link to="/">
            <span className="admin-logo-icon">
              📚
            </span>

            <div>
              <strong>LibraSpace</strong>
              <small>Admin Portal</small>
            </div>
          </Link>

        </div>


        {/* Navigation */}
        <nav className="admin-navigation">

          <p className="admin-nav-title">
            MAIN MENU
          </p>

          <Link
            to="/admin/dashboard"
            className={`admin-nav-link ${isActive("/admin/dashboard")}`}
          >
            <span>📊</span>
            Dashboard
          </Link>

          <Link
            to="/admin/books"
            className={`admin-nav-link ${isActive("/admin/books")}`}
          >
            <span>📚</span>
            Manage Books
          </Link>

          <Link
            to="/admin/seats"
            className={`admin-nav-link ${isActive("/admin/seats")}`}
          >
            <span>💺</span>
            Manage Seats
          </Link>

          <Link
            to="/admin/reservations"
            className={`admin-nav-link ${isActive("/admin/reservations")}`}
          >
            <span>📅</span>
            Reservations
          </Link>

          <p className="admin-nav-title second-title">
            MANAGEMENT
          </p>

          <Link
            to="/admin/members"
            className={`admin-nav-link ${isActive("/admin/members")}`}
          >
            <span>👥</span>
            Members
          </Link>

          <Link
            to="/admin/memberships"
            className={`admin-nav-link ${isActive("/admin/memberships")}`}
          >
            <span>🎫</span>
            Memberships
          </Link>

          <Link
            to="/admin/payments"
            className={`admin-nav-link ${isActive("/admin/payments")}`}
          >
            <span>💳</span>
            Payments
          </Link>

          <Link
            to="/admin/reports"
            className={`admin-nav-link ${isActive("/admin/reports")}`}
          >
            <span>📈</span>
            Reports
          </Link>

          <p className="admin-nav-title second-title">
            SYSTEM
          </p>

          <Link
            to="/admin/settings"
            className={`admin-nav-link ${isActive("/admin/settings")}`}
          >
            <span>⚙️</span>
            Settings
          </Link>

        </nav>


        {/* Sidebar Bottom */}
        <div className="admin-sidebar-bottom">

          
          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </aside>


      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="admin-main">

        {/* =========================
            TOPBAR
        ========================== */}
        <header className="admin-topbar">

          <div className="admin-topbar-left">

            <span className="admin-page-label">
              ADMINISTRATOR
            </span>

            <h1>
              Dashboard
            </h1>

          </div>


          <div className="admin-topbar-right">

            <button
              className="admin-notification"
              title="Notifications"
            >
              🔔
              <span></span>
            </button>


            <div className="admin-profile">

              <div className="admin-avatar">
                A
              </div>

              <div className="admin-profile-info">

                <strong>
                  Administrator
                </strong>

                <small>
                  admin@libraspace.com
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* =========================
            CONTENT
        ========================== */}
        <div className="admin-content">


          {/* Welcome */}
          <section className="admin-welcome">

            <div>

              <span>
                LIBRARY MANAGEMENT
              </span>

              <h2>
                Welcome back, Administrator 👋
              </h2>

              <p>
                Here's what's happening in your library today.
              </p>

            </div>

            <div className="admin-date-card">

              <span>
                📅
              </span>

              <div>
                <small>
                  TODAY
                </small>

                <strong>
                  12 September 2026
                </strong>
              </div>

            </div>

          </section>


          {/* =========================
              STATISTICS
          ========================== */}
          <section className="admin-stat-grid">


            {/* Members */}
            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon members">
                  👥
                </div>

                <span className="stat-growth positive">
                  ↑ 12.5%
                </span>

              </div>

              <p>
                Total Members
              </p>

              <h3>
                528
              </h3>

              <small>
                28 new this month
              </small>

            </div>


            {/* Memberships */}
            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon membership">
                  🎫
                </div>

                <span className="stat-growth positive">
                  ↑ 8.2%
                </span>

              </div>

              <p>
                Active Memberships
              </p>

              <h3>
                462
              </h3>

              <small>
                87.5% of members
              </small>

            </div>


            {/* Reservations */}
            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon reservations">
                  💺
                </div>

                <span className="stat-growth positive">
                  ↑ 15.4%
                </span>

              </div>

              <p>
                Today's Reservations
              </p>

              <h3>
                68
              </h3>

              <small>
                12 reservations pending
              </small>

            </div>


            {/* Revenue */}
            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon revenue">
                  ₹
                </div>

                <span className="stat-growth positive">
                  ↑ 10.8%
                </span>

              </div>

              <p>
                Today's Revenue
              </p>

              <h3>
                ₹8,964
              </h3>

              <small>
                18 successful payments
              </small>

            </div>

          </section>


          {/* =========================
              TWO COLUMN SECTION
          ========================== */}
          <section className="admin-dashboard-grid">


            {/* Seat Occupancy */}
            <div className="admin-panel occupancy-panel">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    LIBRARY CAPACITY
                  </span>

                  <h3>
                    Seat Occupancy
                  </h3>
                </div>

                <Link to="/admin/seats">
                  Manage Seats →
                </Link>

              </div>


              <div className="occupancy-content">

                <div className="occupancy-circle">

                  <div>

                    <strong>
                      58%
                    </strong>

                    <span>
                      Occupied
                    </span>

                  </div>

                </div>


                <div className="occupancy-details">

                  <div className="occupancy-item">

                    <span className="occupancy-dot available"></span>

                    <div>
                      <strong>42</strong>
                      <small>Available</small>
                    </div>

                  </div>


                  <div className="occupancy-item">

                    <span className="occupancy-dot reserved"></span>

                    <div>
                      <strong>38</strong>
                      <small>Reserved</small>
                    </div>

                  </div>


                  <div className="occupancy-item">

                    <span className="occupancy-dot occupied"></span>

                    <div>
                      <strong>20</strong>
                      <small>Occupied</small>
                    </div>

                  </div>


                  <div className="occupancy-item">

                    <span className="occupancy-dot total"></span>

                    <div>
                      <strong>100</strong>
                      <small>Total Seats</small>
                    </div>

                  </div>

                </div>

              </div>


              {/* Progress */}
              <div className="occupancy-progress">

                <div className="progress-label">

                  <span>
                    Current Occupancy
                  </span>

                  <strong>
                    58 / 100
                  </strong>

                </div>

                <div className="progress-track">
                  <div className="progress-fill"></div>
                </div>

              </div>

            </div>


            {/* Membership Overview */}
            <div className="admin-panel membership-overview">

              <div className="panel-header">

                <div>
                  <span className="panel-eyebrow">
                    MEMBERSHIP
                  </span>

                  <h3>
                    Membership Overview
                  </h3>
                </div>

                <Link to="/admin/memberships">
                  View All →
                </Link>

              </div>


              <div className="membership-status-list">

                <div className="membership-status-row">

                  <div className="membership-status-label">
                    <span className="status-icon active">
                      ✓
                    </span>

                    <div>
                      <strong>Active</strong>
                      <small>Currently valid</small>
                    </div>
                  </div>

                  <strong className="status-number">
                    462
                  </strong>

                </div>


                <div className="membership-status-row">

                  <div className="membership-status-label">
                    <span className="status-icon expiring">
                      !
                    </span>

                    <div>
                      <strong>Expiring Soon</strong>
                      <small>Within 7 days</small>
                    </div>
                  </div>

                  <strong className="status-number">
                    24
                  </strong>

                </div>


                <div className="membership-status-row">

                  <div className="membership-status-label">
                    <span className="status-icon expired">
                      ×
                    </span>

                    <div>
                      <strong>Expired</strong>
                      <small>Requires renewal</small>
                    </div>
                  </div>

                  <strong className="status-number">
                    42
                  </strong>

                </div>

              </div>

            </div>

          </section>


          {/* =========================
              RECENT RESERVATIONS
          ========================== */}
          <section className="admin-panel reservations-panel">

            <div className="panel-header">

              <div>

                <span className="panel-eyebrow">
                  RECENT ACTIVITY
                </span>

                <h3>
                  Recent Reservations
                </h3>

              </div>

              <Link to="/admin/reservations">
                View All Reservations →
              </Link>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>Reservation</th>
                    <th>Student</th>
                    <th>Seat</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>

                </thead>

                <tbody>

                  <tr>

                    <td>
                      <strong>RES-001</strong>
                    </td>

                    <td>
                      Ananya Sharma
                    </td>

                    <td>
                      <span className="seat-badge">
                        A12
                      </span>
                    </td>

                    <td>
                      12 Sep 2026
                    </td>

                    <td>
                      10:00 AM – 1:00 PM
                    </td>

                    <td>
                      <span className="table-status confirmed">
                        Confirmed
                      </span>
                    </td>

                  </tr>


                  <tr>

                    <td>
                      <strong>RES-002</strong>
                    </td>

                    <td>
                      Rahul Kumar
                    </td>

                    <td>
                      <span className="seat-badge">
                        B04
                      </span>
                    </td>

                    <td>
                      12 Sep 2026
                    </td>

                    <td>
                      02:00 PM – 04:00 PM
                    </td>

                    <td>
                      <span className="table-status confirmed">
                        Confirmed
                      </span>
                    </td>

                  </tr>


                  <tr>

                    <td>
                      <strong>RES-003</strong>
                    </td>

                    <td>
                      Priya Nair
                    </td>

                    <td>
                      <span className="seat-badge">
                        C08
                      </span>
                    </td>

                    <td>
                      12 Sep 2026
                    </td>

                    <td>
                      09:00 AM – 12:00 PM
                    </td>

                    <td>
                      <span className="table-status completed">
                        Completed
                      </span>
                    </td>

                  </tr>


                  <tr>

                    <td>
                      <strong>RES-004</strong>
                    </td>

                    <td>
                      Arjun Menon
                    </td>

                    <td>
                      <span className="seat-badge">
                        D03
                      </span>
                    </td>

                    <td>
                      12 Sep 2026
                    </td>

                    <td>
                      04:00 PM – 06:00 PM
                    </td>

                    <td>
                      <span className="table-status pending">
                        Pending
                      </span>
                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </section>


          {/* =========================
              PAYMENT + QUICK ACTIONS
          ========================== */}
          <section className="admin-bottom-grid">


            {/* Payment Overview */}
            <div className="admin-panel payment-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-eyebrow">
                    FINANCE
                  </span>

                  <h3>
                    Payment Overview
                  </h3>

                </div>

                <Link to="/admin/payments">
                  View Payments →
                </Link>

              </div>


              <div className="payment-total">

                <span>
                  THIS MONTH
                </span>

                <strong>
                  ₹1,48,760
                </strong>

                <small>
                  ↑ 14.6% compared to last month
                </small>

              </div>


              <div className="payment-stats">

                <div>

                  <span className="payment-stat-icon success">
                    ✓
                  </span>

                  <div>
                    <strong>284</strong>
                    <small>Successful</small>
                  </div>

                </div>


                <div>

                  <span className="payment-stat-icon pending">
                    ⏳
                  </span>

                  <div>
                    <strong>8</strong>
                    <small>Pending</small>
                  </div>

                </div>


                <div>

                  <span className="payment-stat-icon failed">
                    ×
                  </span>

                  <div>
                    <strong>3</strong>
                    <small>Failed</small>
                  </div>

                </div>

              </div>

            </div>


            {/* Quick Actions */}
            <div className="admin-panel quick-actions-panel">

              <div className="panel-header">

                <div>

                  <span className="panel-eyebrow">
                    SHORTCUTS
                  </span>

                  <h3>
                    Quick Actions
                  </h3>

                </div>

              </div>


              <div className="quick-actions-grid">

                <Link
                  to="/admin/books"
                  className="quick-action"
                >
                  <span>📚</span>
                  <strong>Add Book</strong>
                  <small>Manage resources</small>
                </Link>


                <Link
                  to="/admin/seats"
                  className="quick-action"
                >
                  <span>💺</span>
                  <strong>Manage Seats</strong>
                  <small>Update availability</small>
                </Link>


                <Link
                  to="/admin/reservations"
                  className="quick-action"
                >
                  <span>📅</span>
                  <strong>Reservations</strong>
                  <small>View bookings</small>
                </Link>


                <Link
                  to="/admin/members"
                  className="quick-action"
                >
                  <span>👥</span>
                  <strong>Members</strong>
                  <small>Manage users</small>
                </Link>

              </div>

            </div>

          </section>


          {/* =========================
              RECENT ACTIVITY
          ========================== */}
          <section className="admin-panel activity-panel">

            <div className="panel-header">

              <div>

                <span className="panel-eyebrow">
                  SYSTEM ACTIVITY
                </span>

                <h3>
                  Recent Activity
                </h3>

              </div>

              <Link to="/admin/reports">
                View Reports →
              </Link>

            </div>


            <div className="activity-list">

              <div className="activity-item">

                <span className="activity-icon green">
                  ✓
                </span>

                <div>

                  <p>
                    New membership activated for
                    <strong> Ananya Sharma</strong>
                  </p>

                  <small>
                    10 minutes ago
                  </small>

                </div>

              </div>


              <div className="activity-item">

                <span className="activity-icon blue">
                  💳
                </span>

                <div>

                  <p>
                    Payment of
                    <strong> ₹499</strong> received
                  </p>

                  <small>
                    25 minutes ago
                  </small>

                </div>

              </div>


              <div className="activity-item">

                <span className="activity-icon orange">
                  💺
                </span>

                <div>

                  <p>
                    Seat
                    <strong> A12</strong> reserved by
                    <strong> Rahul Kumar</strong>
                  </p>

                  <small>
                    42 minutes ago
                  </small>

                </div>

              </div>


              <div className="activity-item">

                <span className="activity-icon purple">
                  📚
                </span>

                <div>

                  <p>
                    New book added:
                    <strong> Atomic Habits</strong>
                  </p>

                  <small>
                    1 hour ago
                  </small>

                </div>

              </div>

            </div>

          </section>


          {/* Footer */}

          <footer className="admin-footer">

            <p>
              © 2026 LibraSpace. All Rights Reserved.
            </p>

            <span>
              Admin Management System
            </span>

          </footer>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;