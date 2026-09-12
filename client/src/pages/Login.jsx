import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {

        e.preventDefault();

        // Frontend login for now
        // Backend authentication will be added later

        if (email && password) {

            // Navigate to Student Dashboard
            navigate("/dashboard");

        }

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
                    Welcome Back
                </h1>


                <p className="auth-subtitle">

                    Login to manage your library reservations
                    and membership.

                </p>


                {/* LOGIN FORM */}

                <form onSubmit={handleSubmit}>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
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


                    {/* FORGOT PASSWORD */}

                    <div className="forgot-password">

                        <Link to="/forgot-password">

                            Forgot Password?

                        </Link>

                    </div>


                    {/* LOGIN BUTTON */}

                    <button
                        type="submit"
                        className="auth-btn"
                    >

                        Login

                    </button>

                </form>


                {/* REGISTER */}

                <p className="auth-switch">

                    Don't have an account?

                    {" "}

                    <Link to="/register">

                        Create Account

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

export default Login;