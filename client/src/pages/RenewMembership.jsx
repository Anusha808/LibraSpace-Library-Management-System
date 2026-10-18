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

    const [selectedPlan, setSelectedPlan] =
        useState(null);

    const [membership, setMembership] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [processing, setProcessing] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


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

            const savedUser =
                localStorage.getItem("user");

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
    // LOAD RAZORPAY CHECKOUT SCRIPT
    // =====================================================

    const loadRazorpayScript = () => {

        return new Promise((resolve) => {

            // Razorpay already available
            if (
                typeof window.Razorpay ===
                "function"
            ) {

                resolve(true);

                return;

            }


            // Check whether script already exists
            const existingScript =
                document.querySelector(
                    'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
                );


            if (existingScript) {

                existingScript.addEventListener(
                    "load",
                    () => {

                        resolve(
                            typeof window.Razorpay ===
                            "function"
                        );

                    }
                );


                existingScript.addEventListener(
                    "error",
                    () => {

                        resolve(false);

                    }
                );


                return;

            }


            // Create Razorpay script
            const script =
                document.createElement("script");


            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";


            script.async = true;


            script.onload = () => {

                resolve(
                    typeof window.Razorpay ===
                    "function"
                );

            };


            script.onerror = () => {

                resolve(false);

            };


            document.body.appendChild(
                script
            );

        });

    };


    // =====================================================
    // LOAD MEMBERSHIP PLANS
    // =====================================================

    const loadPlans = async (token) => {

        const response =
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


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load membership plans."
            );

        }


        const fetchedPlans =
            Array.isArray(
                data.plans
            )
                ? data.plans
                : [];


        setPlans(
            fetchedPlans
        );


        // Select first plan automatically
        if (
            fetchedPlans.length > 0
        ) {

            setSelectedPlan(
                fetchedPlans[0]
            );

        }


        return fetchedPlans;

    };


    // =====================================================
    // LOAD CURRENT MEMBERSHIP
    // =====================================================

    const loadMembership = async (token) => {

        const response =
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


        const data =
            await response.json();


        console.log(
            "Membership API response:",
            data
        );


        let currentMembership =
            data.membership ||
            data.data?.membership ||
            null;


        if (
            !currentMembership &&
            Array.isArray(
                data.memberships
            ) &&
            data.memberships.length > 0
        ) {

            currentMembership =
                data.memberships[0];

        }


        /*
         * No membership is valid for
         * first-time purchase.
         */

        if (
            response.status === 404 ||
            currentMembership === null
        ) {

            setMembership(
                null
            );

            return null;

        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load membership details."
            );

        }


        setMembership(
            currentMembership
        );


        return currentMembership;

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


                const token =
                    getToken();


                if (!token) {

                    setError(
                        "Please login to renew your membership."
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

        const numericPrice =
            Number(price || 0);


        if (
            !Number.isFinite(
                numericPrice
            )
        ) {

            return "0";

        }


        return numericPrice.toLocaleString(
            "en-IN"
        );

    };


    // =====================================================
    // FORMAT DURATION
    // =====================================================

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
                Math.round(
                    duration / 30
                );


            return `${months} Months`;

        }


        if (duration === 365) {

            return "1 Year";

        }


        return `${duration} Days`;

    };


    // =====================================================
    // MEMBERSHIP STATUS
    // =====================================================

    const isExistingMembership =
        Boolean(
            membership &&
            membership._id
        );


    const isMembershipExpired = () => {

        if (
            !isExistingMembership ||
            !membership.expiryDate
        ) {

            return false;

        }


        const expiry =
            new Date(
                membership.expiryDate
            );


        if (
            Number.isNaN(
                expiry.getTime()
            )
        ) {

            return false;

        }


        return expiry <= new Date();

    };


    const isMembershipActive = () => {

        if (
            !isExistingMembership
        ) {

            return false;

        }


        return !isMembershipExpired();

    };


    // =====================================================
    // CALCULATE NEW EXPIRY DATE
    // =====================================================

    const calculateExpiryDate = () => {

        if (!selectedPlan) {

            return null;

        }


        let startDate =
            new Date();


        /*
         * Active membership:
         * continue from current expiry.
         *
         * Expired membership:
         * start from today.
         *
         * New membership:
         * start from today.
         */

        if (
            isExistingMembership &&
            isMembershipActive() &&
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

                startDate =
                    currentExpiry;

            }

        }


        const expiryDate =
            new Date(
                startDate
            );


        expiryDate.setDate(
            expiryDate.getDate() +
            Number(
                selectedPlan.durationDays ||
                0
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


        const parsedDate =
            new Date(date);


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

        setSelectedPlan(
            plan
        );

        setMessage("");

        setError("");

    };


    // =====================================================
    // VERIFY RAZORPAY PAYMENT
    // =====================================================

    const verifyPayment = async (
        paymentResponse,
        token
    ) => {

        try {

            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            } = paymentResponse;


            console.log(
                "=========================================="
            );

            console.log(
                "RAZORPAY SUCCESS RESPONSE"
            );

            console.log(
                "razorpay_order_id:",
                razorpay_order_id
            );

            console.log(
                "razorpay_payment_id:",
                razorpay_payment_id
            );

            console.log(
                "razorpay_signature:",
                razorpay_signature
                    ? "RECEIVED"
                    : "MISSING"
            );

            console.log(
                "=========================================="
            );


            // =================================================
            // VALIDATE RESPONSE
            // =================================================

            if (
                !razorpay_order_id ||
                !razorpay_payment_id ||
                !razorpay_signature
            ) {

                throw new Error(
                    "Razorpay returned an incomplete payment response."
                );

            }


            setMessage(
                "Payment completed. Verifying payment..."
            );


            // =================================================
            // BACKEND VERIFICATION
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

                        body:
                            JSON.stringify({

                                razorpay_order_id,

                                razorpay_payment_id,

                                razorpay_signature

                            })

                    }
                );


            const verifyData =
                await verifyResponse.json();


            console.log(
                "Payment verification response:",
                verifyData
            );


            if (
                !verifyResponse.ok
            ) {

                throw new Error(
                    verifyData.message ||
                    "Payment verification failed."
                );

            }


            if (
                !verifyData.success
            ) {

                throw new Error(
                    verifyData.message ||
                    "Payment verification failed."
                );

            }


            // =================================================
            // PAYMENT SUCCESS
            // =================================================

            setProcessing(
                false
            );

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


            setProcessing(
                false
            );

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

            setProcessing(
                true
            );

            setMessage("");

            setError("");


            const token =
                getToken();


            // =================================================
            // LOGIN CHECK
            // =================================================

            if (!token) {

                throw new Error(
                    "Please login to continue."
                );

            }


            // =================================================
            // PLAN CHECK
            // =================================================

            if (
                !selectedPlan?._id
            ) {

                throw new Error(
                    "Please select a membership plan."
                );

            }


            // =================================================
            // PRICE CHECK
            // =================================================

            const amount =
                Number(
                    selectedPlan.price
                );


            if (
                !Number.isFinite(
                    amount
                ) ||
                amount <= 0
            ) {

                throw new Error(
                    "The selected membership plan has an invalid price."
                );

            }


            // =================================================
            // LOAD RAZORPAY
            // =================================================

            setMessage(
                "Preparing secure payment..."
            );


            const razorpayLoaded =
                await loadRazorpayScript();


            if (!razorpayLoaded) {

                throw new Error(
                    "Unable to load Razorpay Checkout. Please check your internet connection."
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
            // CREATE RAZORPAY ORDER
            // =================================================

            setMessage(
                "Creating secure payment order..."
            );


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

                        body:
                            JSON.stringify({

                                amount,

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


            // =================================================
            // ORDER ERROR
            // =================================================

            if (
                !orderResponse.ok
            ) {

                throw new Error(
                    orderData.message ||
                    "Unable to create Razorpay order."
                );

            }


            if (
                !orderData.success ||
                !orderData.orderId ||
                !orderData.keyId ||
                !orderData.amount
            ) {

                throw new Error(
                    "Invalid Razorpay order response."
                );

            }


            // =================================================
            // CURRENT USER
            // =================================================

            const currentUser =
                getCurrentUser();


            // =================================================
            // RAZORPAY CHECKOUT OPTIONS
            // =================================================

            const options = {

                key:
                    orderData.keyId,

                /*
                 * IMPORTANT:
                 *
                 * The backend returns the Razorpay
                 * amount in paise.
                 *
                 * Example:
                 * ₹1 = 100 paise
                 */

                amount:
                    orderData.amount,

                currency:
                    orderData.currency ||
                    "INR",

                name:
                    "LibraSpace Smart Library",

                description:
                    membership
                        ? `${selectedPlan.name} Membership Renewal`
                        : `${selectedPlan.name} Membership`,

                order_id:
                    orderData.orderId,


                // =================================================
                // CUSTOMER DETAILS
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
                        currentUser?.mobile ||
                        ""

                },


                // =================================================
                // RAZORPAY NOTES
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
                        "#2589A5"

                },


                // =================================================
                // PAYMENT SUCCESS
                // =================================================

                handler:
                    async (
                        paymentResponse
                    ) => {

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
                // CHECKOUT CLOSED
                // =================================================

                modal: {

                    ondismiss:
                        () => {

                            console.log(
                                "Razorpay Checkout closed."
                            );


                            setProcessing(
                                false
                            );


                            setMessage("");


                            setError(
                                "Payment window was closed."
                            );

                        }

                }

            };


            // =================================================
            // CREATE RAZORPAY INSTANCE
            // =================================================

            const razorpay =
                new window.Razorpay(
                    options
                );


            // =================================================
            // PAYMENT FAILED
            // =================================================

            razorpay.on(
                "payment.failed",
                async (
                    response
                ) => {

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

                                body:
                                    JSON.stringify({

                                        razorpayOrderId:
                                            orderData.orderId,

                                        razorpayPaymentId:
                                            response
                                                ?.error
                                                ?.metadata
                                                ?.payment_id ||
                                            ""

                                    })

                            }
                        );

                    } catch (
                        failedRecordError
                    ) {

                        console.error(
                            "Unable to record failed payment:",
                            failedRecordError
                        );

                    }


                    setProcessing(
                        false
                    );

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
            // OPEN RAZORPAY CHECKOUT
            // =================================================

            console.log(
                "Opening Razorpay Checkout..."
            );


            setMessage(
                "Opening secure payment window..."
            );


            razorpay.open();

        } catch (err) {

            console.error(
                "Razorpay payment error:",
                err
            );


            setProcessing(
                false
            );

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

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );


        navigate(
            "/"
        );

    };


    // =====================================================
    // LOADING PAGE
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
                            onClick={
                                handleLogout
                            }
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
            ================================================= */}

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

                        <span>
                            ⌂
                        </span>

                        Dashboard

                    </Link>


                    <Link to="/seats">

                        <span>
                            💺
                        </span>

                        Reserve Seat

                    </Link>


                    <Link to="/reservations">

                        <span>
                            ▣
                        </span>

                        My Reservations

                    </Link>


                    <Link to="/membership">

                        <span>
                            ♛
                        </span>

                        Membership

                    </Link>

                </nav>


                <div className="renew-menu-title">
                    ACCOUNT
                </div>


                <nav className="renew-sidebar-nav">

                    <Link to="/profile">

                        <span>
                            ◯
                        </span>

                        My Profile

                    </Link>


                    <Link to="/payment-history">

                        <span>
                            ▤
                        </span>

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
                        onClick={
                            handleLogout
                        }
                    >
                        ↪ Logout
                    </button>

                </div>

            </aside>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="renew-content">

                {/* =================================================
                    TOP BAR
                ================================================= */}

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
                ================================================= */}

                <main className="renew-main">

                    {/* =================================================
                        BREADCRUMB
                    ================================================= */}

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
                        PAGE HEADER
                    ================================================= */}

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
                    ================================================= */}

                    <section className="renew-notice">

                        <div className="renew-notice-icon">

                            {
                                !isExistingMembership
                                    ? "ℹ️"
                                    : isMembershipExpired()
                                        ? "⚠️"
                                        : "✓"
                            }

                        </div>


                        <div>

                            <strong>

                                {
                                    !isExistingMembership
                                        ? "New Membership Purchase"
                                        : isMembershipExpired()
                                            ? "Membership Expired"
                                            : "Current Membership Found"
                                }

                            </strong>


                            <p>

                                {
                                    !isExistingMembership
                                        ? "No membership exists for this account yet. After successful payment, LibraSpace will create your membership automatically."
                                        : isMembershipExpired()
                                            ? `Your membership expired on ${formatDate(membership.expiryDate)}. Select the same or a different plan to continue your library access.`
                                            : `Your membership is active until ${formatDate(membership.expiryDate)}. You can renew with the same or a different plan.`
                                }

                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        PLAN + SUMMARY
                    ================================================= */}

                    <section className="renew-layout">

                        {/* =================================================
                            PLANS
                        ================================================= */}

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


                            {
                                plans.length === 0 ? (

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

                                    plans.map(
                                        (
                                            plan
                                        ) => (

                                            <button
                                                key={
                                                    plan._id
                                                }
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
                                                disabled={
                                                    processing
                                                }
                                            >

                                                <div className="renew-radio">

                                                    {
                                                        selectedPlan?._id ===
                                                            plan._id && (
                                                            <span></span>
                                                        )
                                                    }

                                                </div>


                                                <div className="renew-plan-info">

                                                    <strong>
                                                        {
                                                            plan.name
                                                        }
                                                    </strong>


                                                    <span>
                                                        {
                                                            formatDuration(
                                                                plan.durationDays
                                                            )
                                                        }
                                                    </span>

                                                </div>


                                                <div className="renew-plan-price">

                                                    <strong>
                                                        ₹
                                                        {
                                                            formatPrice(
                                                                plan.price
                                                            )
                                                        }
                                                    </strong>


                                                    <span>
                                                        {
                                                            plan.planType
                                                        }
                                                    </span>

                                                </div>

                                            </button>

                                        )
                                    )

                                )
                            }


                            {/* =================================================
                                BENEFITS
                            ================================================= */}

                            {
                                selectedPlan && (

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
                                                            key={
                                                                index
                                                            }
                                                        >

                                                            ✓{" "}

                                                            {
                                                                feature
                                                            }

                                                        </p>

                                                    )
                                                )
                                            }

                                        </div>

                                    </div>

                                )
                            }

                        </div>


                        {/* =================================================
                            SUMMARY
                        ================================================= */}

                        <aside className="renew-summary-card">

                            <div className="renew-summary-header">

                                <span>
                                    ORDER SUMMARY
                                </span>


                                <h3>
                                    Renewal Details
                                </h3>

                            </div>


                            {
                                selectedPlan ? (

                                    <>

                                        <div className="renew-summary-membership">

                                            <div className="renew-summary-icon">
                                                ♛
                                            </div>


                                            <div>

                                                <strong>
                                                    {
                                                        selectedPlan.name
                                                    }
                                                </strong>


                                                <span>
                                                    {
                                                        formatDuration(
                                                            selectedPlan.durationDays
                                                        )
                                                    }
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
                                                        !isExistingMembership
                                                            ? "New Membership"
                                                            : isMembershipExpired()
                                                                ? "Expired"
                                                                : "Active"
                                                    }

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
                                                    {
                                                        isExistingMembership
                                                            ? "New Expiry Date"
                                                            : "Membership Start"
                                                    }
                                                </span>


                                                <strong>

                                                    {
                                                        isExistingMembership
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
                                                {
                                                    formatPrice(
                                                        selectedPlan.price
                                                    )
                                                }
                                            </strong>

                                        </div>


                                        {/* =================================================
                                            PAYMENT BUTTON
                                        ================================================= */}

                                        <button
                                            type="button"
                                            className="renew-payment-button"
                                            onClick={
                                                handlePayment
                                            }
                                            disabled={
                                                processing ||
                                                !selectedPlan
                                            }
                                        >

                                            {
                                                processing
                                                    ? "Processing..."
                                                    : isExistingMembership
                                                        ? "Renew Membership"
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

                                )
                            }


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
                        PAYMENT MESSAGE / ERROR
                    ================================================= */}

                    {
                        (
                            message ||
                            error
                        ) && (

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

                        )
                    }


                    {/* =================================================
                        HOW PAYMENT WORKS
                    ================================================= */}

                    <section className="renew-notice">

                        <div className="renew-notice-icon">
                            💡
                        </div>


                        <div>

                            <strong>
                                How payment works
                            </strong>


                            <p>
                                Select your preferred membership
                                plan and continue with Razorpay.
                                For a new member, successful payment
                                creates the membership. For an active
                                member, successful payment extends the
                                current expiry date. For an expired
                                member, the selected plan starts from
                                today. You can choose the same or a
                                different plan. The LibraSpace backend
                                verifies the Razorpay signature before
                                updating MongoDB.
                            </p>

                        </div>

                    </section>

                </main>


                {/* =================================================
                    FOOTER
                ================================================= */}

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