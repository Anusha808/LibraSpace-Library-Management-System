const mongoose = require("mongoose");

const membershipPlanSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        planType: {
            type: String,
            required: true,
            trim: true
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        durationDays: {
            type: Number,
            required: true,
            min: 1
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        features: {
            type: [String],
            default: []
        },

        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "MembershipPlan",
    membershipPlanSchema
);