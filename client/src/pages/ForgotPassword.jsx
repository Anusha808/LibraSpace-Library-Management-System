import { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");

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
       HANDLE EMAIL CHANGE
       ===================================================== */

    const handleEmailChange = (e) => {

        setEmail(e.target.value);

        setError("");
        setMessage("");
    };


    /* =====================================================
       HANDLE SUBMIT
       ===================================================== */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setMessage("");

        if (!email.trim()) {

            setError(
                "Please enter your registered email address."
            );

            return;
        }

        setLoading(true);

        /*
         * Password reset backend can be connected here later.
         * Currently displaying the reset request message.
         */

        setTimeout(() => {

            setMessage(
                "If this email is registered, a password reset link will be sent."
            );

            setLoading(false);

        }, 1000);
    };


    return (

        <div
            className="forgot-page"
            onMouseMove={handleMouseMove}
        >

            {/* =================================================
                FLOATING BUBBLES
                ================================================= */}

            <div className="forgot-floating-bubble forgot-bubble-one"></div>

            <div className="forgot-floating-bubble forgot-bubble-two"></div>

            <div className="forgot-floating-bubble forgot-bubble-three"></div>

            <div className="forgot-floating-bubble forgot-bubble-four"></div>


            {/* =================================================
                FORGOT PASSWORD CARD
                ================================================= */}

            <div className="forgot-card">


                {/* =================================================
                    LOGO
                    ================================================= */}

                <div className="forgot-logo">

                    <span className="forgot-logo-icon">
                        📚
                    </span>

                    <span>
                        LibraSpace
                    </span>

                </div>


                {/* =================================================
                    SECURITY ICON
                    ================================================= */}

                <div className="forgot-icon">

                    <span>
                        🔐
                    </span>

                </div>


                {/* =================================================
                    TITLE
                    ================================================= */}

                <h1>
                    Forgot Password?
                </h1>


                {/* =================================================
                    SUBTITLE
                    ================================================= */}

                <p className="forgot-subtitle">

                    Don't worry! Enter your registered email
                    address and we'll help you reset your password.

                </p>


                {/* =================================================
                    SUCCESS MESSAGE
                    ================================================= */}

                {message && (

                    <div className="forgot-success">

                        <span className="forgot-message-icon">
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

                    <div className="forgot-error">

                        <span className="forgot-message-icon">
                            ⚠
                        </span>

                        <span>
                            {error}
                        </span>

                    </div>

                )}


                {/* =================================================
                    FORM
                    ================================================= */}

                <form onSubmit={handleSubmit}>


                    <div className="forgot-form-group">

                        <label htmlFor="forgot-email">
                            Email Address
                        </label>


                        <div className="forgot-input-wrapper">

                            <span className="forgot-input-icon">
                                ✉
                            </span>


                            <input
                                id="forgot-email"
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />

                        </div>

                    </div>


                    {/* =================================================
                        SUBMIT BUTTON
                        ================================================= */}

                    <button
                        type="submit"
                        className="forgot-submit"
                        disabled={loading}
                    >

                        {loading ? (

                            <>

                                <span className="forgot-spinner"></span>

                                Sending...

                            </>

                        ) : (

                            <>

                                Send Reset Link

                                <span className="forgot-arrow">
                                    →
                                </span>

                            </>

                        )}

                    </button>

                </form>


                {/* =================================================
                    LOGIN LINK
                    ================================================= */}

                <p className="forgot-login">

                    Remember your password?

                    {" "}

                    <Link to="/login">
                        Back to Login
                    </Link>

                </p>


                {/* =================================================
                    HOME
                    ================================================= */}

                <Link
                    to="/"
                    className="forgot-back-home"
                >

                    <span>
                        ←
                    </span>

                    Back to Home

                </Link>


                {/* =================================================
                    BOTTOM DECORATION
                    ================================================= */}

                <div className="forgot-decoration">

                    <span></span>

                    <span></span>

                    <span></span>

                </div>

            </div>

        </div>
    );
}

export default ForgotPassword;