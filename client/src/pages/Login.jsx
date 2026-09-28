import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


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
       LOGIN
       ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            const data = await response.json();


            /* =================================================
               LOGIN ERROR
               ================================================= */

            if (!response.ok) {

                setError(
                    data.message ||
                    "Invalid email or password"
                );

                setLoading(false);

                return;
            }


            /* =================================================
               STORE JWT TOKEN
               ================================================= */

            localStorage.setItem(
                "token",
                data.token
            );


            /* =================================================
               STORE USER
               ================================================= */

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            /* =================================================
               GO TO DASHBOARD
               ================================================= */

            navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login error:",
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
                DECORATIVE BUBBLES
                ================================================= */}

            <div className="floating-bubble bubble-one"></div>

            <div className="floating-bubble bubble-two"></div>

            <div className="floating-bubble bubble-three"></div>

            <div className="floating-bubble bubble-four"></div>


            {/* =================================================
                LOGIN CARD
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
                    Welcome Back
                </h1>


                <p className="auth-subtitle">

                    Login to manage your library reservations
                    and membership.

                </p>


                {/* =================================================
                    LOGIN FORM
                    ================================================= */}

                <form onSubmit={handleSubmit}>


                    {/* =================================================
                        ERROR
                        ================================================= */}

                    {error && (

                        <div className="login-error">

                            <span className="error-icon">
                                ⚠
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


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
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
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
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
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
                                    : "👁️"
                                }

                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        FORGOT PASSWORD
                        ================================================= */}

                    <div className="forgot-password">

                        <Link to="/forgot-password">

                            Forgot Password?

                        </Link>

                    </div>


                    {/* =================================================
                        LOGIN BUTTON
                        ================================================= */}

                    <button
                        type="submit"
                        className="auth-btn"
                        disabled={loading}
                    >

                        {loading ? (

                            <>

                                <span className="loading-spinner"></span>

                                Logging in...

                            </>

                        ) : (

                            <>

                                Login

                                <span className="login-arrow">
                                    →
                                </span>

                            </>

                        )}

                    </button>

                </form>


                {/* =================================================
                    REGISTER
                    ================================================= */}

                <p className="auth-switch">

                    Don't have an account?

                    {" "}

                    <Link to="/register">

                        Create Account

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

export default Login;