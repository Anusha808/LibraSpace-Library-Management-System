const MembershipPlan = require("../models/MembershipPlan");

// ==========================================
// GET ALL ACTIVE MEMBERSHIP PLANS
// ==========================================

const getMembershipPlans = async (req, res) => {
    try {

        const plans = await MembershipPlan.find({
            active: true
        }).sort({
            price: 1
        });

        res.status(200).json({
            plans
        });

    } catch (error) {

        console.error(
            "Get membership plans error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching membership plans"
        });
    }
};


// ==========================================
// GET SINGLE MEMBERSHIP PLAN
// ==========================================

const getMembershipPlanById = async (
    req,
    res
) => {
    try {

        const { id } = req.params;

        const plan =
            await MembershipPlan.findOne({
                _id: id,
                active: true
            });

        if (!plan) {

            return res.status(404).json({
                message:
                    "Membership plan not found"
            });
        }

        res.status(200).json({
            plan
        });

    } catch (error) {

        console.error(
            "Get membership plan error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching membership plan"
        });
    }
};


// ==========================================
// CREATE MEMBERSHIP PLAN
// ==========================================

const createMembershipPlan = async (
    req,
    res
) => {
    try {

        const {
            name,
            planType,
            price,
            durationDays,
            description,
            features,
            active
        } = req.body;


        if (
            !name ||
            !planType ||
            price === undefined ||
            !durationDays
        ) {

            return res.status(400).json({
                message:
                    "Name, plan type, price and duration are required"
            });
        }


        const existingPlan =
            await MembershipPlan.findOne({
                name,
                planType
            });

        if (existingPlan) {

            return res.status(400).json({
                message:
                    "This membership plan already exists"
            });
        }


        const plan =
            await MembershipPlan.create({

                name,

                planType,

                price,

                durationDays,

                description:
                    description || "",

                features:
                    Array.isArray(features)
                        ? features
                        : [],

                active:
                    active !== undefined
                        ? active
                        : true
            });


        res.status(201).json({

            message:
                "Membership plan created successfully",

            plan
        });

    } catch (error) {

        console.error(
            "Create membership plan error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while creating membership plan"
        });
    }
};


module.exports = {

    getMembershipPlans,

    getMembershipPlanById,

    createMembershipPlan
};