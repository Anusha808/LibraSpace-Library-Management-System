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

const adminRoutes =
    require("./routes/adminRoutes");

const seatRoutes =
    require("./routes/seatRoutes");


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

app.use(
    "/api/auth",
    authRoutes
);


// ==========================================================
// RESERVATION ROUTES
// ==========================================================

app.use(
    "/api/reservations",
    reservationRoutes
);


// ==========================================================
// MEMBERSHIP ROUTES
// ==========================================================

app.use(
    "/api/memberships",
    membershipRoutes
);


// ==========================================================
// MEMBERSHIP PLAN ROUTES
// ==========================================================

app.use(
    "/api/membership-plans",
    membershipPlanRoutes
);


// ==========================================================
// PAYMENT ROUTES
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
// General admin routes
// are handled inside adminRoutes.
//

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

app.use(
    "/api/admin/seats",
    seatRoutes
);


// ==========================================================
// TEST ROUTE
// ==========================================================

app.get(
    "/",
    (req, res) => {

        res.json({
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