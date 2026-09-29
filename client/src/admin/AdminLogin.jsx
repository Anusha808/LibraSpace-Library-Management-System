import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim() || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password."
                );
            }

            // Make sure the logged-in user is an admin
            if (!data.user || data.user.role !== "admin") {
                setError(
                    "Access denied. Only administrators can access this page."
                );
                return;
            }

            // Store admin authentication
            localStorage.setItem("adminToken", data.token);
            localStorage.setItem(
                "adminUser",
                JSON.stringify(data.user)
            );

            // Remove student login information
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Remember admin login preference
            if (rememberMe) {
                localStorage.setItem("rememberAdmin", "true");
            } else {
                localStorage.removeItem("rememberAdmin");
            }

            // Redirect to admin dashboard
            navigate("/admin/dashboard");
        } catch (err) {
            console.error("Admin login error:", err);

            if (
                err.message === "Failed to fetch" ||
                err.message.includes("NetworkError")
            ) {
                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            } else {
                setError(
                    err.message || "Login failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">

            {/* Background Decorative Bubbles */}
            <div className="auth-bubble bubble-one"></div>
            <div className="auth-bubble bubble-two"></div>
            <div className="auth-bubble bubble-three"></div>
            <div className="auth-bubble bubble-four"></div>
            <div className="auth-bubble bubble-five"></div>

            <div className="admin-login-container">

                {/* =========================
                    LEFT SIDE
                ========================== */}
                <div className="admin-login-left">

                    <div className="brand-section">

                        <div className="brand-icon">
                            <i className="fa-solid fa-book-open"></i>
                        </div>

                        <div>
                            <h1>LibraSpace</h1>
                            <p>Library Management System</p>
                        </div>

                    </div>

                    <div className="admin-welcome">

                        <span className="admin-badge">
                            <i className="fa-solid fa-shield-halved"></i>
                            Administrator Access
                        </span>

                        <h2>
                            Welcome back,
                            <br />
                            Administrator
                        </h2>

                        <p>
                            Manage your library, members, reservations,
                            memberships and payments from one secure
                            administrative dashboard.
                        </p>

                    </div>

                    <div className="admin-features">

                        <div className="admin-feature">

                            <div className="feature-icon">
                                <i className="fa-solid fa-chart-line"></i>
                            </div>

                            <div>
                                <h3>Dashboard Analytics</h3>
                                <p>
                                    Monitor library activity and performance.
                                </p>
                            </div>

                        </div>

                        <div className="admin-feature">

                            <div className="feature-icon">
                                <i className="fa-solid fa-users"></i>
                            </div>

                            <div>
                                <h3>Member Management</h3>
                                <p>
                                    Manage students and membership details.
                                </p>
                            </div>

                        </div>

                        <div className="admin-feature">

                            <div className="feature-icon">
                                <i className="fa-solid fa-chair"></i>
                            </div>

                            <div>
                                <h3>Seat Reservations</h3>
                                <p>
                                    Track and manage library seat bookings.
                                </p>
                            </div>

                        </div>

                        <div className="admin-feature">

                            <div className="feature-icon">
                                <i className="fa-solid fa-credit-card"></i>
                            </div>

                            <div>
                                <h3>Payment Monitoring</h3>
                                <p>
                                    View memberships and payment activity.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

                {/* =========================
                    RIGHT SIDE
                ========================== */}
                <div className="admin-login-right">

                    <div className="login-card">

                        <div className="login-heading">

                            <div className="login-icon">
                                <i className="fa-solid fa-user-shield"></i>
                            </div>

                            <h2>Admin Login</h2>

                            <p>
                                Sign in to access the administration panel
                            </p>

                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="login-error">

                                <i className="fa-solid fa-circle-exclamation"></i>

                                <span>{error}</span>

                            </div>
                        )}

                        <form onSubmit={handleSubmit}>

                            {/* Email */}
                            <div className="form-group">

                                <label htmlFor="admin-email">
                                    Email Address
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-regular fa-envelope"></i>

                                    <input
                                        id="admin-email"
                                        type="email"
                                        placeholder="Enter admin email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        autoComplete="email"
                                        disabled={loading}
                                    />

                                </div>

                            </div>

                            {/* Password */}
                            <div className="form-group">

                                <label htmlFor="admin-password">
                                    Password
                                </label>

                                <div className="input-wrapper">

                                    <i className="fa-solid fa-lock"></i>

                                    <input
                                        id="admin-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter admin password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        disabled={loading}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        <i
                                            className={
                                                showPassword
                                                    ? "fa-solid fa-eye-slash"
                                                    : "fa-solid fa-eye"
                                            }
                                        ></i>
                                    </button>

                                </div>

                            </div>

                            {/* Remember + Forgot */}
                            <div className="login-options">

                                <label className="remember-option">

                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(
                                                e.target.checked
                                            )
                                        }
                                        disabled={loading}
                                    />

                                    <span className="custom-checkbox"></span>

                                    <span>Remember me</span>

                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="forgot-link"
                                >
                                    Forgot Password?
                                </Link>

                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="admin-login-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="login-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-right-to-bracket"></i>
                                        Sign In to Admin Panel
                                    </>
                                )}

                            </button>

                        </form>

                        {/* Demo Credentials */}
                        <div className="demo-credentials">

                            <div className="demo-title">
                                <i className="fa-solid fa-circle-info"></i>
                                Demo Admin Credentials
                            </div>

                            <div className="credential-row">
                                <span>Email</span>
                                <strong>
                                    admin@libraspace.com
                                </strong>
                            </div>

                            <div className="credential-row">
                                <span>Password</span>
                                <strong>
                                    admin123
                                </strong>
                            </div>

                        </div>

                        {/* Back Links */}
                        <div className="login-bottom-links">

                            <Link to="/">
                                <i className="fa-solid fa-arrow-left"></i>
                                Back to LibraSpace
                            </Link>

                            <span className="link-divider">|</span>

                            <Link to="/login">
                                Student Login
                            </Link>

                        </div>

                        {/* Security Note */}
                        <div className="security-note">

                            <i className="fa-solid fa-lock"></i>

                            <span>
                                Secure administrator authentication
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminLogin;