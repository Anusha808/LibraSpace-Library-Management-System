const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    getMembershipPlans,
    getMembershipPlanById,
    createMembershipPlan
} = require(
    "../controllers/membershipPlanController"
);


// ==========================================
// GET ALL PLANS
// ==========================================

router.get(
    "/",
    protect,
    getMembershipPlans
);


// ==========================================
// CREATE PLAN
// ==========================================

router.post(
    "/",
    protect,
    createMembershipPlan
);


// ==========================================
// GET SINGLE PLAN
// ==========================================

router.get(
    "/:id",
    protect,
    getMembershipPlanById
);


module.exports = router;