const mongoose = require("mongoose");


// ==========================================================
// SEAT SCHEMA
// ==========================================================

const seatSchema = new mongoose.Schema(
    {

        // ======================================================
        // SEAT NUMBER
        // ======================================================

        seatNumber: {

            type: String,

            required: true,

            unique: true,

            trim: true,

            uppercase: true

        },


        // ======================================================
        // ROW
        // ======================================================

        row: {

            type: String,

            required: true,

            trim: true,

            uppercase: true

        },


        // ======================================================
        // LIBRARY SECTION
        // ======================================================

        section: {

            type: String,

            required: true,

            enum: [

                "Reading Hall",

                "Reference Hall",

                "Silent Zone",

                "Computer Section"

            ],

            default: "Reading Hall"

        },


        // ======================================================
        // SEAT STATUS
        // ======================================================

        status: {

            type: String,

            enum: [

                "Available",

                "Reserved",

                "Occupied"

            ],

            default: "Available"

        }

    },

    // ==========================================================
    // TIMESTAMPS
    // ==========================================================

    {
        timestamps: true
    }
);


// ==========================================================
// EXPORT MODEL
// ==========================================================

module.exports =
    mongoose.model(
        "Seat",
        seatSchema
    );