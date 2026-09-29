const Seat = require("../models/Seat");


// ==========================================================
// GET ALL SEATS
// ==========================================================
// GET /api/admin/seats

const getAdminSeats = async (req, res) => {

    try {

        const seats = await Seat.find()
            .sort({
                row: 1,
                seatNumber: 1
            });


        return res.status(200).json({

            success: true,

            seats

        });

    } catch (error) {

        console.error(
            "Get admin seats error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to load seats."

        });

    }

};


// ==========================================================
// CREATE NEW SEAT
// ==========================================================
// POST /api/admin/seats

const createAdminSeat = async (req, res) => {

    try {

        // ======================================================
        // GET DATA
        // ======================================================

        const seatNumber = String(
            req.body.seatNumber || ""
        )
            .trim()
            .toUpperCase();


        const section = String(
            req.body.section || ""
        ).trim();


        // ======================================================
        // VALIDATE SEAT NUMBER
        // ======================================================

        if (!seatNumber) {

            return res.status(400).json({

                success: false,

                message:
                    "Seat number is required."

            });

        }


        // Example:
        // A01
        // A26
        // E01

        if (
            !/^[A-Z]\d{1,3}$/.test(
                seatNumber
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid seat number such as A01, A26, or E01."

            });

        }


        // ======================================================
        // VALID SECTIONS
        // ======================================================

        const validSections = [

            "Reading Hall",

            "Reference Hall",

            "Silent Zone",

            "Computer Section"

        ];


        if (
            !validSections.includes(
                section
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid library section."

            });

        }


        // ======================================================
        // CHECK DUPLICATE SEAT
        // ======================================================

        const existingSeat =
            await Seat.findOne({
                seatNumber
            });


        if (existingSeat) {

            return res.status(409).json({

                success: false,

                message:
                    `Seat ${seatNumber} already exists.`

            });

        }


        // ======================================================
        // CREATE SEAT
        // ======================================================

        const seat =
            await Seat.create({

                seatNumber,

                row:
                    seatNumber.charAt(0),

                section,

                status:
                    "Available"

            });


        // ======================================================
        // RESPONSE
        // ======================================================

        return res.status(201).json({

            success: true,

            message:
                "Seat created successfully.",

            seat

        });

    } catch (error) {

        console.error(
            "Create admin seat error:",
            error
        );


        // MongoDB duplicate key protection
        if (
            error.code === 11000
        ) {

            return res.status(409).json({

                success: false,

                message:
                    "This seat already exists."

            });

        }


        return res.status(500).json({

            success: false,

            message:
                "Unable to create seat."

        });

    }

};


// ==========================================================
// UPDATE SEAT STATUS
// ==========================================================
// PATCH /api/admin/seats/:id/status

const updateAdminSeatStatus = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const {
            status
        } = req.body;


        // ======================================================
        // ALLOWED STATUSES
        // ======================================================

        const allowedStatuses = [

            "Available",

            "Reserved",

            "Occupied"

        ];


        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid seat status."

            });

        }


        // ======================================================
        // UPDATE SEAT
        // ======================================================

        const seat =
            await Seat.findByIdAndUpdate(

                id,

                {
                    status
                },

                {
                    new: true,

                    runValidators: true
                }

            );


        // ======================================================
        // SEAT NOT FOUND
        // ======================================================

        if (!seat) {

            return res.status(404).json({

                success: false,

                message:
                    "Seat not found."

            });

        }


        // ======================================================
        // RESPONSE
        // ======================================================

        return res.status(200).json({

            success: true,

            message:
                "Seat status updated successfully.",

            seat

        });

    } catch (error) {

        console.error(
            "Update seat status error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to update seat status."

        });

    }

};


// ==========================================================
// DELETE SEAT
// ==========================================================
// DELETE /api/admin/seats/:id

const deleteAdminSeat = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        // ======================================================
        // DELETE
        // ======================================================

        const seat =
            await Seat.findByIdAndDelete(
                id
            );


        // ======================================================
        // SEAT NOT FOUND
        // ======================================================

        if (!seat) {

            return res.status(404).json({

                success: false,

                message:
                    "Seat not found."

            });

        }


        // ======================================================
        // RESPONSE
        // ======================================================

        return res.status(200).json({

            success: true,

            message:
                `Seat ${seat.seatNumber} deleted successfully.`

        });

    } catch (error) {

        console.error(
            "Delete seat error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Unable to delete seat."

        });

    }

};


// ==========================================================
// EXPORT CONTROLLERS
// ==========================================================

module.exports = {

    getAdminSeats,

    createAdminSeat,

    updateAdminSeatStatus,

    deleteAdminSeat

};