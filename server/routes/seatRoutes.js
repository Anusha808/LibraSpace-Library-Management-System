const express = require("express");

const adminProtect = require("../middleware/adminProtect");

const {
    getAdminSeats,
    createAdminSeat,
    updateAdminSeatStatus,
    deleteAdminSeat
} = require("../controllers/seatController");

const router = express.Router();


// ==========================================================
// GET ALL SEATS
// ==========================================================
// GET /api/admin/seats

router.get(
    "/",
    adminProtect,
    getAdminSeats
);


// ==========================================================
// ADD NEW SEAT
// ==========================================================
// POST /api/admin/seats

router.post(
    "/",
    adminProtect,
    createAdminSeat
);


// ==========================================================
// CHANGE SEAT STATUS
// ==========================================================
// PATCH /api/admin/seats/:id/status

router.patch(
    "/:id/status",
    adminProtect,
    updateAdminSeatStatus
);


// ==========================================================
// DELETE SEAT
// ==========================================================
// DELETE /api/admin/seats/:id

router.delete(
    "/:id",
    adminProtect,
    deleteAdminSeat
);


module.exports = router;