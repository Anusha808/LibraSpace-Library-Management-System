import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {

  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [adminName, setAdminName] = useState("Administrator");
  const [adminEmail, setAdminEmail] = useState("admin@libraspace.com");


  // ==========================================
  // ACTIVE SIDEBAR LINK
  // ==========================================

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };


  // ==========================================
  // GET ADMIN INFORMATION
  // ==========================================

  useEffect(() => {

    try {

      const storedAdmin =
        localStorage.getItem("adminUser");

      const storedUser =
        localStorage.getItem("user");

      const userData =
        storedAdmin || storedUser;

      if (userData) {

        const user = JSON.parse(userData);

        if (user.name) {
          setAdminName(user.name);
        }

        if (user.email) {
          setAdminEmail(user.email);
        }

      }

    } catch (error) {

      console.error(
        "Unable to read administrator information:",
        error
      );

    }

  }, []);


  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  useEffect(() => {

    fetchDashboardData();

  }, []);


  const fetchDashboardData = async () => {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken") ||
        localStorage.getItem("token");

      if (!token) {

        navigate("/admin/login");

        return;
      }


      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          method: "GET",

          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );


      if (response.status === 401 ||
          response.status === 403) {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");

        navigate("/admin/login");

        return;
      }


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          "Unable to load dashboard data."
        );

      }


      setDashboardData(data);

    } catch (error) {

      console.error(
        "Dashboard error:",
        error
      );

      setError(
        error.message ||
        "Unable to load dashboard."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login");

  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {

    if (!date) {
      return "—";
    }

    const parsedDate =
      new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );

  };


  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (time) => {

    if (!time) {
      return "—";
    }

    const parts =
      time.split(":");

    if (parts.length < 2) {
      return time;
    }

    let hour =
      parseInt(parts[0], 10);

    const minute =
      parts[1];

    const period =
      hour >= 12 ? "PM" : "AM";

    hour =
      hour % 12 || 12;

    return `${hour}:${minute} ${period}`;

  };


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency = (amount) => {

    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(amount || 0);

  };


  // ==========================================
  // FORMAT GROWTH
  // ==========================================

  const formatGrowth = (value) => {

    const number =
      Number(value || 0);

    if (number > 0) {
      return `↑ ${number}%`;
    }

    if (number < 0) {
      return `↓ ${Math.abs(number)}%`;
    }

    return "0%";

  };


  // ==========================================
  // GROWTH CLASS
  // ==========================================

  const growthClass = (value) => {

    const number =
      Number(value || 0);

    if (number < 0) {
      return "stat-growth negative";
    }

    return "stat-growth positive";

  };


  // ==========================================
  // TIME AGO
  // ==========================================

  const timeAgo = (date) => {

    if (!date) {
      return "Recently";
    }

    const now =
      new Date();

    const past =
      new Date(date);

    const seconds =
      Math.floor(
        (now - past) / 1000
      );

    if (seconds < 60) {
      return "Just now";
    }

    const minutes =
      Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }

    const hours =
      Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    const days =
      Math.floor(hours / 24);

    if (days < 30) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return formatDate(date);

  };


  // ==========================================
  // CREATE RECENT ACTIVITIES
  // ==========================================

  const getActivities = () => {

    if (!dashboardData) {
      return [];
    }

    const activities = [];


    // Membership activities

    const memberships =
      dashboardData.recentMemberships || [];

    memberships.forEach((membership) => {

      activities.push({
        type: "membership",
        date:
          membership.createdAt ||
          membership.startDate,
        message: (
          <>
            New membership activated for
            <strong>
              {" "}
              {membership.user?.name ||
                "Library Member"}
            </strong>
          </>
        ),
        icon: "✓",
        className: "green"
      });

    });


    // Payment activities

    const payments =
      dashboardData.recentPayments || [];

    payments.forEach((payment) => {

      activities.push({
        type: "payment",
        date:
          payment.paymentDate ||
          payment.createdAt,
        message: (
          <>
            Payment of
            <strong>
              {" "}
              {formatCurrency(payment.amount)}
            </strong>{" "}
            received
          </>
        ),
        icon: "💳",
        className: "blue"
      });

    });


    // Reservation activities

    const reservations =
      dashboardData.recentReservations || [];

    reservations.forEach((reservation) => {

      activities.push({
        type: "reservation",
        date:
          reservation.createdAt ||
          reservation.reservationDate,
        message: (
          <>
            Seat
            <strong>
              {" "}
              {reservation.seatNumber}
            </strong>{" "}
            reserved by
            <strong>
              {" "}
              {reservation.user?.name ||
                "Library Member"}
            </strong>
          </>
        ),
        icon: "💺",
        className: "orange"
      });

    });


    return activities
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);

  };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div className="admin-dashboard">

        <aside className="admin-sidebar">

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

        </aside>


        <main className="admin-main">

          <div
            className="admin-content"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "70vh"
            }}
          >

            <div style={{ textAlign: "center" }}>

              <h2>
                Loading Dashboard...
              </h2>

              <p>
                Fetching the latest library information.
              </p>

            </div>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {

    return (

      <div className="admin-dashboard">

        <main
          className="admin-main"
          style={{
            marginLeft: 0,
            width: "100%"
          }}
        >

          <div
            className="admin-content"
            style={{
              textAlign: "center",
              paddingTop: "120px"
            }}
          >

            <h2>
              Unable to Load Dashboard
            </h2>

            <p>
              {error}
            </p>

            <button
              onClick={fetchDashboardData}
              style={{
                marginTop: "20px",
                padding: "12px 24px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer"
              }}
            >
              Try Again
            </button>

          </div>

        </main>

      </div>

    );

  }


  // ==========================================
  // DATA FROM BACKEND
  // ==========================================

  const statistics =
    dashboardData?.statistics || {};

  const occupancy =
    dashboardData?.occupancy || {};

  const membershipOverview =
    dashboardData?.membershipOverview || {};

  const paymentOverview =
    dashboardData?.paymentOverview || {};

  const recentReservations =
    dashboardData?.recentReservations || [];

  const activities =
    getActivities();


  // ==========================================
  // OCCUPANCY PERCENTAGE
  // ==========================================

  const occupancyPercentage =
    Number(
      occupancy.occupancyPercentage || 0
    );


  // ==========================================
  // RENDER
  // ==========================================

  return (

    <div className="admin-dashboard">

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside className="admin-sidebar">

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


        <nav className="admin-navigation">

          <p className="admin-nav-title">
            MAIN MENU
          </p>


          <Link
            to="/admin/dashboard"
            className={`admin-nav-link ${isActive(
              "/admin/dashboard"
            )}`}
          >
            <span>📊</span>
            Dashboard
          </Link>
<Link
            to="/admin/seats"
            className={`admin-nav-link ${isActive(
              "/admin/seats"
            )}`}
          >
            <span>💺</span>
            Manage Seats
          </Link>


          <Link
            to="/admin/reservations"
            className={`admin-nav-link ${isActive(
              "/admin/reservations"
            )}`}
          >
            <span>📅</span>
            Reservations
          </Link>


          <p className="admin-nav-title second-title">
            MANAGEMENT
          </p>


          <Link
            to="/admin/members"
            className={`admin-nav-link ${isActive(
              "/admin/members"
            )}`}
          >
            <span>👥</span>
            Members
          </Link>


          <Link
            to="/admin/memberships"
            className={`admin-nav-link ${isActive(
              "/admin/memberships"
            )}`}
          >
            <span>🎫</span>
            Memberships
          </Link>


          <Link
            to="/admin/payments"
            className={`admin-nav-link ${isActive(
              "/admin/payments"
            )}`}
          >
            <span>💳</span>
            Payments
          </Link>


          <Link
            to="/admin/reports"
            className={`admin-nav-link ${isActive(
              "/admin/reports"
            )}`}
          >
            <span>📈</span>
            Reports
          </Link>


          <p className="admin-nav-title second-title">
            SYSTEM
          </p>


          <Link
            to="/admin/settings"
            className={`admin-nav-link ${isActive(
              "/admin/settings"
            )}`}
          >
            <span>⚙️</span>
            Settings
          </Link>

        </nav>


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


      {/* =====================================
          MAIN
      ====================================== */}

      <main className="admin-main">

        {/* ===================================
            TOPBAR
        ==================================== */}

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

                {adminName
                  ? adminName.charAt(0).toUpperCase()
                  : "A"}

              </div>


              <div className="admin-profile-info">

                <strong>
                  {adminName}
                </strong>

                <small>
                  {adminEmail}
                </small>

              </div>

            </div>

          </div>

        </header>


        {/* ===================================
            CONTENT
        ==================================== */}

        <div className="admin-content">


          {/* =================================
              WELCOME
          ================================== */}

          <section className="admin-welcome">

            <div>

              <span>
                LIBRARY MANAGEMENT
              </span>

              <h2>
                Welcome back, {adminName} 👋
              </h2>

              <p>
                Here's what's happening in your
                library today.
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
                  {formatDate(
                    new Date()
                  )}
                </strong>

              </div>

            </div>

          </section>


          {/* =================================
              STATISTICS
          ================================== */}

          <section className="admin-stat-grid">


            {/* MEMBERS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon members">
                  👥
                </div>

                <span
                  className={growthClass(
                    statistics.memberGrowth
                  )}
                >
                  {formatGrowth(
                    statistics.memberGrowth
                  )}
                </span>

              </div>

              <p>
                Total Members
              </p>

              <h3>
                {statistics.totalMembers || 0}
              </h3>

              <small>
                {statistics.newMembersThisMonth || 0}
                {" "}
                new this month
              </small>

            </div>


            {/* MEMBERSHIPS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon membership">
                  🎫
                </div>

                <span
                  className={growthClass(
                    statistics.membershipGrowth
                  )}
                >
                  {formatGrowth(
                    statistics.membershipGrowth
                  )}
                </span>

              </div>

              <p>
                Active Memberships
              </p>

              <h3>
                {statistics.activeMemberships || 0}
              </h3>

              <small>
                {statistics.totalMembers
                  ? (
                      (
                        statistics.activeMemberships /
                        statistics.totalMembers
                      ) * 100
                    ).toFixed(1)
                  : 0}
                % of members
              </small>

            </div>


            {/* RESERVATIONS */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon reservations">
                  💺
                </div>

                <span
                  className={growthClass(
                    statistics.reservationGrowth
                  )}
                >
                  {formatGrowth(
                    statistics.reservationGrowth
                  )}
                </span>

              </div>

              <p>
                Today's Reservations
              </p>

              <h3>
                {statistics.todayReservations || 0}
              </h3>

              <small>
                {statistics.pendingReservations || 0}
                {" "}
                reservations pending
              </small>

            </div>


            {/* REVENUE */}

            <div className="admin-stat-card">

              <div className="admin-stat-top">

                <div className="admin-stat-icon revenue">
                  ₹
                </div>

                <span
                  className={growthClass(
                    statistics.revenueGrowth
                  )}
                >
                  {formatGrowth(
                    statistics.revenueGrowth
                  )}
                </span>

              </div>

              <p>
                Today's Revenue
              </p>

              <h3>
                {formatCurrency(
                  statistics.todayRevenue
                )}
              </h3>

              <small>
                {statistics.todaySuccessfulPayments || 0}
                {" "}
                successful payments
              </small>

            </div>

          </section>


          {/* =================================
              TWO COLUMN
          ================================== */}

          <section className="admin-dashboard-grid">


            {/* SEAT OCCUPANCY */}

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
                      {occupancyPercentage}%
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

                      <strong>
                        {occupancy.available || 0}
                      </strong>

                      <small>
                        Available
                      </small>

                    </div>

                  </div>


                  <div className="occupancy-item">

                    <span className="occupancy-dot reserved"></span>

                    <div>

                      <strong>
                        {occupancy.reserved || 0}
                      </strong>

                      <small>
                        Reserved
                      </small>

                    </div>

                  </div>


                  <div className="occupancy-item">

                    <span className="occupancy-dot occupied"></span>

                    <div>

                      <strong>
                        {occupancy.occupied || 0}
                      </strong>

                      <small>
                        Occupied
                      </small>

                    </div>

                  </div>


                  <div className="occupancy-item">

                    <span className="occupancy-dot total"></span>

                    <div>

                      <strong>
                        {occupancy.totalSeats || 0}
                      </strong>

                      <small>
                        Total Seats
                      </small>

                    </div>

                  </div>

                </div>

              </div>


              <div className="occupancy-progress">

                <div className="progress-label">

                  <span>
                    Current Occupancy
                  </span>

                  <strong>
                    {occupancy.occupied || 0}
                    {" / "}
                    {occupancy.totalSeats || 0}
                  </strong>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width:
                        `${occupancyPercentage}%`
                    }}
                  ></div>

                </div>

              </div>

            </div>


            {/* MEMBERSHIP OVERVIEW */}

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

                      <strong>
                        Active
                      </strong>

                      <small>
                        Currently valid
                      </small>

                    </div>

                  </div>

                  <strong className="status-number">
                    {membershipOverview.active || 0}
                  </strong>

                </div>


                <div className="membership-status-row">

                  <div className="membership-status-label">

                    <span className="status-icon expiring">
                      !
                    </span>

                    <div>

                      <strong>
                        Expiring Soon
                      </strong>

                      <small>
                        Within 7 days
                      </small>

                    </div>

                  </div>

                  <strong className="status-number">
                    {membershipOverview.expiringSoon || 0}
                  </strong>

                </div>


                <div className="membership-status-row">

                  <div className="membership-status-label">

                    <span className="status-icon expired">
                      ×
                    </span>

                    <div>

                      <strong>
                        Expired
                      </strong>

                      <small>
                        Requires renewal
                      </small>

                    </div>

                  </div>

                  <strong className="status-number">
                    {membershipOverview.expired || 0}
                  </strong>

                </div>

              </div>

            </div>

          </section>


          {/* =================================
              RECENT RESERVATIONS
          ================================== */}

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

                    <th>
                      Reservation
                    </th>

                    <th>
                      Student
                    </th>

                    <th>
                      Seat
                    </th>

                    <th>
                      Date
                    </th>

                    <th>
                      Time
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {recentReservations.length === 0 ? (

                    <tr>

                      <td
                        colSpan="6"
                        style={{
                          textAlign: "center",
                          padding: "30px"
                        }}
                      >
                        No reservations found.

                      </td>

                    </tr>

                  ) : (

                    recentReservations.map(
                      (reservation, index) => (

                        <tr
                          key={
                            reservation._id ||
                            index
                          }
                        >

                          <td>

                            <strong>
                              RES-
                              {String(
                                index + 1
                              ).padStart(
                                3,
                                "0"
                              )}
                            </strong>

                          </td>


                          <td>

                            {reservation.user?.name ||
                              "Unknown Member"}

                          </td>


                          <td>

                            <span className="seat-badge">

                              {reservation.seatNumber ||
                                "—"}

                            </span>

                          </td>


                          <td>

                            {formatDate(
                              reservation.reservationDate
                            )}

                          </td>


                          <td>

                            {formatTime(
                              reservation.startTime
                            )}

                            {" – "}

                            {formatTime(
                              reservation.endTime
                            )}

                          </td>


                          <td>

                            <span
                              className={`table-status ${
                                reservation.status ||
                                "confirmed"
                              }`}
                            >

                              {reservation.status
                                ? reservation.status
                                    .charAt(0)
                                    .toUpperCase() +
                                  reservation.status.slice(1)
                                : "Confirmed"}

                            </span>

                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>

            </div>

          </section>


          {/* =================================
              PAYMENT + QUICK ACTIONS
          ================================== */}

          <section className="admin-bottom-grid">


            {/* PAYMENT */}

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
                  {formatCurrency(
                    paymentOverview.monthRevenue
                  )}
                </strong>

                <small>

                  {formatGrowth(
                    paymentOverview.revenueGrowth
                  )}

                  {" compared to last month"}

                </small>

              </div>


              <div className="payment-stats">


                <div>

                  <span className="payment-stat-icon success">
                    ✓
                  </span>

                  <div>

                    <strong>
                      {paymentOverview.successful || 0}
                    </strong>

                    <small>
                      Successful
                    </small>

                  </div>

                </div>


                <div>

                  <span className="payment-stat-icon pending">
                    ⏳
                  </span>

                  <div>

                    <strong>
                      {paymentOverview.pending || 0}
                    </strong>

                    <small>
                      Pending
                    </small>

                  </div>

                </div>


                <div>

                  <span className="payment-stat-icon failed">
                    ×
                  </span>

                  <div>

                    <strong>
                      {paymentOverview.failed || 0}
                    </strong>

                    <small>
                      Failed
                    </small>

                  </div>

                </div>

              </div>

            </div>


            {/* QUICK ACTIONS */}

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
                  to="/admin/seats"
                  className="quick-action"
                >

                  <span>
                    💺
                  </span>

                  <strong>
                    Manage Seats
                  </strong>

                  <small>
                    Update availability
                  </small>

                </Link>


                <Link
                  to="/admin/reservations"
                  className="quick-action"
                >

                  <span>
                    📅
                  </span>

                  <strong>
                    Reservations
                  </strong>

                  <small>
                    View bookings
                  </small>

                </Link>


                <Link
                  to="/admin/members"
                  className="quick-action"
                >

                  <span>
                    👥
                  </span>

                  <strong>
                    Members
                  </strong>

                  <small>
                    Manage users
                  </small>

                </Link>

              </div>

            </div>

          </section>


          {/* =================================
              RECENT ACTIVITY
          ================================== */}

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

              {activities.length === 0 ? (

                <div className="activity-item">

                  <span className="activity-icon blue">
                    ℹ
                  </span>

                  <div>

                    <p>
                      No recent activity.
                    </p>

                    <small>
                      Activity will appear here automatically.
                    </small>

                  </div>

                </div>

              ) : (

                activities.map(
                  (activity, index) => (

                    <div
                      className="activity-item"
                      key={index}
                    >

                      <span
                        className={`activity-icon ${activity.className}`}
                      >
                        {activity.icon}
                      </span>

                      <div>

                        <p>
                          {activity.message}
                        </p>

                        <small>
                          {timeAgo(
                            activity.date
                          )}
                        </small>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

          </section>


          {/* =================================
              FOOTER
          ================================== */}

          <footer className="admin-footer">

            <p>
              © {new Date().getFullYear()} LibraSpace.
              All Rights Reserved.
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