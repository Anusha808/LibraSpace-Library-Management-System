import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
        setMessage("");
    };


    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");
        setMessage("");


        // Check password
        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match.");

            return;
        }


        // Check password length
        if (formData.password.length < 6) {

            setError("Password must contain at least 6 characters.");

            return;
        }


        // Registration successful
        setMessage("Registration successful! Redirecting to login...");


        // Temporary frontend registration
        // Backend/MongoDB will be connected later
        localStorage.setItem(
            "libraryUser",
            JSON.stringify({
                fullName: formData.fullName,
                email: formData.email
            })
        );


        // Navigate to login page after 1.5 seconds
        setTimeout(() => {

            navigate("/login");

        }, 1500);
    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* LOGO */}

                <div className="auth-logo">

                    📚

                    <span>
                        LibraSpace
                    </span>

                </div>


                {/* TITLE */}

                <h1>
                    Create Account
                </h1>


                <p className="auth-subtitle">

                    Register to reserve library seats and manage
                    your membership online.

                </p>


                {/* SUCCESS MESSAGE */}

                {message && (

                    <div className="success-message">

                        ✓ {message}

                    </div>

                )}


                {/* ERROR MESSAGE */}

                {error && (

                    <div className="error-message">

                        ⚠ {error}

                    </div>

                )}


                {/* REGISTER FORM */}

                <form onSubmit={handleSubmit}>


                    {/* FULL NAME */}

                    <div className="form-group">

                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            placeholder="Enter your full name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-eye"
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


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-eye"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >

                                {showConfirmPassword
                                    ? "🙈"
                                    : "👁️"}

                            </button>

                        </div>

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="auth-btn"
                    >

                        Create Account

                    </button>

                </form>


                {/* LOGIN LINK */}

                <p className="auth-switch">

                    Already have an account?

                    {" "}

                    <Link to="/login">

                        Login

                    </Link>

                </p>


                {/* BACK HOME */}

                <Link
                    to="/"
                    className="back-home"
                >

                    ← Back to Home

                </Link>


            </div>

        </div>
    );
}

export default Register;