const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        seatNumber: {
            type: String,
            required: true,
            trim: true
        },

        reservationDate: {
            type: Date,
            required: true
        },

        startTime: {
            type: String,
            required: true
        },

        endTime: {
            type: String,
            required: true
        },

        purpose: {
            type: String,
            default: "Library Study Session",
            trim: true
        },

        status: {
            type: String,
            enum: [
                "confirmed",
                "completed",
                "cancelled"
            ],
            default: "confirmed"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Reservation",
    reservationSchema
);