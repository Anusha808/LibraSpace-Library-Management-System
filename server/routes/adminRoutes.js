const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Membership = require("../models/Membership");
const Payment = require("../models/Payment");

const {
    getAdminDashboard,
    getAdminReports
} = require("../controllers/adminController");


// ==========================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ==========================================================

const adminProtect = async (req, res, next) => {

    try {

        // ======================================================
        // GET AUTHORIZATION HEADER
        // ======================================================

        const authHeader =
            req.headers.authorization;


        // ======================================================
        // CHECK TOKEN
        // ======================================================

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Administrator authentication required."

            });

        }


        // ======================================================
        // GET TOKEN
        // ======================================================

        const token =
            authHeader.split(" ")[1];


        // ======================================================
        // VERIFY TOKEN
        // ======================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ======================================================
        // FIND ADMIN
        // ======================================================

        const admin =
            await User.findOne({

                _id: decoded.id,

                role: "admin"

            });


        // ======================================================
        // CHECK ADMIN
        // ======================================================

        if (!admin) {

            return res.status(403).json({

                success: false,

                message:
                    "Administrator access denied."

            });

        }


        // ======================================================
        // STORE ADMIN
        // ======================================================

        req.admin = admin;


        // ======================================================
        // CONTINUE
        // ======================================================

        next();

    } catch (error) {

        console.error(
            "Admin authentication error:",
            error
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired administrator token."

        });

    }

};


// ==========================================================
// ADMIN DASHBOARD
// ==========================================================

router.get(
    "/dashboard",
    adminProtect,
    getAdminDashboard
);


// ==========================================================
// ADMIN REPORTS
// ==========================================================
//
// GET
// http://localhost:5000/api/admin/reports
//
// ==========================================================

router.get(
    "/reports",
    adminProtect,
    getAdminReports
);


// ==========================================================
// GET ALL RESERVATIONS
// ==========================================================
//
// GET
// http://localhost:5000/api/admin/reservations
//
// ==========================================================

router.get(
    "/reservations",
    adminProtect,
    async (req, res) => {

        try {

            const reservations =
                await Reservation.find()
                    .populate(
                        "user",
                        "name email"
                    )
                    .sort({
                        createdAt: -1
                    });


            return res.status(200).json({

                success: true,

                reservations

            });

        } catch (error) {

            console.error(
                "Get admin reservations error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load reservations."

            });

        }

    }
);


// ==========================================================
// UPDATE RESERVATION STATUS
// ==========================================================
//
// PATCH
// http://localhost:5000/api/admin/reservations/:id/status
//
// Supported:
// confirmed
// completed
// cancelled
//
// ==========================================================

router.patch(
    "/reservations/:id/status",
    adminProtect,
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                status
            } = req.body;


            // ==================================================
            // VALID STATUSES
            // ==================================================

            const allowedStatuses = [

                "confirmed",

                "completed",

                "cancelled"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid reservation status."

                });

            }


            // ==================================================
            // UPDATE RESERVATION
            // ==================================================

            const reservation =
                await Reservation
                    .findByIdAndUpdate(
                        id,
                        {
                            status
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    )
                    .populate(
                        "user",
                        "name email"
                    );


            // ==================================================
            // CHECK RECORD
            // ==================================================

            if (!reservation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Reservation not found."

                });

            }


            // ==================================================
            // RESPONSE
            // ==================================================

            return res.status(200).json({

                success: true,

                message:
                    "Reservation status updated successfully.",

                reservation

            });

        } catch (error) {

            console.error(
                "Update reservation status error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to update reservation status."

            });

        }

    }
);


// ==========================================================
// DELETE RESERVATION
// ==========================================================
//
// DELETE
// http://localhost:5000/api/admin/reservations/:id
//
// ==========================================================

router.delete(
    "/reservations/:id",
    adminProtect,
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            // ==================================================
            // FIND RESERVATION
            // ==================================================

            const reservation =
                await Reservation.findById(
                    id
                );


            if (!reservation) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Reservation not found."

                });

            }


            // ==================================================
            // DELETE
            // ==================================================

            await Reservation.findByIdAndDelete(
                id
            );


            // ==================================================
            // RESPONSE
            // ==================================================

            return res.status(200).json({

                success: true,

                message:
                    "Reservation deleted successfully."

            });

        } catch (error) {

            console.error(
                "Delete reservation error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to delete reservation."

            });

        }

    }
);


// ==========================================================
// GET ALL MEMBERS
// ==========================================================
//
// GET
// http://localhost:5000/api/admin/members
//
// ==========================================================

router.get(
    "/members",
    adminProtect,
    async (req, res) => {

        try {

            // ==================================================
            // GET STUDENT USERS
            // ==================================================

            const users =
                await User.find({
                    role: "student"
                })
                    .sort({
                        createdAt: -1
                    })
                    .lean();


            // ==================================================
            // BUILD MEMBER DATA
            // ==================================================

            const members =
                await Promise.all(

                    users.map(
                        async (user) => {

                            // ==================================
                            // GET LATEST MEMBERSHIP
                            // ==================================

                            const membership =
                                await Membership.findOne({
                                    user: user._id
                                })
                                    .sort({
                                        createdAt: -1
                                    })
                                    .lean();


                            // ==================================
                            // RESERVATION COUNT
                            // ==================================

                            const reservations =
                                await Reservation.countDocuments({
                                    user: user._id
                                });


                            // ==================================
                            // DEFAULT STATUS
                            // ==================================

                            let status =
                                "Active";


                            // ==================================
                            // INACTIVE ACCOUNT
                            // ==================================

                            if (
                                user.isActive === false
                            ) {

                                status =
                                    "Inactive";

                            }


                            // ==================================
                            // MEMBERSHIP STATUS
                            // ==================================

                            else if (
                                membership
                            ) {

                                const today =
                                    new Date();


                                const expiryDate =
                                    membership.expiryDate
                                        ? new Date(
                                            membership.expiryDate
                                        )
                                        : null;


                                if (expiryDate) {

                                    const difference =
                                        expiryDate.getTime() -
                                        today.getTime();


                                    const daysRemaining =
                                        Math.ceil(
                                            difference /
                                            (
                                                1000 *
                                                60 *
                                                60 *
                                                24
                                            )
                                        );


                                    if (
                                        membership.status ===
                                        "cancelled"
                                    ) {

                                        status =
                                            "Inactive";

                                    }


                                    else if (
                                        membership.status ===
                                        "expired" ||
                                        daysRemaining < 0
                                    ) {

                                        status =
                                            "Expired";

                                    }


                                    else if (
                                        daysRemaining <= 7
                                    ) {

                                        status =
                                            "Expiring Soon";

                                    }


                                    else {

                                        status =
                                            "Active";

                                    }

                                }

                            }


                            // ==================================
                            // STUDENT ID
                            // ==================================

                            const year =
                                user.createdAt
                                    ? new Date(
                                        user.createdAt
                                    ).getFullYear()
                                    : new Date()
                                        .getFullYear();


                            const studentId =
                                `LIB${year}${String(
                                    user._id
                                )
                                    .slice(-6)
                                    .toUpperCase()}`;


                            // ==================================
                            // JOIN DATE
                            // ==================================

                            const joinDate =
                                user.createdAt
                                    ? new Date(
                                        user.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "—";


                            // ==================================
                            // EXPIRY DATE
                            // ==================================

                            const expiryDate =
                                membership?.expiryDate
                                    ? new Date(
                                        membership.expiryDate
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                    : "—";


                            // ==================================
                            // RETURN MEMBER
                            // ==================================

                            return {

                                _id:
                                    user._id,

                                id:
                                    studentId,

                                name:
                                    user.name,

                                email:
                                    user.email,

                                phone:
                                    user.phone || "",

                                plan:
                                    membership?.planName ||
                                    "No Membership",

                                joinDate,

                                expiryDate,

                                status,

                                isActive:
                                    user.isActive !== false,

                                reservations,

                                createdAt:
                                    user.createdAt

                            };

                        }
                    )

                );


            // ==================================================
            // RESPONSE
            // ==================================================

            return res.status(200).json({

                success: true,

                members

            });

        } catch (error) {

            console.error(
                "Get admin members error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load members."

            });

        }

    }
);


// ==========================================================
// UPDATE MEMBER ACCOUNT STATUS
// ==========================================================
//
// PATCH
// http://localhost:5000/api/admin/members/:id/status
//
// Body:
// {
//     "isActive": false
// }
//
// ==========================================================

router.patch(
    "/members/:id/status",
    adminProtect,
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                isActive
            } = req.body;


            // ==================================================
            // VALIDATE
            // ==================================================

            if (
                typeof isActive !==
                "boolean"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "isActive must be true or false."

                });

            }


            // ==================================================
            // FIND MEMBER
            // ==================================================

            const member =
                await User.findById(
                    id
                );


            if (!member) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Member not found."

                });

            }


            // ==================================================
            // PREVENT ADMIN MODIFICATION
            // ==================================================

            if (
                member.role !==
                "student"
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        "Administrator account cannot be modified here."

                });

            }


            // ==================================================
            // UPDATE STATUS
            // ==================================================

            member.isActive =
                isActive;


            await member.save();


            // ==================================================
            // RESPONSE
            // ==================================================

            return res.status(200).json({

                success: true,

                message:
                    isActive
                        ? "Member activated successfully."
                        : "Member deactivated successfully.",

                member: {

                    _id:
                        member._id,

                    name:
                        member.name,

                    email:
                        member.email,

                    isActive:
                        member.isActive

                }

            });

        } catch (error) {

            console.error(
                "Update member status error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to update member status."

            });

        }

    }
);


// ==========================================================
// GET ALL MEMBERSHIPS
// ==========================================================
//
// GET
// http://localhost:5000/api/admin/memberships
//
// ==========================================================

router.get(
    "/memberships",
    adminProtect,
    async (req, res) => {

        try {

            const memberships =
                await Membership.find()
                    .populate(
                        "user",
                        "name email phone"
                    )
                    .sort({
                        createdAt: -1
                    });


            return res.status(200).json({

                success: true,

                memberships

            });

        } catch (error) {

            console.error(
                "Get admin memberships error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load memberships."

            });

        }

    }
);


// ==========================================================
// RENEW MEMBERSHIP
// ==========================================================
//
// PATCH
// http://localhost:5000/api/admin/memberships/:id/renew
//
// ==========================================================

router.patch(
    "/memberships/:id/renew",
    adminProtect,
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            // ==================================================
            // FIND MEMBERSHIP
            // ==================================================

            const membership =
                await Membership.findById(
                    id
                );


            if (!membership) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Membership not found."

                });

            }


            // ==================================================
            // DETERMINE PLAN DURATION
            // ==================================================

            let durationDays =
                30;


            if (
                String(
                    membership.planType || ""
                ).toLowerCase() === "test"
            ) {

                durationDays =
                    1;

            }


            // ==================================================
            // START DATE
            // ==================================================

            const today =
                new Date();


            const currentExpiry =
                membership.expiryDate
                    ? new Date(
                        membership.expiryDate
                    )
                    : null;


            let startDate =
                today;


            if (
                currentExpiry &&
                currentExpiry > today
            ) {

                startDate =
                    currentExpiry;

            }


            // ==================================================
            // NEW EXPIRY DATE
            // ==================================================

            const newExpiryDate =
                new Date(
                    startDate
                );


            newExpiryDate.setDate(
                newExpiryDate.getDate() +
                durationDays
            );


            // ==================================================
            // UPDATE MEMBERSHIP
            // ==================================================

            membership.startDate =
                startDate;


            membership.expiryDate =
                newExpiryDate;


            membership.status =
                "active";


            await membership.save();


            // ==================================================
            // GET UPDATED MEMBERSHIP
            // ==================================================

            const updatedMembership =
                await Membership.findById(
                    membership._id
                )
                    .populate(
                        "user",
                        "name email phone"
                    );


            // ==================================================
            // RESPONSE
            // ==================================================

            return res.status(200).json({

                success: true,

                message:
                    "Membership renewed successfully.",

                membership:
                    updatedMembership

            });

        } catch (error) {

            console.error(
                "Renew admin membership error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to renew membership."

            });

        }

    }
);


// ==========================================================
// GET ALL PAYMENTS
// ==========================================================
//
// GET
// http://localhost:5000/api/admin/payments
//
// ==========================================================

router.get(
    "/payments",
    adminProtect,
    async (req, res) => {

        try {

            const payments =
                await Payment.find()
                    .populate(
                        "user",
                        "name email phone"
                    )
                    .populate(
                        "membership",
                        "planName planType monthlyFee startDate expiryDate"
                    )
                    .sort({
                        paymentDate: -1,
                        createdAt: -1
                    });


            return res.status(200).json({

                success: true,

                payments

            });

        } catch (error) {

            console.error(
                "Get admin payments error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to load payments."

            });

        }

    }
);


// ==========================================================
// UPDATE PAYMENT STATUS
// ==========================================================
//
// PATCH
// http://localhost:5000/api/admin/payments/:id/status
//
// Supported:
// Successful
// Pending
// Failed
//
// ==========================================================

router.patch(
    "/payments/:id/status",
    adminProtect,
    async (req, res) => {

        try {

            const {
                id
            } = req.params;


            const {
                status
            } = req.body;


            // ==================================================
            // VALID PAYMENT STATUSES
            // ==================================================

            const allowedStatuses = [

                "Successful",

                "Pending",

                "Failed"

            ];


            if (
                !allowedStatuses.includes(
                    status
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid payment status."

                });

            }


            // ==================================================
            // UPDATE PAYMENT
            // ==================================================

            const payment =
                await Payment
                    .findByIdAndUpdate(
                        id,
                        {
                            status
                        },
                        {
                            new: true,
                            runValidators: true
                        }
                    )
                    .populate(
                        "user",
                        "name email phone"
                    )
                    .populate(
                        "membership",
                        "planName planType monthlyFee startDate expiryDate"
                    );


            // ==================================================
            // CHECK PAYMENT
            // ==================================================

            if (!payment) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Payment not found."

                });

            }


            // ==================================================
            // RESPONSE
            // ==================================================

            return res.status(200).json({

                success: true,

                message:
                    "Payment status updated successfully.",

                payment

            });

        } catch (error) {

            console.error(
                "Update admin payment status error:",
                error
            );


            return res.status(500).json({

                success: false,

                message:
                    "Unable to update payment status."

            });

        }

    }
);


// ==========================================================
// EXPORT ROUTER
// ==========================================================

module.exports = router;