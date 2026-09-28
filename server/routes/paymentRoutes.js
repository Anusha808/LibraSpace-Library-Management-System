const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    getMyPayments,
    createPayment,
    getPaymentById
} = require("../controllers/paymentController");


// GET MY PAYMENT HISTORY
router.get(
    "/my",
    protect,
    getMyPayments
);


// CREATE PAYMENT
router.post(
    "/",
    protect,
    createPayment
);


// GET SINGLE PAYMENT
router.get(
    "/:id",
    protect,
    getPaymentById
);


module.exports = router;