const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        settingsKey: {
            type: String,
            required: true,
            unique: true,
            default: "LIBRASPACE_SETTINGS"
        },

        // Library information
        libraryName: {
            type: String,
            default: "LibraSpace Library",
            trim: true
        },

        libraryEmail: {
            type: String,
            default: "support@libraspace.com",
            trim: true,
            lowercase: true
        },

        libraryPhone: {
            type: String,
            default: "+91 98765 43210",
            trim: true
        },

        address: {
            type: String,
            default: "SRM University Campus, Tamil Nadu",
            trim: true
        },

        // Operating hours
        openingTime: {
            type: String,
            default: "08:00"
        },

        closingTime: {
            type: String,
            default: "20:00"
        },

        // Reservation settings
        maxReservationHours: {
            type: Number,
            default: 4,
            min: 1,
            max: 12
        },

        advanceBookingDays: {
            type: Number,
            default: 7,
            min: 1,
            max: 30
        },

        cancellationHours: {
            type: Number,
            default: 2,
            min: 0,
            max: 24
        },

        maintenanceMode: {
            type: Boolean,
            default: false
        },

        // Notification settings
        emailNotifications: {
            type: Boolean,
            default: true
        },

        reservationAlerts: {
            type: Boolean,
            default: true
        },

        membershipAlerts: {
            type: Boolean,
            default: true
        },

        paymentAlerts: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Settings",
    settingsSchema
);