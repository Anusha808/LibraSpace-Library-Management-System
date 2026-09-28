const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createReservation,
    getMyReservations,
    getNextReservation,
    getReservationCount,
    cancelReservation,
    completeReservation
} = require("../controllers/reservationController");


// ==========================================
// CREATE RESERVATION
// POST /api/reservations
// ==========================================
router.post(
    "/",
    protect,
    createReservation
);


// ==========================================
// GET MY RESERVATIONS
// GET /api/reservations/my
// ==========================================
router.get(
    "/my",
    protect,
    getMyReservations
);


// ==========================================
// GET NEXT RESERVATION
// GET /api/reservations/next
// ==========================================
router.get(
    "/next",
    protect,
    getNextReservation
);


// ==========================================
// GET RESERVATION COUNT
// GET /api/reservations/count
// ==========================================
router.get(
    "/count",
    protect,
    getReservationCount
);


// ==========================================
// CANCEL RESERVATION
// PUT /api/reservations/:id/cancel
// ==========================================
router.put(
    "/:id/cancel",
    protect,
    cancelReservation
);


// ==========================================
// COMPLETE RESERVATION
// PUT /api/reservations/:id/complete
// ==========================================
router.put(
    "/:id/complete",
    protect,
    completeReservation
);


module.exports = router;