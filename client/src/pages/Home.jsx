import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* =========================
          NAVBAR
      ========================== */}
      <header className="navbar">

        <div className="nav-container">

          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">📚</span>
            <span>LibraSpace</span>
          </Link>

          {/* Navigation */}
          <nav className="nav-links">

            <Link to="/" className="active">
              Home
            </Link>

            <a href="#features">
              Features
            </a>

            <a href="#membership">
              Membership
            </a>

            <a href="#about">
              About
            </a>

          </nav>

          {/* Authentication Buttons */}
          <div className="nav-actions">

            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="register-btn"
            >
              Register
            </Link>

          </div>

        </div>

      </header>


      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="hero">

        <div className="hero-container">

          {/* Hero Content */}
          <div className="hero-content">

            <span className="hero-tag">
              ✨ SMART LIBRARY MANAGEMENT
            </span>

            <h1>
              Your Perfect Place
              <br />
              <span>To Read & Learn</span>
            </h1>

            <p>
              Reserve your favorite library seat, manage your
              membership and renew your subscription online.
              Everything you need for a better library experience
              in one simple platform.
            </p>

            {/* Hero Buttons */}
            <div className="hero-buttons">

              <Link
                to="/login"
                className="primary-btn"
              >
                Reserve a Seat
                <span>→</span>
              </Link>

              <a
                href="#membership"
                className="secondary-btn"
              >
                Explore Membership
              </a>

            </div>


            {/* Statistics */}
            <div className="hero-stats">

              <div className="stat-item">

                <strong>120+</strong>

                <span>
                  Library Seats
                </span>

              </div>


              <div className="stat-item">

                <strong>500+</strong>

                <span>
                  Active Members
                </span>

              </div>


              <div className="stat-item">

                <strong>24/7</strong>

                <span>
                  Online Booking
                </span>

              </div>

            </div>

          </div>


          {/* Hero Visual */}
          <div className="hero-visual">

            <div className="hero-main-card">

              <div className="book-stack">

                <div className="book book-one">
                  📘
                </div>

                <div className="book book-two">
                  📗
                </div>

                <div className="book book-three">
                  📕
                </div>

              </div>

              <div className="reading-person">
                👩‍💻
              </div>

            </div>


            {/* Floating Seat Card */}
            <div className="floating-card seat-card">

              <div className="floating-icon">
                💺
              </div>

              <div>
                <strong>
                  Seat Available
                </strong>

                <span>
                  Choose your seat
                </span>
              </div>

            </div>


            {/* Floating Membership Card */}
            <div className="floating-card membership-card">

              <div className="floating-icon">
                🎫
              </div>

              <div>
                <strong>
                  Membership
                </strong>

                <span>
                  Easy renewal
                </span>
              </div>

            </div>


            {/* Decorative Circle */}
            <div className="hero-circle circle-one"></div>

            <div className="hero-circle circle-two"></div>

          </div>

        </div>

      </section>


      {/* =========================
          FEATURES SECTION
      ========================== */}
      <section
        className="features-section"
        id="features"
      >

        <div className="section-heading">

          <span>
            OUR FEATURES
          </span>

          <h2>
            Everything You Need
            <br />
            <strong>
              For Your Library Journey
            </strong>
          </h2>

          <p>
            Our system makes library seat reservation and
            membership management simple, fast and convenient.
          </p>

        </div>


        <div className="features-grid">

          {/* Feature 1 */}
          <div className="feature-card">

            <div className="feature-icon">
              💺
            </div>

            <h3>
              Easy Seat Reservation
            </h3>

            <p>
              View available seats and reserve your preferred
              seat online without waiting in a queue.
            </p>

            <a href="#features">
              Learn More →
            </a>

          </div>


          {/* Feature 2 */}
          <div className="feature-card">

            <div className="feature-icon">
              📅
            </div>

            <h3>
              Flexible Booking
            </h3>

            <p>
              Select your preferred date and time and manage
              your library reservations easily.
            </p>

            <a href="#features">
              Learn More →
            </a>

          </div>


          {/* Feature 3 */}
          <div className="feature-card">

            <div className="feature-icon">
              🔄
            </div>

            <h3>
              Easy Membership Renewal
            </h3>

            <p>
              Renew your library membership online and avoid
              manual paperwork and unnecessary visits.
            </p>

            <a href="#membership">
              Learn More →
            </a>

          </div>


          {/* Feature 4 */}
          <div className="feature-card">

            <div className="feature-icon">
              ✅
            </div>

            <h3>
              Instant Confirmation
            </h3>

            <p>
              Receive confirmation after successfully reserving
              a seat or renewing your membership.
            </p>

            <a href="#features">
              Learn More →
            </a>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================== */}
      <section className="how-section">

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Reserve Your Seat
            <br />
            <strong>
              In Three Simple Steps
            </strong>
          </h2>

        </div>


        <div className="steps-container">

          {/* Step 1 */}
          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              👤
            </div>

            <h3>
              Create Account
            </h3>

            <p>
              Register on LibraSpace using your name,
              email and password.
            </p>

          </div>


          {/* Step 2 */}
          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              💺
            </div>

            <h3>
              Select Your Seat
            </h3>

            <p>
              Check seat availability and select your
              preferred date, time and seat.
            </p>

          </div>


          {/* Step 3 */}
          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              ✅
            </div>

            <h3>
              Get Confirmation
            </h3>

            <p>
              Your reservation will be confirmed and
              available in your dashboard.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          MEMBERSHIP SECTION
      ========================== */}
      <section
        className="membership-section"
        id="membership"
      >

        <div className="membership-container">

          {/* Membership Text */}
          <div className="membership-content">

            <span className="section-label">
              MEMBERSHIP PLAN
            </span>

            <h2>
              Read More.
              <br />
              <strong>
                Learn More.
              </strong>
              <br />
              Grow More.
            </h2>

            <p>
              Get access to our library facilities with a
              simple and affordable membership plan.
              Renew your membership online whenever you need.
            </p>

            <div className="membership-price">

              <span>
                ₹499
              </span>

              <small>
                / month
              </small>

            </div>


            <ul className="membership-list">

              <li>
                ✓ Library access
              </li>

              <li>
                ✓ Online seat reservation
              </li>

              <li>
                ✓ Membership renewal
              </li>

              <li>
                ✓ Booking history
              </li>

              <li>
                ✓ Online payment
              </li>

            </ul>


            <Link
              to="/register"
              className="membership-btn"
            >
              Get Started →
            </Link>

          </div>


          {/* Membership Card */}
          <div className="membership-card-wrapper">

            <div className="membership-big-card">

              <div className="membership-card-top">

                <span>
                  LIBRASPACE
                </span>

                <span>
                  MEMBERSHIP
                </span>

              </div>


              <div className="membership-card-icon">
                📚
              </div>


              <h3>
                Premium Reader
              </h3>

              <p>
                Your gateway to knowledge
              </p>


              <div className="membership-card-price">

                ₹499

                <span>
                  / month
                </span>

              </div>


              <div className="membership-status">
                ● ACTIVE MEMBERSHIP
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          ABOUT SECTION
      ========================== */}
      <section
        className="about-section"
        id="about"
      >

        <div className="about-container">

          {/* About Visual */}
          <div className="about-visual">

            <div className="about-main-card">

              <div className="about-icon">
                📖
              </div>

              <h3>
                Smart Library
              </h3>

              <p>
                Simple. Digital. Convenient.
              </p>

            </div>

            <div className="about-small-card">
              💡 Smart Management
            </div>

          </div>


          {/* About Content */}
          <div className="about-content">

            <span className="section-label">
              ABOUT LIBRASPACE
            </span>

            <h2>
              A Smarter Way
              <br />
              <strong>
                To Use Your Library
              </strong>
            </h2>

            <p>
              LibraSpace is an online library seat reservation
              and membership fee renewal system designed to
              make library services easier for students and
              administrators.
            </p>

            <p>
              Instead of manually checking seat availability
              or visiting the library to renew membership,
              users can complete these activities online.
            </p>


            <div className="about-points">

              <div className="about-point">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Simple & Easy
                  </strong>

                  <p>
                    User-friendly interface for students.
                  </p>

                </div>

              </div>


              <div className="about-point">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Secure System
                  </strong>

                  <p>
                    Protected user authentication and data.
                  </p>

                </div>

              </div>


              <div className="about-point">

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    Online Management
                  </strong>

                  <p>
                    Manage reservations and memberships digitally.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================
          CALL TO ACTION
      ========================== */}
      <section className="cta-section">

        <div className="cta-container">

          <div className="cta-icon">
            📚
          </div>

          <h2>
            Ready To Make
            <br />
            Your Library Experience Better?
          </h2>

          <p>
            Join LibraSpace today and manage your library
            reservations and membership online.
          </p>

          <div className="cta-buttons">

            <Link
              to="/register"
              className="cta-primary"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="cta-secondary"
            >
              Login
            </Link>

          </div>

        </div>

      </section>


      {/* =========================
          FOOTER
      ========================== */}
      <footer className="footer">

        <div className="footer-container">

          {/* Footer Brand */}
          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
            >
              📚 LibraSpace
            </Link>

            <p>
              Online Library Seat Reservation &
              Membership Fee Renewal System.
            </p>

          </div>


          {/* Footer Links */}
          <div className="footer-column">

            <h4>
              Quick Links
            </h4>

            <Link to="/">
              Home
            </Link>

            <a href="#features">
              Features
            </a>

            <a href="#membership">
              Membership
            </a>

            <a href="#about">
              About
            </a>

            {/* =========================
                ADMIN LOGIN
            ========================== */}
            <Link to="/admin/login">
              🔐 Admin Login
            </Link>

          </div>


          {/* Footer Services */}
          <div className="footer-column">

            <h4>
              Services
            </h4>

            <Link to="/login">
              Seat Reservation
            </Link>

            <Link to="/login">
              Membership
            </Link>

            <Link to="/login">
              Booking History
            </Link>

          </div>


          {/* Footer Contact */}
          <div className="footer-column">

            <h4>
              Contact
            </h4>

            <span>
              📧 support@libraspace.com
            </span>

            <span>
              📞 +91 98765 43210
            </span>

            <span>
              📍 India
            </span>

          </div>

        </div>


        {/* Copyright */}
        <div className="footer-bottom">

          <p>
            © 2026 LibraSpace. All Rights Reserved.
          </p>

          <p>
            Online Library Management System
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;