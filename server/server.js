const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

// ==========================================================
// ROUTES
// ==========================================================

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

const adminRoutes =
    require("./routes/adminRoutes");

const seatRoutes =
    require("./routes/seatRoutes");

const settingsRoutes =
    require("./routes/settingsRoutes");


// ==========================================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================================

dotenv.config();


// ==========================================================
// CREATE EXPRESS APP
// ==========================================================

const app = express();


// ==========================================================
// CONNECT MONGODB ATLAS
// ==========================================================

connectDB();


// ==========================================================
// MIDDLEWARE
// ==========================================================

// Allow frontend requests

app.use(
    cors()
);


// Read JSON request bodies

app.use(
    express.json()
);


// ==========================================================
// AUTHENTICATION ROUTES
// ==========================================================
//
// POST /api/auth/register
// POST /api/auth/login
//
// ==========================================================

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================================
// RESERVATION ROUTES
// ==========================================================
//
// POST   /api/reservations
// GET    /api/reservations/my
// PUT    /api/reservations/:id/cancel
//
// ==========================================================

app.use(
    "/api/reservations",
    reservationRoutes
);


// ==========================================================
// MEMBERSHIP ROUTES
// ==========================================================
//
// POST /api/memberships
// GET  /api/memberships/my
// GET  /api/memberships/days-remaining
// PUT  /api/memberships/renew
// PUT  /api/memberships/cancel
//
// ==========================================================

app.use(
    "/api/memberships",
    membershipRoutes
);


// ==========================================================
// MEMBERSHIP PLAN ROUTES
// ==========================================================
//
// GET /api/membership-plans
//
// ==========================================================

app.use(
    "/api/membership-plans",
    membershipPlanRoutes
);


// ==========================================================
// PAYMENT ROUTES
// ==========================================================
//
// POST /api/payments/create-order
// POST /api/payments/verify
// GET  /api/payments/my
//
// ==========================================================

app.use(
    "/api/payments",
    paymentRoutes
);


// ==========================================================
// ADMIN ROUTES
// ==========================================================
//
// Dashboard:
// GET /api/admin/dashboard
//
// Reservations:
// GET    /api/admin/reservations
// PATCH  /api/admin/reservations/:id/status
// DELETE /api/admin/reservations/:id
//
// Members:
// GET   /api/admin/members
// PATCH /api/admin/members/:id/status
//
// Memberships:
// GET   /api/admin/memberships
// PATCH /api/admin/memberships/:id/renew
//
// Payments:
// GET   /api/admin/payments
// PATCH /api/admin/payments/:id/status
//
// Reports:
// GET /api/admin/reports
//
// ==========================================================

app.use(
    "/api/admin",
    adminRoutes
);


// ==========================================================
// ADMIN SEAT ROUTES
// ==========================================================
//
// Get all seats:
// GET /api/admin/seats
//
// Add seat:
// POST /api/admin/seats
//
// Change status:
// PATCH /api/admin/seats/:id/status
//
// Delete seat:
// DELETE /api/admin/seats/:id
//
// ==========================================================

app.use(
    "/api/admin/seats",
    seatRoutes
);


// ==========================================================
// ADMIN SETTINGS ROUTES
// ==========================================================
//
// Get settings:
// GET /api/admin/settings
//
// Update settings:
// PUT /api/admin/settings
//
// Change admin password:
// PUT /api/admin/settings/password
//
// ==========================================================

app.use(
    "/api/admin/settings",
    settingsRoutes
);


// ==========================================================
// TEST ROUTE
// ==========================================================

app.get(
    "/",
    (req, res) => {

        res.json({
            success: true,

            message:
                "LibraSpace Backend is running successfully!"
        });

    }
);


// ==========================================================
// 404 ROUTE
// ==========================================================

app.use(
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "API route not found."

        });

    }
);


// ==========================================================
// GLOBAL ERROR HANDLER
// ==========================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "Server Error:",
            err
        );


        res.status(
            err.status || 500
        ).json({

            success: false,

            message:
                err.message ||
                "Internal server error."

        });

    }
);


// ==========================================================
// SERVER
// ==========================================================

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