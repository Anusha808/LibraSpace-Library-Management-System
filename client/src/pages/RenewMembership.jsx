import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./RenewMembership.css";

function RenewMembership() {

    const navigate = useNavigate();

    const API_BASE_URL = "http://localhost:5000";

    // =====================================================
    // STATES
    // =====================================================

    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [membership, setMembership] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = () => {
        return localStorage.getItem("token");
    };


    // =====================================================
    // GET CURRENT USER
    // =====================================================

    const getCurrentUser = () => {

        try {

            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                return JSON.parse(savedUser);
            }

        } catch (err) {

            console.error(
                "Unable to read saved user:",
                err
            );
        }

        return null;
    };


    // =====================================================
    // LOAD RAZORPAY SCRIPT
    // =====================================================

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            if (typeof window.Razorpay === "function") {
                resolve(true);
                return;
            }

            const existingScript =
                document.querySelector(
                    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                );

            if (existingScript) {

                const checkLoaded = () => {

                    if (
                        typeof window.Razorpay ===
                        "function"
                    ) {
                        cleanup();
                        resolve(true);
                    }
                };

                const handleError = () => {
                    cleanup();
                    resolve(false);
                };

                const cleanup = () => {

                    existingScript.removeEventListener(
                        "load",
                        checkLoaded
                    );

                    existingScript.removeEventListener(
                        "error",
                        handleError
                    );
                };

                existingScript.addEventListener(
                    "load",
                    checkLoaded
                );

                existingScript.addEventListener(
                    "error",
                    handleError
                );

                // In case it has already finished loading
                setTimeout(checkLoaded, 100);

                return;
            }

            const script = document.createElement("script");

            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";

            script.async = true;

            script.onload = () => {
                resolve(true);
            };

            script.onerror = () => {
                resolve(false);
            };

            document.body.appendChild(script);
        });
    };


    // =====================================================
    // LOAD MEMBERSHIP PLANS
    // =====================================================

    const loadPlans = async (token) => {

        const response = await fetch(
            `${API_BASE_URL}/api/membership-plans`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },

                cache: "no-store"
            }
        );

        const data = await response.json();

        console.log(
            "Membership plans response:",
            data
        );

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load membership plans."
            );
        }

        const fetchedPlans =
            Array.isArray(data.plans)
                ? data.plans
                : [];

        setPlans(fetchedPlans);

        if (fetchedPlans.length > 0) {
            setSelectedPlan(fetchedPlans[0]);
        }

        return fetchedPlans;
    };


    // =====================================================
    // LOAD CURRENT MEMBERSHIP
    // =====================================================

    const loadMembership = async (token) => {

        const response = await fetch(
            `${API_BASE_URL}/api/memberships/my`,
            {
                method: "GET",

                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },

                cache: "no-store"
            }
        );

        const data = await response.json();

        console.log(
            "Current membership response:",
            data
        );

        /*
         * Supported response:
         *
         * {
         *   success: true,
         *   membership: {...}
         * }
         *
         * or:
         *
         * {
         *   success: true,
         *   membership: null
         * }
         */

        if (
            response.ok ||
            response.status === 404
        ) {

            const currentMembership =
                data.membership ||
                data.data?.membership ||
                null;

            setMembership(
                currentMembership
            );

            return currentMembership;
        }

        throw new Error(
            data.message ||
            "Unable to load membership details."
        );
    };


    // =====================================================
    // LOAD PAGE DATA
    // =====================================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");
                setMessage("");

                const token = getToken();

                if (!token) {

                    setError(
                        "Please login to continue."
                    );

                    return;
                }

                await Promise.all([
                    loadPlans(token),
                    loadMembership(token)
                ]);

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


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice = (price) => {

        const value = Number(price || 0);

        if (!Number.isFinite(value)) {
            return "0";
        }

        return value.toLocaleString("en-IN");
    };


    // =====================================================
    // FORMAT DURATION
    // =====================================================

    const formatDuration = (days) => {

        const duration = Number(days || 0);

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


    // =====================================================
    // CALCULATE NEW EXPIRY DATE
    // =====================================================

    const calculateExpiryDate = () => {

        if (!selectedPlan) {
            return null;
        }

        let startDate = new Date();

        /*
         * For an active membership that has not expired,
         * extend from the current expiry date.
         */

        if (
            membership &&
            membership.status === "active" &&
            membership.expiryDate
        ) {

            const currentExpiry =
                new Date(
                    membership.expiryDate
                );

            if (
                !Number.isNaN(
                    currentExpiry.getTime()
                ) &&
                currentExpiry > new Date()
            ) {

                startDate = currentExpiry;
            }
        }

        const expiryDate =
            new Date(startDate);

        expiryDate.setDate(
            expiryDate.getDate() +
            Number(
                selectedPlan.durationDays || 0
            )
        );

        return expiryDate;
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "—";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    // =====================================================
    // SELECT PLAN
    // =====================================================

    const handlePlanSelect = (plan) => {

        setSelectedPlan(plan);

        setMessage("");
        setError("");
    };


    // =====================================================
    // VERIFY PAYMENT
    // =====================================================

    const verifyPayment = async (
        paymentResponse,
        token
    ) => {

        try {

            // =================================================
            // GET VALUES FROM RAZORPAY
            // =================================================

            const razorpayOrderId =
                paymentResponse?.razorpay_order_id;

            const razorpayPaymentId =
                paymentResponse?.razorpay_payment_id;

            const razorpaySignature =
                paymentResponse?.razorpay_signature;


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "=========================================="
            );

            console.log(
                "RAZORPAY PAYMENT RESPONSE"
            );

            console.log(
                "razorpay_order_id:",
                razorpayOrderId
            );

            console.log(
                "razorpay_payment_id:",
                razorpayPaymentId
            );

            console.log(
                "razorpay_signature:",
                razorpaySignature
                    ? "RECEIVED"
                    : "MISSING"
            );

            console.log(
                "=========================================="
            );


            // =================================================
            // VALIDATION
            // =================================================

            if (
                !razorpayOrderId ||
                !razorpayPaymentId ||
                !razorpaySignature
            ) {

                throw new Error(
                    "Razorpay returned an incomplete payment response. Please try again."
                );
            }


            setMessage(
                "Payment completed. Verifying payment..."
            );

            setError("");


            // =================================================
            // SEND TO BACKEND
            // =================================================

            const verifyResponse =
                await fetch(
                    `${API_BASE_URL}/api/payments/verify`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            razorpay_order_id:
                                razorpayOrderId,

                            razorpay_payment_id:
                                razorpayPaymentId,

                            razorpay_signature:
                                razorpaySignature

                        })
                    }
                );


            const verifyData =
                await verifyResponse.json();


            console.log(
                "Payment verification response:",
                verifyData
            );


            if (!verifyResponse.ok) {

                throw new Error(
                    verifyData.message ||
                    "Payment verification failed."
                );
            }


            if (!verifyData.success) {

                throw new Error(
                    verifyData.message ||
                    "Payment verification failed."
                );
            }


            // =================================================
            // SUCCESS
            // =================================================

            setProcessing(false);
            setError("");

            setMessage(
                verifyData.message ||
                "Payment successful! Your membership has been updated."
            );


            if (
                verifyData.membership
            ) {

                setMembership(
                    verifyData.membership
                );
            }


            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate(
                    "/membership"
                );

            }, 2200);


        } catch (err) {

            console.error(
                "Payment verification error:",
                err
            );

            setProcessing(false);
            setMessage("");

            setError(
                err.message ||
                "Payment verification failed."
            );
        }
    };


    // =====================================================
    // HANDLE PAYMENT
    // =====================================================

    const handlePayment = async () => {

        try {

            setProcessing(true);
            setMessage("");
            setError("");


            // =================================================
            // TOKEN
            // =================================================

            const token =
                getToken();


            if (!token) {

                throw new Error(
                    "Please login to continue."
                );
            }


            // =================================================
            // PLAN
            // =================================================

            if (
                !selectedPlan?._id
            ) {

                throw new Error(
                    "Please select a membership plan."
                );
            }


            // =================================================
            // AMOUNT
            // =================================================

            const amount =
                Number(
                    selectedPlan.price
                );


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                throw new Error(
                    "The selected membership plan has an invalid price."
                );
            }


            // =================================================
            // RAZORPAY SCRIPT
            // =================================================

            console.log(
                "Loading Razorpay Checkout..."
            );

            const razorpayLoaded =
                await loadRazorpayScript();


            if (!razorpayLoaded) {

                throw new Error(
                    "Unable to load Razorpay Checkout."
                );
            }


            if (
                typeof window.Razorpay !==
                "function"
            ) {

                throw new Error(
                    "Razorpay Checkout is not available."
                );
            }


            // =================================================
            // CREATE ORDER
            // =================================================

            console.log(
                "Creating Razorpay order..."
            );


            /*
             * IMPORTANT:
             * This is JavaScript.
             * JSON.stringify() belongs here.
             */

            const orderResponse =
                await fetch(
                    `${API_BASE_URL}/api/payments/create-order`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            amount: amount,

                            description:
                                membership
                                    ? `${selectedPlan.name} Membership Renewal`
                                    : `${selectedPlan.name} Membership`,

                            duration:
                                `${selectedPlan.durationDays} days`,

                            membership:
                                membership?._id ||
                                null,

                            planId:
                                selectedPlan._id

                        })
                    }
                );


            const orderData =
                await orderResponse.json();


            console.log(
                "Razorpay order response:",
                orderData
            );


            if (!orderResponse.ok) {

                throw new Error(
                    orderData.message ||
                    "Unable to create Razorpay order."
                );
            }


            if (
                !orderData.success ||
                !orderData.orderId ||
                !orderData.keyId
            ) {

                throw new Error(
                    "Invalid Razorpay order response."
                );
            }


            // =================================================
            // USER DETAILS
            // =================================================

            const currentUser =
                getCurrentUser();


            // =================================================
            // RAZORPAY OPTIONS
            // =================================================

            const options = {

                key:
                    orderData.keyId,

                amount:
                    orderData.amount,

                currency:
                    orderData.currency ||
                    "INR",

                name:
                    "LibraSpace Library",

                description:
                    membership
                        ? `${selectedPlan.name} Membership Renewal`
                        : `${selectedPlan.name} Membership`,

                order_id:
                    orderData.orderId,


                // =================================================
                // PREFILL
                // =================================================

                prefill: {

                    name:
                        currentUser?.name ||
                        "",

                    email:
                        currentUser?.email ||
                        "",

                    contact:
                        currentUser?.phone ||
                        ""
                },


                // =================================================
                // NOTES
                // =================================================

                notes: {

                    userId:
                        String(
                            currentUser?._id ||
                            currentUser?.id ||
                            ""
                        ),

                    membershipId:
                        String(
                            membership?._id ||
                            ""
                        ),

                    planId:
                        String(
                            selectedPlan._id
                        )
                },


                // =================================================
                // THEME
                // =================================================

                theme: {

                    color:
                        "#4f8fe8"
                },


                // =================================================
                // SUCCESS HANDLER
                // =================================================

                handler:
                    async (paymentResponse) => {

                        console.log(
                            "========== RAZORPAY HANDLER =========="
                        );


                        console.log(
                            "Complete response:",
                            paymentResponse
                        );


                        console.log(
                            "Order ID:",
                            paymentResponse
                                ?.razorpay_order_id
                        );


                        console.log(
                            "Payment ID:",
                            paymentResponse
                                ?.razorpay_payment_id
                        );


                        console.log(
                            "Signature:",
                            paymentResponse
                                ?.razorpay_signature
                                ? "RECEIVED"
                                : "MISSING"
                        );


                        console.log(
                            "======================================"
                        );


                        await verifyPayment(
                            paymentResponse,
                            token
                        );
                    },


                // =================================================
                // MODAL
                // =================================================

                modal: {

                    ondismiss:
                        () => {

                            console.log(
                                "Razorpay Checkout closed."
                            );

                            setProcessing(false);

                            setError(
                                "Payment window was closed."
                            );
                        }
                }
            };


            // =================================================
            // DEBUG
            // =================================================

            console.log(
                "Razorpay loaded:",
                !!window.Razorpay
            );

            console.log(
                "Razorpay Key ID:",
                orderData.keyId
            );

            console.log(
                "Razorpay Order ID:",
                orderData.orderId
            );

            console.log(
                "Selected Plan:",
                selectedPlan
            );

            console.log(
                "Selected Plan ID:",
                selectedPlan._id
            );

            console.log(
                "Existing Membership:",
                membership?._id ||
                "NEW MEMBERSHIP"
            );

            console.log(
                "Payment Amount:",
                amount
            );


            // =================================================
            // CREATE RAZORPAY INSTANCE
            // =================================================

            const razorpay =
                new window.Razorpay(
                    options
                );


            // =================================================
            // PAYMENT FAILED EVENT
            // =================================================

            razorpay.on(
                "payment.failed",
                async (response) => {

                    console.error(
                        "=========================================="
                    );

                    console.error(
                        "RAZORPAY PAYMENT FAILED"
                    );

                    console.error(
                        response
                    );

                    console.error(
                        "=========================================="
                    );


                    try {

                        await fetch(
                            `${API_BASE_URL}/api/payments/failed`,
                            {
                                method: "POST",

                                headers: {

                                    Authorization:
                                        `Bearer ${token}`,

                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    razorpayOrderId:
                                        orderData.orderId,

                                    razorpayPaymentId:
                                        response
                                            ?.error
                                            ?.metadata
                                            ?.payment_id ||
                                        "",

                                    error:
                                        response
                                            ?.error
                                            ?.description ||
                                        "Payment failed"

                                })
                            }
                        );

                    } catch (failedError) {

                        console.error(
                            "Unable to record failed payment:",
                            failedError
                        );
                    }


                    setProcessing(false);

                    setMessage("");

                    setError(
                        response
                            ?.error
                            ?.description ||
                        "Payment failed. Please try again."
                    );
                }
            );


            // =================================================
            // OPEN RAZORPAY
            // =================================================

            console.log(
                "Opening Razorpay Checkout..."
            );

            razorpay.open();

        } catch (err) {

            console.error(
                "Razorpay payment error:",
                err
            );

            setProcessing(false);

            setMessage("");

            setError(
                err.message ||
                "Unable to start Razorpay payment."
            );
        }
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

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


                        <button
                            type="button"
                            className="renew-logout"
                            onClick={handleLogout}
                        >
                            ↪ Logout
                        </button>

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


    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <div className="renew-page">

            {/* =================================================
                SIDEBAR
            ================================================== */}

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


                    <button
                        type="button"
                        className="renew-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
            ================================================== */}

            <div className="renew-content">

                {/* =================================================
                    TOPBAR
                ================================================== */}

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


                {/* =================================================
                    MAIN
                ================================================== */}

                <main className="renew-main">

                    {/* =================================================
                        BREADCRUMB
                    ================================================== */}

                    <div className="renew-breadcrumb">

                        <Link to="/dashboard">
                            Dashboard
                        </Link>

                        <span>
                            /
                        </span>

                        <Link to="/membership">
                            Membership
                        </Link>

                        <span>
                            /
                        </span>

                        <strong>
                            Renew
                        </strong>

                    </div>


                    {/* =================================================
                        HEADER
                    ================================================== */}

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


                    {/* =================================================
                        MEMBERSHIP NOTICE
                    ================================================== */}

                    <section className="renew-notice">

                        <div className="renew-notice-icon">

                            {membership ? "✓" : "ℹ️"}

                        </div>


                        <div>

                            <strong>

                                {
                                    membership
                                        ? "Current Membership Found"
                                        : "New Membership Purchase"
                                }

                            </strong>


                            <p>

                                {
                                    membership
                                        ? "Your payment will extend your existing membership."
                                        : "No membership exists for this account yet. After successful payment, LibraSpace will create your membership automatically."
                                }

                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        PLAN + PAYMENT
                    ================================================== */}

                    <section className="renew-layout">

                        {/* =================================================
                            PLANS
                        ================================================== */}

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
                                            selectedPlan?._id === plan._id
                                                ? "renew-plan selected"
                                                : "renew-plan"
                                        }
                                        onClick={() =>
                                            handlePlanSelect(plan)
                                        }
                                        disabled={processing}
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


                            {/* =================================================
                                BENEFITS
                            ================================================== */}

                            {selectedPlan && (

                                <div className="renew-benefits">

                                    <span>
                                        INCLUDED WITH YOUR MEMBERSHIP
                                    </span>


                                    <div>

                                        {
                                            Array.isArray(
                                                selectedPlan.features
                                            ) &&
                                            selectedPlan.features.map(
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
                                            )
                                        }

                                    </div>

                                </div>
                            )}

                        </div>


                        {/* =================================================
                            PAYMENT SUMMARY
                        ================================================== */}

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

                                                {
                                                    membership
                                                        ? (
                                                            membership.status
                                                                ?.charAt(0)
                                                                ?.toUpperCase() +
                                                            membership.status
                                                                ?.slice(1)
                                                        )
                                                        : "New Membership"
                                                }

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Plan Type
                                            </span>

                                            <strong>
                                                {selectedPlan.planType}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Validity
                                            </span>

                                            <strong>

                                                {selectedPlan.durationDays}
                                                {" "}
                                                Days

                                            </strong>

                                        </div>


                                        <div>

                                            <span>

                                                {
                                                    membership
                                                        ? "New Expiry Date"
                                                        : "Membership Start"
                                                }

                                            </span>


                                            <strong>

                                                {
                                                    membership
                                                        ? formatDate(
                                                            calculateExpiryDate()
                                                        )
                                                        : formatDate(
                                                            new Date()
                                                        )
                                                }

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


                                    {/* =================================================
                                        PAYMENT BUTTON
                                    ================================================== */}

                                    <button
                                        type="button"
                                        className="renew-payment-button"
                                        onClick={handlePayment}
                                        disabled={
                                            processing ||
                                            !selectedPlan
                                        }
                                    >

                                        {
                                            processing
                                                ? "Processing..."
                                                : membership
                                                    ? "Proceed to Payment"
                                                    : "Pay & Get Membership"
                                        }

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


                    {/* =================================================
                        SUCCESS / ERROR
                    ================================================== */}

                    {(message || error) && (

                        <section className="renew-notice">

                            <div className="renew-notice-icon">

                                {
                                    message
                                        ? "✓"
                                        : "⚠️"
                                }

                            </div>


                            <div>

                                <strong>

                                    {
                                        message
                                            ? "Payment Status"
                                            : "Payment Error"
                                    }

                                </strong>


                                <p>

                                    {
                                        message ||
                                        error
                                    }

                                </p>

                            </div>

                        </section>

                    )}


                    {/* =================================================
                        INFORMATION
                    ================================================== */}

                    <section className="renew-notice">

                        <div className="renew-notice-icon">
                            💡
                        </div>


                        <div>

                            <strong>
                                How payment works
                            </strong>


                            <p>
                                Select your membership plan and
                                continue with Razorpay. For a new
                                member, successful payment creates
                                the membership. For an existing
                                member, successful payment extends
                                the membership. The LibraSpace
                                backend verifies the Razorpay
                                payment before updating membership
                                details.
                            </p>

                        </div>

                    </section>

                </main>


                {/* =================================================
                    FOOTER
                ================================================== */}

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