import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {

    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // Frontend-only admin login for now
    if (
      email === "admin@libraspace.com" &&
      password === "admin123"
    ) {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid administrator email or password.");
    }
  };

  return (
    <div className="admin-login-page">

      {/* =========================
          LEFT SECTION
      ========================== */}

      <div className="admin-login-left">

        <Link to="/" className="admin-login-logo">
          <span>📚</span>
          LibraSpace
        </Link>

        <div className="admin-login-intro">

          <span className="admin-eyebrow">
            🔐 ADMINISTRATOR PORTAL
          </span>

          <h1>
            Manage Your
            <br />
            <strong>Library Smarter.</strong>
          </h1>

          <p>
            Access the LibraSpace administration panel to
            manage books, seats, reservations, members,
            memberships and payments.
          </p>

          <div className="admin-features">

            <div className="admin-feature">
              <span>📚</span>
              <div>
                <strong>Library Management</strong>
                <small>
                  Manage books and library resources
                </small>
              </div>
            </div>

            <div className="admin-feature">
              <span>💺</span>
              <div>
                <strong>Seat Management</strong>
                <small>
                  Monitor and manage library seats
                </small>
              </div>
            </div>

            <div className="admin-feature">
              <span>📊</span>
              <div>
                <strong>Reports & Analytics</strong>
                <small>
                  View library activity and reports
                </small>
              </div>
            </div>

          </div>

        </div>

        <div className="admin-left-footer">
          © 2026 LibraSpace. All Rights Reserved.
        </div>

      </div>


      {/* =========================
          RIGHT SECTION
      ========================== */}

      <div className="admin-login-right">

        <div className="admin-login-card">

          {/* Icon */}

          <div className="admin-login-icon">
            🔐
          </div>

          <span className="admin-card-label">
            ADMIN ACCESS
          </span>

          <h2>
            Welcome Back
          </h2>

          <p className="admin-login-subtitle">
            Sign in to access the administrator dashboard.
          </p>


          {/* Error Message */}

          {error && (
            <div className="admin-error">
              ⚠️ {error}
            </div>
          )}


          {/* Login Form */}

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="admin-form-group">

              <label htmlFor="adminEmail">
                Administrator Email
              </label>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  ✉️
                </span>

                <input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@libraspace.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

              </div>

            </div>


            {/* Password */}

            <div className="admin-form-group">

              <div className="admin-password-label">

                <label htmlFor="adminPassword">
                  Password
                </label>

                <a href="#forgot-admin-password">
                  Forgot Password?
                </a>

              </div>

              <div className="admin-input-wrapper">

                <span className="admin-input-icon">
                  🔑
                </span>

                <input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>

              </div>

            </div>


            {/* Remember Me */}

            <div className="admin-login-options">

              <label className="admin-remember">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              className="admin-login-button"
            >
              <span>
                Login to Admin Panel
              </span>

              <span>
                →
              </span>
            </button>

          </form>


          {/* Demo Credentials */}

          <div className="admin-demo-box">

            <div className="admin-demo-title">
              🧪 Demo Administrator Account
            </div>

            <div className="admin-demo-details">

              <span>
                Email:
                <strong>
                  admin@libraspace.com
                </strong>
              </span>

              <span>
                Password:
                <strong>
                  admin123
                </strong>
              </span>

            </div>

          </div>


          {/* Back Links */}

          <div className="admin-login-links">

            <Link to="/">
              ← Back to LibraSpace
            </Link>

            <span>|</span>

            <Link to="/login">
              Student Login
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;