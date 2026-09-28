const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

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
            required: true
        },

        status: {
            type: String,
            enum: [
                "Successful",
                "Pending",
                "Failed"
            ],
            default: "Successful"
        },

        paymentDate: {
            type: Date,
            default: Date.now
        },

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