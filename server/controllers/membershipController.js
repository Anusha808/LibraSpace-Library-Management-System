const Membership = require("../models/Membership");

// ==========================================
// CREATE MEMBERSHIP
// ==========================================
const createMembership = async (req, res) => {
    try {
        const {
            planName,
            planType,
            monthlyFee,
            startDate,
            expiryDate
        } = req.body;

        // Validate required fields
        if (
            !planName ||
            !planType ||
            monthlyFee === undefined ||
            !startDate ||
            !expiryDate
        ) {
            return res.status(400).json({
                message:
                    "Plan name, plan type, monthly fee, start date and expiry date are required"
            });
        }

        // Check if user already has an active membership
        const existingMembership = await Membership.findOne({
            user: req.user.id,
            status: "active"
        });

        if (existingMembership) {
            return res.status(400).json({
                message:
                    "You already have an active membership"
            });
        }

        // Create membership
        const membership = await Membership.create({
            user: req.user.id,
            planName,
            planType,
            monthlyFee,
            startDate: new Date(startDate),
            expiryDate: new Date(expiryDate),
            status: "active"
        });

        res.status(201).json({
            message: "Membership created successfully",
            membership
        });

    } catch (error) {
        console.error(
            "Create membership error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while creating membership"
        });
    }
};


// ==========================================
// GET MY MEMBERSHIP
// ==========================================
const getMyMembership = async (req, res) => {
    try {
        const membership = await Membership.findOne({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        if (!membership) {
            return res.status(200).json({
                membership: null
            });
        }

        // Automatically update status if membership has expired
        if (
            membership.status === "active" &&
            new Date(membership.expiryDate) < new Date()
        ) {
            membership.status = "expired";

            await membership.save();
        }

        res.status(200).json({
            membership
        });

    } catch (error) {
        console.error(
            "Get membership error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching membership"
        });
    }
};


// ==========================================
// GET MEMBERSHIP DAYS REMAINING
// ==========================================
const getMembershipDaysRemaining = async (
    req,
    res
) => {
    try {
        const membership = await Membership.findOne({
            user: req.user.id,
            status: "active"
        }).sort({
            createdAt: -1
        });

        if (!membership) {
            return res.status(200).json({
                daysRemaining: 0
            });
        }

        const today = new Date();

        const expiryDate = new Date(
            membership.expiryDate
        );

        const difference =
            expiryDate.getTime() -
            today.getTime();

        const daysRemaining = Math.max(
            0,
            Math.ceil(
                difference /
                (1000 * 60 * 60 * 24)
            )
        );

        res.status(200).json({
            daysRemaining
        });

    } catch (error) {
        console.error(
            "Membership days remaining error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while calculating membership days"
        });
    }
};


// ==========================================
// RENEW MEMBERSHIP
// ==========================================
const renewMembership = async (req, res) => {
    try {
        const {
            planName,
            planType,
            monthlyFee,
            expiryDate
        } = req.body;

        if (
            !planName ||
            !planType ||
            monthlyFee === undefined ||
            !expiryDate
        ) {
            return res.status(400).json({
                message:
                    "Plan name, plan type, monthly fee and expiry date are required"
            });
        }

        const membership = await Membership.findOne({
            user: req.user.id
        }).sort({
            createdAt: -1
        });

        if (!membership) {
            return res.status(404).json({
                message:
                    "No membership found. Please create a membership first."
            });
        }

        membership.planName = planName;
        membership.planType = planType;
        membership.monthlyFee = monthlyFee;
        membership.startDate = new Date();
        membership.expiryDate = new Date(expiryDate);
        membership.status = "active";

        await membership.save();

        res.status(200).json({
            message:
                "Membership renewed successfully",
            membership
        });

    } catch (error) {
        console.error(
            "Renew membership error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while renewing membership"
        });
    }
};


// ==========================================
// CANCEL MEMBERSHIP
// ==========================================
const cancelMembership = async (req, res) => {
    try {
        const membership = await Membership.findOne({
            user: req.user.id,
            status: "active"
        });

        if (!membership) {
            return res.status(404).json({
                message:
                    "Active membership not found"
            });
        }

        membership.status = "cancelled";

        await membership.save();

        res.status(200).json({
            message:
                "Membership cancelled successfully",
            membership
        });

    } catch (error) {
        console.error(
            "Cancel membership error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while cancelling membership"
        });
    }
};


// ==========================================
// EXPORT FUNCTIONS
// ==========================================
module.exports = {
    createMembership,
    getMyMembership,
    getMembershipDaysRemaining,
    renewMembership,
    cancelMembership
};