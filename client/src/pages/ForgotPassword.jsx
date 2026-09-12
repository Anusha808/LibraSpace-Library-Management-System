import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  return (
    <div className="forgot-page">

      <div className="forgot-card">

        {/* Logo */}
        <div className="forgot-logo">
          📚 <span>LibraSpace</span>
        </div>

        {/* Icon */}
        <div className="forgot-icon">
          🔐
        </div>

        <h1>Forgot Password?</h1>

        <p className="forgot-subtitle">
          Don't worry! Enter your registered email address
          and we'll help you reset your password.
        </p>

        {/* Form */}
        <form>

          <div className="forgot-form-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              required
            />

          </div>

          <button
            type="submit"
            className="forgot-submit"
          >
            Send Reset Link
          </button>

        </form>

        {/* Login Link */}
        <p className="forgot-login">

          Remember your password?

          {" "}

          <Link to="/login">
            Back to Login
          </Link>

        </p>

        {/* Home */}
        <Link
          to="/"
          className="forgot-back-home"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default ForgotPassword;