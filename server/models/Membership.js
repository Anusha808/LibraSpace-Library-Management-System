const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        planName: {
            type: String,
            required: true,
            trim: true
        },

        planType: {
            type: String,
            required: true,
            trim: true
        },

        monthlyFee: {
            type: Number,
            required: true
        },

        startDate: {
            type: Date,
            required: true
        },

        expiryDate: {
            type: Date,
            required: true
        },

        status: {
            type: String,
            enum: [
                "active",
                "expired",
                "cancelled"
            ],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Membership",
    membershipSchema
);