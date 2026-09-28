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
    const [loading, setLoading] = useState(false);


    /* =====================================================
       MOUSE FOLLOWING EFFECT
       ===================================================== */

    const handleMouseMove = (e) => {

        const x =
            (e.clientX / window.innerWidth) * 100;

        const y =
            (e.clientY / window.innerHeight) * 100;

        document.documentElement.style.setProperty(
            "--mouse-x",
            `${x}%`
        );

        document.documentElement.style.setProperty(
            "--mouse-y",
            `${y}%`
        );
    };


    /* =====================================================
       HANDLE INPUT CHANGE
       ===================================================== */

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
        setMessage("");
    };


    /* =====================================================
       HANDLE REGISTER
       ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");


        /* =================================================
           CHECK PASSWORD MATCH
           ================================================= */

        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        /* =================================================
           CHECK PASSWORD LENGTH
           ================================================= */

        if (
            formData.password.length < 6
        ) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }


        setLoading(true);


        try {

            /* =================================================
               SEND DATA TO BACKEND
               ================================================= */

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: formData.fullName,
                        email: formData.email,
                        password: formData.password,
                        phone: ""
                    })
                }
            );


            const data =
                await response.json();


            /* =================================================
               BACKEND ERROR
               ================================================= */

            if (!response.ok) {

                setError(
                    data.message ||
                    "Registration failed. Please try again."
                );

                setLoading(false);

                return;
            }


            /* =================================================
               REGISTRATION SUCCESS
               ================================================= */

            setMessage(
                "Registration successful! Redirecting to login..."
            );


            /* =================================================
               STORE USER
               ================================================= */

            if (data.user) {

                localStorage.setItem(
                    "libraryUser",
                    JSON.stringify(data.user)
                );
            }


            /* =================================================
               REDIRECT TO LOGIN
               ================================================= */

            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                "Unable to connect to the server. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div
            className="auth-page"
            onMouseMove={handleMouseMove}
        >

            {/* =================================================
                FLOATING BUBBLES
                ================================================= */}

            <div className="floating-bubble bubble-one"></div>

            <div className="floating-bubble bubble-two"></div>

            <div className="floating-bubble bubble-three"></div>

            <div className="floating-bubble bubble-four"></div>


            {/* =================================================
                REGISTER CARD
                ================================================= */}

            <div className="auth-card">


                {/* =================================================
                    LOGO
                    ================================================= */}

                <div className="auth-logo">

                    <span className="logo-icon">
                        📚
                    </span>

                    <span>
                        LibraSpace
                    </span>

                </div>


                {/* =================================================
                    TITLE
                    ================================================= */}

                <h1>
                    Create Account
                </h1>


                <p className="auth-subtitle">

                    Register to reserve library seats
                    and manage your membership online.

                </p>


                {/* =================================================
                    SUCCESS MESSAGE
                    ================================================= */}

                {message && (

                    <div className="success-message">

                        <span className="message-icon">
                            ✓
                        </span>

                        <span>
                            {message}
                        </span>

                    </div>

                )}


                {/* =================================================
                    ERROR MESSAGE
                    ================================================= */}

                {error && (

                    <div className="error-message">

                        <span className="message-icon">
                            ⚠
                        </span>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    REGISTER FORM
                    ================================================= */}

                <form onSubmit={handleSubmit}>


                    {/* =================================================
                        FULL NAME
                        ================================================= */}

                    <div className="form-group">

                        <label htmlFor="fullName">
                            Full Name
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                👤
                            </span>

                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                placeholder="Enter your full name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* =================================================
                        EMAIL
                        ================================================= */}

                    <div className="form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                ✉
                            </span>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* =================================================
                        PASSWORD
                        ================================================= */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-wrapper">

                            <span className="input-icon">
                                🔒
                            </span>

                            <input
                                id="password"
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
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >

                                {showPassword
                                    ? "🙈"
                                    : "👁️"}

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        CONFIRM PASSWORD
                        ================================================= */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <div className="password-wrapper">

                            <span className="input-icon">
                                🔐
                            </span>

                            <input
                                id="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={
                                    formData.confirmPassword
                                }
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


                    {/* =================================================
                        REGISTER BUTTON
                        ================================================= */}

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >

                        {loading ? (

                            <>

                                <span className="loading-spinner"></span>

                                Creating Account...

                            </>

                        ) : (

                            <>

                                Create Account

                                <span className="login-arrow">
                                    →
                                </span>

                            </>

                        )}

                    </button>

                </form>


                {/* =================================================
                    LOGIN LINK
                    ================================================= */}

                <p className="auth-switch">

                    Already have an account?

                    {" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>


                {/* =================================================
                    BACK HOME
                    ================================================= */}

                <Link
                    to="/"
                    className="back-home"
                >

                    <span>
                        ←
                    </span>

                    Back to Home

                </Link>


                {/* =================================================
                    BOTTOM DECORATION
                    ================================================= */}

                <div className="auth-decoration">

                    <span></span>

                    <span></span>

                    <span></span>

                </div>

            </div>

        </div>
    );
}

export default Register;