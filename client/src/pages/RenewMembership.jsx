import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./RenewMembership.css";

function RenewMembership() {

    const navigate = useNavigate();

    const API_BASE_URL = "http://localhost:5000";

    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const [membership, setMembership] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // LOAD PLANS + MEMBERSHIP
    // ==========================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");

                const token =
                    localStorage.getItem("token");

                if (!token) {

                    setError(
                        "Please login to renew your membership."
                    );

                    return;
                }


                // ==========================================
                // GET MEMBERSHIP PLANS
                // ==========================================

                const plansResponse =
                    await fetch(
                        `${API_BASE_URL}/api/membership-plans`,
                        {
                            method: "GET",
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                "Content-Type":
                                    "application/json"
                            },
                            cache: "no-store"
                        }
                    );


                const plansData =
                    await plansResponse.json();


                if (!plansResponse.ok) {

                    throw new Error(
                        plansData.message ||
                        "Unable to load membership plans."
                    );
                }


                const fetchedPlans =
                    plansData.plans || [];


                setPlans(fetchedPlans);


                // Select first plan automatically
                if (fetchedPlans.length > 0) {

                    setSelectedPlan(
                        fetchedPlans[0]
                    );
                }


                // ==========================================
                // GET CURRENT MEMBERSHIP
                // ==========================================

                const membershipResponse =
                    await fetch(
                        `${API_BASE_URL}/api/memberships/my`,
                        {
                            method: "GET",
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                "Content-Type":
                                    "application/json"
                            },
                            cache: "no-store"
                        }
                    );


                const membershipData =
                    await membershipResponse.json();


                if (membershipResponse.ok) {

                    setMembership(
                        membershipData.membership ||
                        null
                    );

                } else if (
                    membershipResponse.status !== 404
                ) {

                    throw new Error(
                        membershipData.message ||
                        "Unable to load membership details."
                    );
                }

            } catch (err) {

                console.error(
                    "Renew membership loading error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load membership information."
                );

            } finally {

                setLoading(false);
            }
        };


        loadData();

    }, []);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {

        return Number(price || 0)
            .toLocaleString("en-IN");
    };


    // ==========================================
    // FORMAT DURATION
    // ==========================================

    const formatDuration = (days) => {

        const duration =
            Number(days || 0);

        if (duration === 1) {
            return "1 Day";
        }

        if (duration < 30) {
            return `${duration} Days`;
        }

        if (duration === 30) {
            return "1 Month";
        }

        if (duration < 365) {

            const months =
                Math.round(duration / 30);

            return `${months} Months`;
        }

        if (duration === 365) {
            return "1 Year";
        }

        return `${duration} Days`;
    };


    // ==========================================
    // CALCULATE NEW EXPIRY DATE
    // ==========================================

    const calculateExpiryDate = () => {

        if (!selectedPlan) {
            return null;
        }


        let startDate =
            new Date();


        if (
            membership &&
            membership.status === "active" &&
            new Date(
                membership.expiryDate
            ) > new Date()
        ) {

            startDate =
                new Date(
                    membership.expiryDate
                );
        }


        const expiryDate =
            new Date(startDate);


        expiryDate.setDate(
            expiryDate.getDate() +
            Number(
                selectedPlan.durationDays
            )
        );


        return expiryDate;
    };


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }


        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );
    };


    // ==========================================
    // SELECT PLAN
    // ==========================================

    const handlePlanSelect = (plan) => {

        setSelectedPlan(plan);

        setMessage("");
        setError("");
    };


    // ==========================================
    // PAYMENT
    // ==========================================

    const handlePayment = async () => {

        try {

            setProcessing(true);

            setMessage("");
            setError("");


            const token =
                localStorage.getItem("token");


            if (!token) {

                setError(
                    "Please login to renew your membership."
                );

                return;
            }


            if (!membership) {

                setError(
                    "No membership found. Please create a membership first."
                );

                return;
            }


            if (!selectedPlan) {

                setError(
                    "Please select a membership plan."
                );

                return;
            }


            // ==========================================
            // SEND ONLY PLAN ID
            // ==========================================

            const response =
                await fetch(
                    `${API_BASE_URL}/api/memberships/renew`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            planId:
                                selectedPlan._id
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Membership renewal failed."
                );
            }


            console.log(
                "Membership renewal response:",
                data
            );


            setMessage(
                data.message ||
                "Membership renewed successfully!"
            );


            setMembership(
                data.membership ||
                null
            );


            setTimeout(() => {

                navigate(
                    "/membership"
                );

            }, 1200);


        } catch (err) {

            console.error(
                "Membership renewal error:",
                err
            );


            setError(
                err.message ||
                "Unable to renew membership."
            );

        } finally {

            setProcessing(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div className="renew-page">

                <aside className="renew-sidebar">

                    <div className="renew-sidebar-logo">

                        <div className="renew-logo-icon">
                            📚
                        </div>

                        <div>
                            <strong>
                                LibraSpace
                            </strong>

                            <span>
                                Smart Library
                            </span>
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

                                <strong>
                                    Library Open
                                </strong>

                                <small>
                                    8:00 AM - 10:00 PM
                                </small>

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


                <div className="renew-content">

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


                    <main className="renew-main">

                        <div className="renew-loading">
                            Loading membership plans...
                        </div>

                    </main>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div className="renew-page">

            {/* ================= SIDEBAR ================= */}

            <aside className="renew-sidebar">

                <div className="renew-sidebar-logo">

                    <div className="renew-logo-icon">
                        📚
                    </div>

                    <div>

                        <strong>
                            LibraSpace
                        </strong>

                        <span>
                            Smart Library
                        </span>

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

                            <strong>
                                Library Open
                            </strong>

                            <small>
                                8:00 AM - 10:00 PM
                            </small>

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
                                Choose a membership plan and
                                continue to secure uninterrupted
                                library access.
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
                                        Membership Plans
                                    </h3>

                                </div>

                            </div>


                            {plans.length === 0 ? (

                                <div className="renew-empty">

                                    <strong>
                                        No membership plans available
                                    </strong>

                                    <span>
                                        Please contact the library
                                        administrator.
                                    </span>

                                </div>

                            ) : (

                                plans.map((plan) => (

                                    <button
                                        key={plan._id}
                                        type="button"
                                        className={
                                            selectedPlan?._id ===
                                            plan._id
                                                ? "renew-plan selected"
                                                : "renew-plan"
                                        }
                                        onClick={() =>
                                            handlePlanSelect(
                                                plan
                                            )
                                        }
                                    >

                                        <div className="renew-radio">

                                            {selectedPlan?._id ===
                                                plan._id && (
                                                <span></span>
                                            )}

                                        </div>


                                        <div className="renew-plan-info">

                                            <strong>
                                                {plan.name}
                                            </strong>

                                            <span>
                                                {formatDuration(
                                                    plan.durationDays
                                                )}
                                            </span>

                                        </div>


                                        <div className="renew-plan-price">

                                            <strong>
                                                ₹
                                                {formatPrice(
                                                    plan.price
                                                )}
                                            </strong>

                                            <span>
                                                {plan.planType}
                                            </span>

                                        </div>

                                    </button>

                                ))

                            )}


                            {/* BENEFITS */}

                            {selectedPlan && (
                                <div className="renew-benefits">

                                    <span>
                                        INCLUDED WITH YOUR MEMBERSHIP
                                    </span>

                                    <div>

                                        {selectedPlan.features?.map(
                                            (
                                                feature,
                                                index
                                            ) => (

                                                <p
                                                    key={index}
                                                >
                                                    ✓ {feature}
                                                </p>

                                            )
                                        )}

                                    </div>

                                </div>
                            )}

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


                            {selectedPlan ? (

                                <>

                                    <div className="renew-summary-membership">

                                        <div className="renew-summary-icon">
                                            ♛
                                        </div>

                                        <div>

                                            <strong>
                                                {selectedPlan.name}
                                            </strong>

                                            <span>
                                                {formatDuration(
                                                    selectedPlan.durationDays
                                                )}
                                            </span>

                                        </div>

                                    </div>


                                    <div className="renew-summary-details">

                                        <div>

                                            <span>
                                                Current Membership
                                            </span>

                                            <strong>

                                                {membership
                                                    ? membership.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      membership.status.slice(1)
                                                    : "Not Found"}

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Plan Type
                                            </span>

                                            <strong>
                                                {
                                                    selectedPlan.planType
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Validity
                                            </span>

                                            <strong>
                                                {
                                                    selectedPlan.durationDays
                                                }{" "}
                                                Days
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                New Expiry Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    calculateExpiryDate()
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="renew-summary-divider"></div>


                                    <div className="renew-total">

                                        <span>
                                            Total Amount
                                        </span>

                                        <strong>
                                            ₹
                                            {formatPrice(
                                                selectedPlan.price
                                            )}
                                        </strong>

                                    </div>


                                    <button
                                        type="button"
                                        className="renew-payment-button"
                                        onClick={
                                            handlePayment
                                        }
                                        disabled={
                                            processing ||
                                            !membership
                                        }
                                    >

                                        {processing
                                            ? "Processing..."
                                            : "Proceed to Payment"}

                                        <span>
                                            →
                                        </span>

                                    </button>

                                </>

                            ) : (

                                <div className="renew-empty">

                                    <strong>
                                        Select a membership plan
                                    </strong>

                                    <span>
                                        Choose a plan to continue.
                                    </span>

                                </div>

                            )}


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


                    {/* ================= MESSAGES ================= */}

                    {(message || error) && (

                        <section className="renew-notice">

                            <div className="renew-notice-icon">
                                {message
                                    ? "✓"
                                    : "⚠️"}
                            </div>

                            <div>

                                <strong>
                                    {message
                                        ? "Renewal Successful"
                                        : "Renewal Error"}
                                </strong>

                                <p>
                                    {message || error}
                                </p>

                            </div>

                        </section>

                    )}


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
                                Select your preferred membership
                                plan and continue with the payment.
                                After successful payment, your
                                membership dates will be updated.
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