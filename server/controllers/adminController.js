const User = require("../models/User");
const Membership = require("../models/Membership");
const Reservation = require("../models/Reservation");
const Payment = require("../models/Payment");

// ==========================================================
// GET ADMIN DASHBOARD DATA
// ==========================================================
const getAdminDashboard = async (req, res) => {
    try {

        // ==================================================
        // DATE HELPERS
        // ==================================================

        const now = new Date();

        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);


        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const startOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            1
        );

        const endOfPreviousMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            0,
            23,
            59,
            59,
            999
        );


        // ==================================================
        // USERS
        // ==================================================

        const totalMembers = await User.countDocuments({
            role: "student"
        });


        const newMembersThisMonth =
            await User.countDocuments({
                role: "student",
                createdAt: {
                    $gte: startOfMonth
                }
            });


        const newMembersPreviousMonth =
            await User.countDocuments({
                role: "student",
                createdAt: {
                    $gte: startOfPreviousMonth,
                    $lte: endOfPreviousMonth
                }
            });


        // ==================================================
        // MEMBERSHIPS
        // ==================================================

        const activeMemberships =
            await Membership.countDocuments({
                status: "active"
            });


        const expiredMemberships =
            await Membership.countDocuments({
                status: "expired"
            });


        const sevenDaysFromNow = new Date(now);

        sevenDaysFromNow.setDate(
            sevenDaysFromNow.getDate() + 7
        );


        const expiringSoonMemberships =
            await Membership.countDocuments({
                status: "active",
                expiryDate: {
                    $gte: now,
                    $lte: sevenDaysFromNow
                }
            });


        // ==================================================
        // TODAY'S RESERVATIONS
        // ==================================================

        const todayReservations =
            await Reservation.countDocuments({
                reservationDate: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });


        const pendingReservations =
            await Reservation.countDocuments({
                status: "pending"
            });


        // ==================================================
        // TODAY'S REVENUE
        // ==================================================

        const todaySuccessfulPayments =
            await Payment.find({
                status: "Successful",
                paymentDate: {
                    $gte: startOfToday,
                    $lte: endOfToday
                }
            });


        const todayRevenue =
            todaySuccessfulPayments.reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


        // ==================================================
        // THIS MONTH PAYMENTS
        // ==================================================

        const monthlyPayments =
            await Payment.find({
                paymentDate: {
                    $gte: startOfMonth
                }
            });


        const monthlySuccessfulPayments =
            monthlyPayments.filter(
                payment =>
                    payment.status === "Successful"
            );


        const monthlyPendingPayments =
            monthlyPayments.filter(
                payment =>
                    payment.status === "Pending"
            );


        const monthlyFailedPayments =
            monthlyPayments.filter(
                payment =>
                    payment.status === "Failed"
            );


        const monthlyRevenue =
            monthlySuccessfulPayments.reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


        // ==================================================
        // PREVIOUS MONTH REVENUE
        // ==================================================

        const previousMonthPayments =
            await Payment.find({
                paymentDate: {
                    $gte: startOfPreviousMonth,
                    $lte: endOfPreviousMonth
                },
                status: "Successful"
            });


        const previousMonthRevenue =
            previousMonthPayments.reduce(
                (total, payment) =>
                    total + Number(payment.amount || 0),
                0
            );


        // ==================================================
        // REVENUE GROWTH
        // ==================================================

        let revenueGrowth = 0;

        if (previousMonthRevenue > 0) {

            revenueGrowth =
                (
                    (
                        monthlyRevenue -
                        previousMonthRevenue
                    ) /
                    previousMonthRevenue
                ) * 100;

        } else if (monthlyRevenue > 0) {

            revenueGrowth = 100;

        }


        // ==================================================
        // MEMBER GROWTH
        // ==================================================

        let memberGrowth = 0;

        if (newMembersPreviousMonth > 0) {

            memberGrowth =
                (
                    (
                        newMembersThisMonth -
                        newMembersPreviousMonth
                    ) /
                    newMembersPreviousMonth
                ) * 100;

        } else if (newMembersThisMonth > 0) {

            memberGrowth = 100;

        }


        // ==================================================
        // MEMBERSHIP GROWTH
        // ==================================================

        const previousMonthActiveMemberships =
            await Membership.countDocuments({
                status: "active",
                createdAt: {
                    $lte: endOfPreviousMonth
                }
            });


        let membershipGrowth = 0;

        if (
            previousMonthActiveMemberships > 0
        ) {

            membershipGrowth =
                (
                    (
                        activeMemberships -
                        previousMonthActiveMemberships
                    ) /
                    previousMonthActiveMemberships
                ) * 100;

        }


        // ==================================================
        // RESERVATION GROWTH
        // ==================================================

        const todayReservationsStart =
            startOfToday;

        const yesterdayStart = new Date(
            startOfToday
        );

        yesterdayStart.setDate(
            yesterdayStart.getDate() - 1
        );


        const yesterdayEnd = new Date(
            startOfToday
        );

        yesterdayEnd.setMilliseconds(-1);


        const yesterdayReservations =
            await Reservation.countDocuments({
                reservationDate: {
                    $gte: yesterdayStart,
                    $lte: yesterdayEnd
                }
            });


        let reservationGrowth = 0;

        if (yesterdayReservations > 0) {

            reservationGrowth =
                (
                    (
                        todayReservations -
                        yesterdayReservations
                    ) /
                    yesterdayReservations
                ) * 100;

        } else if (todayReservations > 0) {

            reservationGrowth = 100;

        }


        // ==================================================
        // SEAT OCCUPANCY
        // ==================================================
        //
        // LibraSpace currently has 100 seats.
        // Reservations for today are used to calculate
        // reserved seats.
        //
        // A seat is counted once even if it has multiple
        // reservations today.
        // ==================================================

        const todaySeatReservations =
            await Reservation.find({
                reservationDate: {
                    $gte: startOfToday,
                    $lte: endOfToday
                },
                status: {
                    $in: [
                        "confirmed",
                        "completed"
                    ]
                }
            });


        const reservedSeatNumbers =
            [
                ...new Set(
                    todaySeatReservations.map(
                        reservation =>
                            reservation.seatNumber
                    )
                )
            ];


        const totalSeats = 100;

        const reservedSeats =
            reservedSeatNumbers.length;


        const occupiedSeats =
            todaySeatReservations.filter(
                reservation =>
                    reservation.status ===
                    "confirmed"
            ).length;


        const availableSeats =
            Math.max(
                0,
                totalSeats - reservedSeats
            );


        const occupancyPercentage =
            Math.round(
                (
                    reservedSeats /
                    totalSeats
                ) * 100
            );


        // ==================================================
        // RECENT RESERVATIONS
        // ==================================================

        const recentReservations =
            await Reservation.find({})
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1
                })
                .limit(5);


        // ==================================================
        // RECENT ACTIVITIES
        // ==================================================

        const recentMemberships =
            await Membership.find({})
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt: -1
                })
                .limit(3);


        const recentPayments =
            await Payment.find({})
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    paymentDate: -1
                })
                .limit(3);


        // ==================================================
        // RESPONSE
        // ==================================================

        res.status(200).json({

            success: true,

            date: now,

            statistics: {

                totalMembers,

                newMembersThisMonth,

                memberGrowth:
                    Number(
                        memberGrowth.toFixed(1)
                    ),

                activeMemberships,

                expiringSoonMemberships,

                expiredMemberships,

                membershipGrowth:
                    Number(
                        membershipGrowth.toFixed(1)
                    ),

                todayReservations,

                pendingReservations,

                reservationGrowth:
                    Number(
                        reservationGrowth.toFixed(1)
                    ),

                todayRevenue,

                todaySuccessfulPayments:
                    todaySuccessfulPayments.length,

                revenueGrowth:
                    Number(
                        revenueGrowth.toFixed(1)
                    )
            },


            occupancy: {

                totalSeats,

                availableSeats,

                reservedSeats,

                occupiedSeats,

                occupancyPercentage
            },


            membershipOverview: {

                active:
                    activeMemberships,

                expiringSoon:
                    expiringSoonMemberships,

                expired:
                    expiredMemberships
            },


            paymentOverview: {

                monthlyRevenue,

                monthlySuccessful:
                    monthlySuccessfulPayments.length,

                monthlyPending:
                    monthlyPendingPayments.length,

                monthlyFailed:
                    monthlyFailedPayments.length,

                revenueGrowth:
                    Number(
                        revenueGrowth.toFixed(1)
                    )
            },


            recentReservations,

            recentMemberships,

            recentPayments

        });

    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Unable to load admin dashboard data.",

            error:
                error.message

        });

    }
};


module.exports = {
    getAdminDashboard
};