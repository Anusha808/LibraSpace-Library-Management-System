
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ==========================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// ==========================================================

dotenv.config();

// ==========================================================
// DATABASE
// ==========================================================

const connectDB = require("./config/db");

// ==========================================================
// ROUTES
// ==========================================================

const authRoutes = require("./routes/authRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const membershipRoutes = require("./routes/membershipRoutes");
const membershipPlanRoutes = require("./routes/membershipPlanRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const seatRoutes = require("./routes/seatRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// ==========================================================
// CREATE EXPRESS APP
// ==========================================================

const app = express();

// ==========================================================
// CORS CONFIGURATION — UPDATED FOR PAYMENT HISTORY
// ==========================================================

const corsOptions = {
    origin: "http://localhost:5173",

    credentials: true,

    methods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS"
    ],

    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Cache-Control",
        "Pragma"
    ]
};

// Enable CORS for frontend requests.
// This also handles browser preflight OPTIONS requests.
app.use(cors(corsOptions));

// ==========================================================
// READ REQUEST BODIES
// ==========================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================================
// CONNECT MONGODB ATLAS
// ==========================================================

connectDB();

// ==========================================================
// AUTHENTICATION ROUTES
// ==========================================================

app.use("/api/auth", authRoutes);

// ==========================================================
// RESERVATION ROUTES
// ==========================================================

app.use("/api/reservations", reservationRoutes);

// ==========================================================
// MEMBERSHIP ROUTES
// ==========================================================

app.use("/api/memberships", membershipRoutes);

// ==========================================================
// MEMBERSHIP PLAN ROUTES
// ==========================================================

app.use("/api/membership-plans", membershipPlanRoutes);

// ==========================================================
// PAYMENT ROUTES
// ==========================================================

app.use("/api/payments", paymentRoutes);

// ==========================================================
// ADMIN ROUTES
// ==========================================================

app.use("/api/admin", adminRoutes);

// ==========================================================
// ADMIN SEAT ROUTES
// ==========================================================

app.use("/api/admin/seats", seatRoutes);

// ==========================================================
// ADMIN SETTINGS ROUTES
// ==========================================================

app.use("/api/admin/settings", settingsRoutes);

// ==========================================================
// TEST ROUTE
// ==========================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LibraSpace Backend is running successfully!"
    });
});

// ==========================================================
// 404 ROUTE
// ==========================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found."
    });
});

// ==========================================================
// GLOBAL ERROR HANDLER
// ==========================================================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal server error."
    });
});

// ==========================================================
// START SERVER
// ==========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

    console.log(
        "Razorpay Key ID loaded:",
        process.env.RAZORPAY_KEY_ID ? "YES" : "NO"
    );

    console.log(
        "Razorpay Secret loaded:",
        process.env.RAZORPAY_KEY_SECRET ? "YES" : "NO"
    );
});
