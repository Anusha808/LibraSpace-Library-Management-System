import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./RenewMembership.css";

function RenewMembership() {

    const navigate = useNavigate();

    const [selectedPlan, setSelectedPlan] = useState("monthly");

    const plans = {
        monthly: {
            name: "Premium Reader",
            price: 499,
            duration: "1 Month",
            validity: "30 Days"
        },
        quarterly: {
            name: "Premium Reader",
            price: 1299,
            duration: "3 Months",
            validity: "90 Days"
        },
        yearly: {
            name: "Premium Reader",
            price: 4499,
            duration: "1 Year",
            validity: "365 Days"
        }
    };

    const currentPlan = plans[selectedPlan];

    const handlePayment = () => {

        alert(
            `Proceeding to payment for ${currentPlan.duration} membership - ₹${currentPlan.price}`
        );

        // Payment gateway will be integrated here later.
    };

    return (
        <div className="renew-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="renew-sidebar">

                <div className="renew-sidebar-logo">

                    <div className="renew-logo-icon">
                        📚
                    </div>

                    <div>
                        <strong>LibraSpace</strong>
                        <span>Smart Library</span>
                    </div>

                </div>


                <div className="renew-menu-title">
                    MAIN MENU
                </div>


                <nav className="renew-sidebar-nav">

                    <Link to="/dashboard">
                        <span>⌂</span>
                        Dashboard
                    </Link>

                    <Link to="/seats">
                        <span>💺</span>
                        Reserve Seat
                    </Link>

                    <Link to="/reservations">
                        <span>▣</span>
                        My Reservations
                    </Link>

                    <Link to="/membership">
                        <span>♛</span>
                        Membership
                    </Link>

                </nav>


                <div className="renew-menu-title">
                    ACCOUNT
                </div>


                <nav className="renew-sidebar-nav">

                    <Link to="/profile">
                        <span>◯</span>
                        My Profile
                    </Link>

                    <Link to="/payment-history">
                        <span>▤</span>
                        Payment History
                    </Link>

                </nav>


                <div className="renew-sidebar-bottom">

                    <div className="renew-library-status">

                        <span className="renew-status-dot"></span>

                        <div>
                            <strong>Library Open</strong>
                            <small>8:00 AM - 10:00 PM</small>
                        </div>

                    </div>


                    <Link
                        to="/"
                        className="renew-logout"
                    >
                        ↪ Logout
                    </Link>

                </div>

            </aside>


            {/* ================= MAIN CONTENT ================= */}

            <div className="renew-content">

                {/* TOPBAR */}

                <header className="renew-topbar">

                    <div>

                        <span className="renew-top-label">
                            STUDENT PORTAL
                        </span>

                        <h1>
                            Renew Membership
                        </h1>

                    </div>


                    <Link
                        to="/profile"
                        className="renew-user"
                    >

                        <div className="renew-user-avatar">
                            A
                        </div>

                        <div className="renew-user-info">

                            <strong>
                                Student
                            </strong>

                            <span>
                                Library Member
                            </span>

                        </div>

                    </Link>

                </header>


                {/* MAIN */}

                <main className="renew-main">

                    {/* BREADCRUMB */}

                    <div className="renew-breadcrumb">

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span>/</span>

                        <Link to="/membership">
                            Membership
                        </Link>

                        <span>/</span>

                        <strong>
                            Renew
                        </strong>

                    </div>


                    {/* PAGE HEADER */}

                    <section className="renew-page-header">

                        <div>

                            <span>
                                MEMBERSHIP RENEWAL
                            </span>

                            <h2>
                                Renew Your Membership
                            </h2>

                            <p>
                                Choose a membership duration and continue
                                to secure uninterrupted library access.
                            </p>

                        </div>

                    </section>


                    {/* ================= RENEWAL AREA ================= */}

                    <section className="renew-layout">

                        {/* PLAN SELECTION */}

                        <div className="renew-plans-card">

                            <div className="renew-card-heading">

                                <div>

                                    <span>
                                        CHOOSE YOUR PLAN
                                    </span>

                                    <h3>
                                        Membership Duration
                                    </h3>

                                </div>

                            </div>


                            {/* MONTHLY */}

                            <button
                                type="button"
                                className={
                                    selectedPlan === "monthly"
                                        ? "renew-plan selected"
                                        : "renew-plan"
                                }
                                onClick={() =>
                                    setSelectedPlan("monthly")
                                }
                            >

                                <div className="renew-radio">

                                    {selectedPlan === "monthly" && (
                                        <span></span>
                                    )}

                                </div>

                                <div className="renew-plan-info">

                                    <strong>
                                        Monthly
                                    </strong>

                                    <span>
                                        30 days membership
                                    </span>

                                </div>

                                <div className="renew-plan-price">

                                    <strong>
                                        ₹499
                                    </strong>

                                    <span>
                                        / month
                                    </span>

                                </div>

                            </button>


                            {/* QUARTERLY */}

                            <button
                                type="button"
                                className={
                                    selectedPlan === "quarterly"
                                        ? "renew-plan selected"
                                        : "renew-plan"
                                }
                                onClick={() =>
                                    setSelectedPlan("quarterly")
                                }
                            >

                                <div className="renew-radio">

                                    {selectedPlan === "quarterly" && (
                                        <span></span>
                                    )}

                                </div>

                                <div className="renew-plan-info">

                                    <strong>
                                        Quarterly
                                    </strong>

                                    <span>
                                        90 days membership
                                    </span>

                                </div>

                                <div className="renew-plan-price">

                                    <strong>
                                        ₹1,299
                                    </strong>

                                    <span>
                                        / 3 months
                                    </span>

                                </div>

                            </button>


                            {/* YEARLY */}

                            <button
                                type="button"
                                className={
                                    selectedPlan === "yearly"
                                        ? "renew-plan selected"
                                        : "renew-plan"
                                }
                                onClick={() =>
                                    setSelectedPlan("yearly")
                                }
                            >

                                <div className="renew-radio">

                                    {selectedPlan === "yearly" && (
                                        <span></span>
                                    )}

                                </div>

                                <div className="renew-plan-info">

                                    <strong>
                                        Yearly
                                    </strong>

                                    <span>
                                        365 days membership
                                    </span>

                                </div>

                                <div className="renew-plan-price">

                                    <strong>
                                        ₹4,499
                                    </strong>

                                    <span>
                                        / year
                                    </span>

                                </div>

                            </button>


                            {/* BENEFITS */}

                            <div className="renew-benefits">

                                <span>
                                    INCLUDED WITH YOUR MEMBERSHIP
                                </span>

                                <div>
                                    <p>✓ Seat reservation access</p>
                                    <p>✓ Priority booking</p>
                                    <p>✓ Reservation reminders</p>
                                    <p>✓ Library facility access</p>
                                </div>

                            </div>

                        </div>


                        {/* PAYMENT SUMMARY */}

                        <aside className="renew-summary-card">

                            <div className="renew-summary-header">

                                <span>
                                    ORDER SUMMARY
                                </span>

                                <h3>
                                    Renewal Details
                                </h3>

                            </div>


                            <div className="renew-summary-membership">

                                <div className="renew-summary-icon">
                                    ♛
                                </div>

                                <div>

                                    <strong>
                                        Premium Reader
                                    </strong>

                                    <span>
                                        {currentPlan.duration}
                                    </span>

                                </div>

                            </div>


                            <div className="renew-summary-details">

                                <div>

                                    <span>
                                        Current Membership
                                    </span>

                                    <strong>
                                        Active
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Selected Duration
                                    </span>

                                    <strong>
                                        {currentPlan.duration}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        New Validity
                                    </span>

                                    <strong>
                                        {currentPlan.validity}
                                    </strong>

                                </div>

                            </div>


                            <div className="renew-summary-divider"></div>


                            <div className="renew-total">

                                <span>
                                    Total Amount
                                </span>

                                <strong>
                                    ₹{currentPlan.price.toLocaleString("en-IN")}
                                </strong>

                            </div>


                            <button
                                type="button"
                                className="renew-payment-button"
                                onClick={handlePayment}
                            >
                                Proceed to Payment
                                <span>→</span>
                            </button>


                            <Link
                                to="/membership"
                                className="renew-cancel"
                            >
                                ← Back to Membership
                            </Link>


                            <div className="renew-secure">

                                <span>
                                    🔒
                                </span>

                                <p>
                                    Secure payment processing
                                </p>

                            </div>

                        </aside>

                    </section>


                    {/* ================= NOTICE ================= */}

                    <section className="renew-notice">

                        <div className="renew-notice-icon">
                            💡
                        </div>

                        <div>

                            <strong>
                                How renewal works
                            </strong>

                            <p>
                                Your new membership period will begin after
                                successful payment. Your existing membership
                                remains active until its current expiry date.
                            </p>

                        </div>

                    </section>

                </main>


                {/* FOOTER */}

                <footer className="renew-footer">

                    <div>

                        <strong>
                            📚 LibraSpace
                        </strong>

                        <span>
                            Smart Library Seat Reservation &
                            Membership System
                        </span>

                    </div>

                    <span>
                        © 2026 LibraSpace
                    </span>

                </footer>

            </div>

        </div>
    );
}

export default RenewMembership;