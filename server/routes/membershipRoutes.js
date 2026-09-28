const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    createMembership,
    getMyMembership,
    getMembershipDaysRemaining,
    renewMembership,
    cancelMembership
} = require("../controllers/membershipController");

// ==========================================
// CREATE MEMBERSHIP
// ==========================================
router.post(
    "/",
    protect,
    createMembership
);

// ==========================================
// GET MY MEMBERSHIP
// ==========================================
router.get(
    "/my",
    protect,
    getMyMembership
);

// ==========================================
// GET MEMBERSHIP DAYS REMAINING
// ==========================================
router.get(
    "/days-remaining",
    protect,
    getMembershipDaysRemaining
);

// ==========================================
// RENEW MEMBERSHIP
// ==========================================
router.put(
    "/renew",
    protect,
    renewMembership
);

// ==========================================
// CANCEL MEMBERSHIP
// ==========================================
router.put(
    "/cancel",
    protect,
    cancelMembership
);

module.exports = router;