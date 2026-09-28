const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const reservationRoutes =
    require("./routes/reservationRoutes");

const membershipRoutes =
    require("./routes/membershipRoutes");

const membershipPlanRoutes =
    require("./routes/membershipPlanRoutes");

const paymentRoutes =
    require("./routes/paymentRoutes");

dotenv.config();

const app = express();

// ==========================================
// CONNECT MONGODB
// ==========================================

connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

// ==========================================
// RESERVATION ROUTES
// ==========================================

app.use(
    "/api/reservations",
    reservationRoutes
);

// ==========================================
// MEMBERSHIP ROUTES
// ==========================================

app.use(
    "/api/memberships",
    membershipRoutes
);

// ==========================================
// MEMBERSHIP PLAN ROUTES
// ==========================================

app.use(
    "/api/membership-plans",
    membershipPlanRoutes
);

// ==========================================
// PAYMENT ROUTES
// ==========================================

app.use(
    "/api/payments",
    paymentRoutes
);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        message:
            "LibraSpace Backend is running successfully!"
    });

});

// ==========================================
// SERVER
// ==========================================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);