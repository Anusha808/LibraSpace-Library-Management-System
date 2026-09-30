const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    getMyPayments,
    createPayment,
    getPaymentById,
    createRazorpayOrder,
    verifyRazorpayPayment,
    markPaymentFailed
} = require(
    "../controllers/paymentController"
);


// =========================================================
// GET MY PAYMENT HISTORY
// =========================================================
// GET /api/payments/my
// =========================================================

router.get(
    "/my",
    protect,
    getMyPayments
);


// =========================================================
// CREATE RAZORPAY ORDER
// =========================================================
// POST /api/payments/create-order
// =========================================================

router.post(
    "/create-order",
    protect,
    createRazorpayOrder
);


// =========================================================
// VERIFY RAZORPAY PAYMENT
// =========================================================
// POST /api/payments/verify
// =========================================================

router.post(
    "/verify",
    protect,
    verifyRazorpayPayment
);


// =========================================================
// MARK PAYMENT FAILED
// =========================================================
// POST /api/payments/failed
// =========================================================

router.post(
    "/failed",
    protect,
    markPaymentFailed
);


// =========================================================
// CREATE MANUAL PAYMENT
// =========================================================
// POST /api/payments
//
// Existing API retained for compatibility.
// =========================================================

router.post(
    "/",
    protect,
    createPayment
);


// =========================================================
// GET SINGLE PAYMENT
// =========================================================
// GET /api/payments/:id
// =========================================================

router.get(
    "/:id",
    protect,
    getPaymentById
);


module.exports = router;