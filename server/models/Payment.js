const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        // =====================================================
        // TRANSACTION INFORMATION
        // =====================================================

        transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        razorpayOrderId: {
            type: String,
            default: "",
            trim: true
        },

        razorpayPaymentId: {
            type: String,
            default: "",
            trim: true
        },

        razorpaySignature: {
            type: String,
            default: "",
            trim: true
        },

        // =====================================================
        // MEMBERSHIP PLAN
        // =====================================================

        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MembershipPlan",
            default: null
        },

        // =====================================================
        // PAYMENT DETAILS
        // =====================================================

        description: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: String,
            required: true,
            trim: true
        },

        method: {
            type: String,
            default: "Razorpay",
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "Successful",
                "Pending",
                "Failed"
            ],
            default: "Pending"
        },

        paymentDate: {
            type: Date,
            default: Date.now
        },

        // =====================================================
        // MEMBERSHIP
        // =====================================================

        membership: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Membership",
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Payment",
    paymentSchema
);