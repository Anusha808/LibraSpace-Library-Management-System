const Reservation = require("../models/Reservation");

// ==========================================
// CREATE RESERVATION
// ==========================================
const createReservation = async (req, res) => {
    try {
        const {
            seatNumber,
            reservationDate,
            startTime,
            endTime,
            purpose
        } = req.body;

        // Validate required fields
        if (
            !seatNumber ||
            !reservationDate ||
            !startTime ||
            !endTime
        ) {
            return res.status(400).json({
                message:
                    "Seat number, reservation date, start time and end time are required"
            });
        }

        // Check whether the same seat is already booked
        const existingReservation = await Reservation.findOne({
            seatNumber,
            reservationDate: new Date(reservationDate),
            startTime,
            status: "confirmed"
        });

        if (existingReservation) {
            return res.status(400).json({
                message:
                    "This seat is already reserved for the selected time"
            });
        }

        // Create reservation for logged-in user
        const reservation = await Reservation.create({
            user: req.user.id,
            seatNumber,
            reservationDate: new Date(reservationDate),
            startTime,
            endTime,
            purpose: purpose || "Library Study Session"
        });

        res.status(201).json({
            message: "Seat reserved successfully",
            reservation
        });

    } catch (error) {
        console.error("Create reservation error:", error);

        res.status(500).json({
            message: "Server error while creating reservation"
        });
    }
};


// ==========================================
// GET MY RESERVATIONS
// ==========================================
const getMyReservations = async (req, res) => {
    try {

        const reservations = await Reservation.find({
            user: req.user.id
        })
            .sort({
                reservationDate: -1,
                startTime: -1
            });

        res.status(200).json({
            reservations
        });

    } catch (error) {
        console.error("Get reservations error:", error);

        res.status(500).json({
            message: "Server error while fetching reservations"
        });
    }
};


// ==========================================
// GET NEXT RESERVATION
// ==========================================
const getNextReservation = async (req, res) => {
    try {

        const today = new Date();

        const reservations = await Reservation.find({
            user: req.user.id,
            status: "confirmed"
        }).sort({
            reservationDate: 1
        });

        const nextReservation = reservations.find(
            (reservation) =>
                new Date(reservation.reservationDate) >= today
        );

        if (!nextReservation) {
            return res.status(200).json({
                reservation: null
            });
        }

        res.status(200).json({
            reservation: nextReservation
        });

    } catch (error) {
        console.error(
            "Get next reservation error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching next reservation"
        });
    }
};


// ==========================================
// GET RESERVATION COUNT
// ==========================================
const getReservationCount = async (req, res) => {
    try {

        const count = await Reservation.countDocuments({
            user: req.user.id
        });

        res.status(200).json({
            count
        });

    } catch (error) {
        console.error(
            "Get reservation count error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while counting reservations"
        });
    }
};


// ==========================================
// CANCEL RESERVATION
// ==========================================
const cancelReservation = async (req, res) => {
    try {

        const { id } = req.params;

        const reservation = await Reservation.findOne({
            _id: id,
            user: req.user.id
        });

        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        if (reservation.status === "cancelled") {
            return res.status(400).json({
                message: "Reservation is already cancelled"
            });
        }

        reservation.status = "cancelled";

        await reservation.save();

        res.status(200).json({
            message: "Reservation cancelled successfully",
            reservation
        });

    } catch (error) {
        console.error(
            "Cancel reservation error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while cancelling reservation"
        });
    }
};


// ==========================================
// COMPLETE RESERVATION
// ==========================================
const completeReservation = async (req, res) => {
    try {

        const { id } = req.params;

        const reservation = await Reservation.findOne({
            _id: id,
            user: req.user.id
        });

        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found"
            });
        }

        reservation.status = "completed";

        await reservation.save();

        res.status(200).json({
            message: "Reservation completed successfully",
            reservation
        });

    } catch (error) {
        console.error(
            "Complete reservation error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while completing reservation"
        });
    }
};


module.exports = {
    createReservation,
    getMyReservations,
    getNextReservation,
    getReservationCount,
    cancelReservation,
    completeReservation
};