const User = require("../models/User");
const Membership = require("../models/Membership");
const Reservation = require("../models/Reservation");
const Payment = require("../models/Payment");
const Seat = require("../models/Seat");


// ==========================================================
// DATE HELPERS
// ==========================================================

const getStartOfDay = (date) => {

    const result = new Date(date);

    result.setHours(
        0,
        0,
        0,
        0
    );

    return result;

};


const getEndOfDay = (date) => {

    const result = new Date(date);

    result.setHours(
        23,
        59,
        59,
        999
    );

    return result;

};


const getStartOfMonth = (
    year,
    month
) => {

    return new Date(
        year,
        month,
        1,
        0,
        0,
        0,
        0
    );

};


const getEndOfMonth = (
    year,
    month
) => {

    return new Date(
        year,
        month + 1,
        0,
        23,
        59,
        59,
        999
    );

};


const calculateGrowth = (
    current,
    previous
) => {

    if (
        previous === 0
    ) {

        return current > 0
            ? 100
            : 0;

    }


    return Number(
        (
            (
                (
                    current -
                    previous
                ) /
                previous
            ) *
            100
        ).toFixed(1)
    );

};


// ==========================================================
// GET ADMIN DASHBOARD DATA
// ==========================================================

const getAdminDashboard = async (
    req,
    res
) => {

    try {

        // ==================================================
        // DATE HELPERS
        // ==================================================

        const now =
            new Date();

        const startOfToday =
            getStartOfDay(
                now
            );

        const endOfToday =
            getEndOfDay(
                now
            );


        const startOfMonth =
            getStartOfMonth(
                now.getFullYear(),
                now.getMonth()
            );


        const startOfPreviousMonth =
            getStartOfMonth(
                now.getFullYear(),
                now.getMonth() - 1
            );


        const endOfPreviousMonth =
            getEndOfMonth(
                now.getFullYear(),
                now.getMonth() - 1
            );


        // ==================================================
        // USERS
        // ==================================================

        const totalMembers =
            await User.countDocuments({
                role: "student"
            });


        const newMembersThisMonth =
            await User.countDocuments({

                role: "student",

                createdAt: {
                    $gte:
                        startOfMonth,

                    $lte:
                        endOfToday
                }

            });


        const newMembersPreviousMonth =
            await User.countDocuments({

                role: "student",

                createdAt: {
                    $gte:
                        startOfPreviousMonth,

                    $lte:
                        endOfPreviousMonth
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


        const sevenDaysFromNow =
            new Date(now);

        sevenDaysFromNow.setDate(
            sevenDaysFromNow.getDate() +
            7
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
        // TODAY RESERVATIONS
        // ==================================================

        const todayReservations =
            await Reservation.countDocuments({

                reservationDate: {
                    $gte:
                        startOfToday,

                    $lte:
                        endOfToday
                }

            });


        const pendingReservations =
            await Reservation.countDocuments({
                status: "pending"
            });


        // ==================================================
        // TODAY PAYMENTS
        // ==================================================

        const todaySuccessfulPayments =
            await Payment.find({

                status:
                    "Successful",

                paymentDate: {

                    $gte:
                        startOfToday,

                    $lte:
                        endOfToday

                }

            });


        const todayRevenue =
            todaySuccessfulPayments.reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount ||
                        0
                    ),
                0
            );


        // ==================================================
        // THIS MONTH PAYMENTS
        // ==================================================

        const monthlyPayments =
            await Payment.find({

                paymentDate: {
                    $gte:
                        startOfMonth,
                    $lte:
                        endOfToday
                }

            });


        const monthlySuccessfulPayments =
            monthlyPayments.filter(
                (payment) =>
                    payment.status ===
                    "Successful"
            );


        const monthlyPendingPayments =
            monthlyPayments.filter(
                (payment) =>
                    payment.status ===
                    "Pending"
            );


        const monthlyFailedPayments =
            monthlyPayments.filter(
                (payment) =>
                    payment.status ===
                    "Failed"
            );


        const monthlyRevenue =
            monthlySuccessfulPayments.reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount ||
                        0
                    ),
                0
            );


        // ==================================================
        // PREVIOUS MONTH REVENUE
        // ==================================================

        const previousMonthPayments =
            await Payment.find({

                paymentDate: {

                    $gte:
                        startOfPreviousMonth,

                    $lte:
                        endOfPreviousMonth

                },

                status:
                    "Successful"

            });


        const previousMonthRevenue =
            previousMonthPayments.reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount ||
                        0
                    ),
                0
            );


        const revenueGrowth =
            calculateGrowth(
                monthlyRevenue,
                previousMonthRevenue
            );


        // ==================================================
        // MEMBER GROWTH
        // ==================================================

        const memberGrowth =
            calculateGrowth(
                newMembersThisMonth,
                newMembersPreviousMonth
            );


        // ==================================================
        // MEMBERSHIP GROWTH
        // ==================================================

        const previousMonthActiveMemberships =
            await Membership.countDocuments({

                status:
                    "active",

                createdAt: {
                    $lte:
                        endOfPreviousMonth
                }

            });


        const membershipGrowth =
            calculateGrowth(
                activeMemberships,
                previousMonthActiveMemberships
            );


        // ==================================================
        // RESERVATION GROWTH
        // ==================================================

        const yesterdayStart =
            new Date(
                startOfToday
            );

        yesterdayStart.setDate(
            yesterdayStart.getDate() -
            1
        );


        const yesterdayEnd =
            new Date(
                startOfToday
            );

        yesterdayEnd.setMilliseconds(
            -1
        );


        const yesterdayReservations =
            await Reservation.countDocuments({

                reservationDate: {

                    $gte:
                        yesterdayStart,

                    $lte:
                        yesterdayEnd

                }

            });


        const reservationGrowth =
            calculateGrowth(
                todayReservations,
                yesterdayReservations
            );


        // ==================================================
        // SEAT OCCUPANCY
        // ==================================================

        const totalSeats =
            await Seat.countDocuments();


        const occupiedSeatCount =
            await Seat.countDocuments({

                status: {
                    $in: [
                        "Reserved",
                        "Occupied"
                    ]
                }

            });


        const availableSeats =
            Math.max(
                0,
                totalSeats -
                occupiedSeatCount
            );


        const occupancyPercentage =
            totalSeats > 0

                ? Math.round(
                    (
                        occupiedSeatCount /
                        totalSeats
                    ) *
                    100
                )

                : 0;


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
                    createdAt:
                        -1
                })
                .limit(5);


        // ==================================================
        // RECENT MEMBERSHIPS
        // ==================================================

        const recentMemberships =
            await Membership.find({})
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    createdAt:
                        -1
                })
                .limit(3);


        // ==================================================
        // RECENT PAYMENTS
        // ==================================================

        const recentPayments =
            await Payment.find({})
                .populate(
                    "user",
                    "name email"
                )
                .sort({
                    paymentDate:
                        -1
                })
                .limit(3);


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            date:
                now,

            statistics: {

                totalMembers,

                newMembersThisMonth,

                memberGrowth,

                activeMemberships,

                expiringSoonMemberships,

                expiredMemberships,

                membershipGrowth,

                todayReservations,

                pendingReservations,

                reservationGrowth,

                todayRevenue,

                todaySuccessfulPayments:
                    todaySuccessfulPayments.length,

                revenueGrowth

            },


            occupancy: {

                totalSeats,

                availableSeats,

                reservedSeats:
                    occupiedSeatCount,

                occupiedSeats:
                    occupiedSeatCount,

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

                revenueGrowth

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


        return res.status(500).json({

            success: false,

            message:
                "Unable to load admin dashboard data.",

            error:
                error.message

        });

    }

};


// ==========================================================
// GET ADMIN REPORTS
// ==========================================================
//
// GET
// http://localhost:5000/api/admin/reports
//
// All values are calculated from:
// Users
// Memberships
// Reservations
// Payments
// Seats
//
// ==========================================================

const getAdminReports = async (
    req,
    res
) => {

    try {

        // ==================================================
        // CURRENT DATE
        // ==================================================

        const now =
            new Date();


        const currentYear =
            now.getFullYear();


        const currentMonth =
            now.getMonth();


        const startOfYear =
            new Date(
                currentYear,
                0,
                1,
                0,
                0,
                0,
                0
            );


        const endOfYear =
            new Date(
                currentYear,
                11,
                31,
                23,
                59,
                59,
                999
            );


        // ==================================================
        // GET ALL REQUIRED DATA
        // ==================================================

        const [
            users,
            memberships,
            reservations,
            payments,
            seats
        ] = await Promise.all([

            User.find({
                role:
                    "student"
            }).lean(),

            Membership.find({}).lean(),

            Reservation.find({}).lean(),

            Payment.find({}).lean(),

            Seat.find({}).lean()

        ]);


        // ==================================================
        // YEAR DATA
        // ==================================================

        const yearUsers =
            users.filter(
                (user) => {

                    if (
                        !user.createdAt
                    ) {

                        return false;

                    }


                    const date =
                        new Date(
                            user.createdAt
                        );


                    return (
                        date >=
                            startOfYear &&
                        date <=
                            new Date()
                    );

                }
            );


        const yearReservations =
            reservations.filter(
                (reservation) => {

                    const date =
                        new Date(
                            reservation.reservationDate
                        );


                    return (
                        date >=
                            startOfYear &&
                        date <=
                            now
                    );

                }
            );


        const yearPayments =
            payments.filter(
                (payment) => {

                    if (
                        !payment.paymentDate
                    ) {

                        return false;

                    }


                    const date =
                        new Date(
                            payment.paymentDate
                        );


                    return (
                        date >=
                            startOfYear &&
                        date <=
                            now
                    );

                }
            );


        const successfulYearPayments =
            yearPayments.filter(
                (payment) =>
                    payment.status ===
                    "Successful"
            );


        const pendingYearPayments =
            yearPayments.filter(
                (payment) =>
                    payment.status ===
                    "Pending"
            );


        const failedYearPayments =
            yearPayments.filter(
                (payment) =>
                    payment.status ===
                    "Failed"
            );


        const totalRevenue =
            successfulYearPayments.reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount ||
                        0
                    ),
                0
            );


        // ==================================================
        // CURRENT MONTH
        // ==================================================

        const startCurrentMonth =
            getStartOfMonth(
                currentYear,
                currentMonth
            );


        const endCurrentMonth =
            getEndOfMonth(
                currentYear,
                currentMonth
            );


        const currentMonthPayments =
            yearPayments.filter(
                (payment) => {

                    const date =
                        new Date(
                            payment.paymentDate
                        );


                    return (
                        date >=
                            startCurrentMonth &&
                        date <=
                            endCurrentMonth
                    );

                }
            );


        const currentMonthSuccessfulPayments =
            currentMonthPayments.filter(
                (payment) =>
                    payment.status ===
                    "Successful"
            );


        const currentMonthRevenue =
            currentMonthSuccessfulPayments.reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount ||
                        0
                    ),
                0
            );


        const currentMonthReservations =
            yearReservations.filter(
                (reservation) => {

                    const date =
                        new Date(
                            reservation.reservationDate
                        );


                    return (
                        date >=
                            startCurrentMonth &&
                        date <=
                            endCurrentMonth
                    );

                }
            );


        const currentMonthMembers =
            yearUsers.filter(
                (user) => {

                    const date =
                        new Date(
                            user.createdAt
                        );


                    return (
                        date >=
                            startCurrentMonth &&
                        date <=
                            endCurrentMonth
                    );

                }
            );


        // ==================================================
        // PREVIOUS MONTH
        // ==================================================

        const previousMonthDate =
            new Date(
                currentYear,
                currentMonth - 1,
                1
            );


        const previousYear =
            previousMonthDate
                .getFullYear();


        const previousMonth =
            previousMonthDate
                .getMonth();


        const startPreviousMonth =
            getStartOfMonth(
                previousYear,
                previousMonth
            );


        const endPreviousMonth =
            getEndOfMonth(
                previousYear,
                previousMonth
            );


        const previousMonthPayments =
            payments.filter(
                (payment) => {

                    if (
                        !payment.paymentDate
                    ) {

                        return false;

                    }


                    const date =
                        new Date(
                            payment.paymentDate
                        );


                    return (
                        date >=
                            startPreviousMonth &&
                        date <=
                            endPreviousMonth &&
                        payment.status ===
                            "Successful"
                    );

                }
            );


        const previousMonthRevenue =
            previousMonthPayments.reduce(
                (
                    total,
                    payment
                ) =>
                    total +
                    Number(
                        payment.amount ||
                        0
                    ),
                0
            );


        const previousMonthReservations =
            reservations.filter(
                (reservation) => {

                    const date =
                        new Date(
                            reservation.reservationDate
                        );


                    return (
                        date >=
                            startPreviousMonth &&
                        date <=
                            endPreviousMonth
                    );

                }
            ).length;


        const previousMonthMembers =
            users.filter(
                (user) => {

                    if (
                        !user.createdAt
                    ) {

                        return false;

                    }


                    const date =
                        new Date(
                            user.createdAt
                        );


                    return (
                        date >=
                            startPreviousMonth &&
                        date <=
                            endPreviousMonth
                    );

                }
            ).length;


        // ==================================================
        // MONTHLY REPORT DATA
        // ==================================================

        const monthlyData =
            [];


        for (
            let monthIndex = 0;
            monthIndex <= currentMonth;
            monthIndex++
        ) {

            const monthStart =
                getStartOfMonth(
                    currentYear,
                    monthIndex
                );


            const monthEnd =
                getEndOfMonth(
                    currentYear,
                    monthIndex
                );


            // ==============================================
            // MONTH PAYMENTS
            // ==============================================

            const monthPayments =
                payments.filter(
                    (payment) => {

                        if (
                            !payment.paymentDate
                        ) {

                            return false;

                        }


                        const date =
                            new Date(
                                payment.paymentDate
                            );


                        return (
                            date >=
                                monthStart &&
                            date <=
                                monthEnd
                        );

                    }
                );


            const monthSuccessfulPayments =
                monthPayments.filter(
                    (payment) =>
                        payment.status ===
                        "Successful"
                );


            const monthRevenue =
                monthSuccessfulPayments.reduce(
                    (
                        total,
                        payment
                    ) =>
                        total +
                        Number(
                            payment.amount ||
                            0
                        ),
                    0
                );


            // ==============================================
            // MONTH RESERVATIONS
            // ==============================================

            const monthReservations =
                reservations.filter(
                    (reservation) => {

                        const date =
                            new Date(
                                reservation.reservationDate
                            );


                        return (
                            date >=
                                monthStart &&
                            date <=
                                monthEnd
                        );

                    }
                );


            // ==============================================
            // MONTH MEMBERS
            // ==============================================

            const monthMembers =
                users.filter(
                    (user) => {

                        if (
                            !user.createdAt
                        ) {

                            return false;

                        }


                        const date =
                            new Date(
                                user.createdAt
                            );


                        return (
                            date >=
                                monthStart &&
                            date <=
                                monthEnd
                        );

                    }
                );


            // ==============================================
            // UNIQUE RESERVED SEATS
            // ==============================================

            const uniqueSeatNumbers =
                new Set(

                    monthReservations
                        .filter(
                            (
                                reservation
                            ) =>
                                reservation.status ===
                                    "confirmed" ||
                                reservation.status ===
                                    "completed"
                        )
                        .map(
                            (
                                reservation
                            ) =>
                                reservation.seatNumber
                        )

                );


            const monthlySeatUtilization =
                seats.length > 0

                    ? Math.round(
                        (
                            uniqueSeatNumbers.size /
                            seats.length
                        ) *
                        100
                    )

                    : 0;


            monthlyData.push({

                month:
                    monthStart.toLocaleDateString(
                        "en-US",
                        {
                            month:
                                "short"
                        }
                    ),

                monthName:
                    monthStart.toLocaleDateString(
                        "en-US",
                        {
                            month:
                                "long"
                        }
                    ),

                year:
                    currentYear,

                revenue:
                    monthRevenue,

                reservations:
                    monthReservations.length,

                members:
                    monthMembers.length,

                occupancy:
                    monthlySeatUtilization,

                successfulPayments:
                    monthSuccessfulPayments.length,

                pendingPayments:
                    monthPayments.filter(
                        (payment) =>
                            payment.status ===
                            "Pending"
                    ).length,

                failedPayments:
                    monthPayments.filter(
                        (payment) =>
                            payment.status ===
                            "Failed"
                    ).length

            });

        }


        // ==================================================
        // ACTIVE MEMBERSHIPS
        // ==================================================

        const activeMembershipRecords =
            memberships.filter(
                (membership) => {

                    if (
                        membership.status !==
                        "active"
                    ) {

                        return false;

                    }


                    if (
                        !membership.expiryDate
                    ) {

                        return true;

                    }


                    return (
                        new Date(
                            membership.expiryDate
                        ) >=
                        now
                    );

                }
            );


        // ==================================================
        // MEMBERSHIP PLAN DISTRIBUTION
        // ==================================================

        const planCounts =
            {};


        activeMembershipRecords.forEach(
            (membership) => {

                const planName =
                    membership.planName ||
                    "Other";


                planCounts[planName] =
                    (
                        planCounts[planName] ||
                        0
                    ) + 1;

            }
        );


        const membershipPlans =
            Object.entries(
                planCounts
            )
                .map(
                    (
                        [
                            name,
                            count
                        ]
                    ) => {

                        const percentage =
                            activeMembershipRecords.length >
                            0

                                ? Number(
                                    (
                                        (
                                            count /
                                            activeMembershipRecords.length
                                        ) *
                                        100
                                    ).toFixed(1)
                                )

                                : 0;


                        let icon =
                            "fa-book-open";


                        if (
                            name ===
                            "Premium Reader"
                        ) {

                            icon =
                                "fa-crown";

                        }


                        return {

                            name,

                            count,

                            percentage,

                            icon

                        };

                    }
                )
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.count -
                        a.count
                );


        // ==================================================
        // CURRENT SEAT OCCUPANCY
        // ==================================================

        const usedSeats =
            seats.filter(
                (seat) =>
                    seat.status ===
                        "Reserved" ||
                    seat.status ===
                        "Occupied"
            );


        const currentOccupancy =
            seats.length > 0

                ? Math.round(
                    (
                        usedSeats.length /
                        seats.length
                    ) * 100
                )

                : 0;


        // ==================================================
        // SEAT USAGE BY SECTION
        // ==================================================

        const sectionNames = [

            "Reading Hall",

            "Reference Hall",

            "Silent Zone",

            "Computer Section"

        ];


        const sectionIcons = {

            "Reading Hall":
                "fa-book-open-reader",

            "Reference Hall":
                "fa-book",

            "Silent Zone":
                "fa-volume-xmark",

            "Computer Section":
                "fa-computer"

        };


        const seatUsage =
            sectionNames.map(
                (
                    sectionName
                ) => {

                    const sectionSeats =
                        seats.filter(
                            (seat) =>
                                seat.section ===
                                sectionName
                        );


                    const sectionUsed =
                        sectionSeats.filter(
                            (seat) =>
                                seat.status ===
                                    "Reserved" ||
                                seat.status ===
                                    "Occupied"
                        );


                    const sectionTotal =
                        sectionSeats.length;


                    const percentage =
                        sectionTotal > 0

                            ? Math.round(
                                (
                                    sectionUsed.length /
                                    sectionTotal
                                ) * 100
                            )

                            : 0;


                    return {

                        name:
                            sectionName,

                        percentage,

                        seats:
                            sectionUsed.length,

                        total:
                            sectionTotal,

                        icon:
                            sectionIcons[
                                sectionName
                            ]

                    };

                }
            );


        // ==================================================
        // PAYMENT OVERVIEW
        // ==================================================

        const paymentSuccessRate =
            yearPayments.length > 0

                ? Number(
                    (
                        (
                            successfulYearPayments.length /
                            yearPayments.length
                        ) *
                        100
                    ).toFixed(1)
                )

                : 0;


        const averagePayment =
            successfulYearPayments.length > 0

                ? Math.round(
                    totalRevenue /
                    successfulYearPayments.length
                )

                : 0;


        // ==================================================
        // GROWTH
        // ==================================================

        const monthlyRevenueGrowth =
            calculateGrowth(
                currentMonthRevenue,
                previousMonthRevenue
            );


        const monthlyReservationGrowth =
            calculateGrowth(
                currentMonthReservations.length,
                previousMonthReservations
            );


        const monthlyMemberGrowth =
            calculateGrowth(
                currentMonthMembers.length,
                previousMonthMembers
            );


        // ==================================================
        // CURRENT MONTH DATA
        // ==================================================

        const currentMonthData =
            monthlyData.length > 0

                ? monthlyData[
                    monthlyData.length - 1
                ]

                : {

                    month:
                        now.toLocaleDateString(
                            "en-US",
                            {
                                month:
                                    "short"
                            }
                        ),

                    monthName:
                        now.toLocaleDateString(
                            "en-US",
                            {
                                month:
                                    "long"
                            }
                        ),

                    year:
                        currentYear,

                    revenue:
                        0,

                    reservations:
                        0,

                    members:
                        0,

                    occupancy:
                        currentOccupancy

                };


        // ==================================================
        // RECENT PERFORMANCE
        // ==================================================

        const recentPerformance =
            [...monthlyData]
                .reverse()
                .slice(
                    0,
                    5
                )
                .map(
                    (
                        item
                    ) => ({

                        month:
                            `${item.monthName} ${item.year}`,

                        revenue:
                            item.revenue,

                        reservations:
                            item.reservations,

                        members:
                            item.members,

                        occupancy:
                            item.occupancy

                    })
                );


        // ==================================================
        // HIGHEST OCCUPANCY SECTION
        // ==================================================

        const highestOccupancySection =
            [...seatUsage]
                .sort(
                    (
                        a,
                        b
                    ) =>
                        b.percentage -
                        a.percentage
                )[0] || null;


        // ==================================================
        // PREMIUM PLAN
        // ==================================================

        const premiumPlan =
            membershipPlans.find(
                (plan) =>
                    plan.name ===
                    "Premium Reader"
            );


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            success:
                true,

            generatedAt:
                now,

            period: {

                year:
                    currentYear,

                currentMonth:
                    currentMonth + 1,

                start:
                    startOfYear,

                end:
                    now

            },


            statistics: {

                totalRevenue,

                totalReservations:
                    yearReservations.length,

                totalNewMembers:
                    yearUsers.length,

                averageOccupancy:
                    currentOccupancy,

                activeMembers:
                    users.filter(
                        (user) =>
                            user.isActive !==
                            false
                    ).length

            },


            currentMonth: {

                revenue:
                    currentMonthRevenue,

                reservations:
                    currentMonthReservations.length,

                members:
                    currentMonthMembers.length,

                occupancy:
                    currentOccupancy,

                revenueGrowth:
                    monthlyRevenueGrowth,

                reservationGrowth:
                    monthlyReservationGrowth,

                memberGrowth:
                    monthlyMemberGrowth

            },


            paymentOverview: {

                totalTransactions:
                    yearPayments.length,

                successful:
                    successfulYearPayments.length,

                pending:
                    pendingYearPayments.length,

                failed:
                    failedYearPayments.length,

                totalRevenue,

                pendingAmount:
                    pendingYearPayments.reduce(
                        (
                            total,
                            payment
                        ) =>
                            total +
                            Number(
                                payment.amount ||
                                0
                            ),
                        0
                    ),

                successRate:
                    paymentSuccessRate,

                averagePayment

            },


            membershipOverview: {

                total:
                    memberships.length,

                active:
                    activeMembershipRecords.length,

                expiringSoon:
                    memberships.filter(
                        (membership) => {

                            if (
                                membership.status !==
                                "active" ||
                                !membership.expiryDate
                            ) {

                                return false;

                            }


                            const expiry =
                                new Date(
                                    membership.expiryDate
                                );


                            const sevenDays =
                                new Date(
                                    now
                                );


                            sevenDays.setDate(
                                sevenDays.getDate() +
                                7
                            );


                            return (
                                expiry >=
                                    now &&
                                expiry <=
                                    sevenDays
                            );

                        }
                    ).length,

                expired:
                    memberships.filter(
                        (membership) =>
                            membership.status ===
                            "expired"
                    ).length

            },


            membershipPlans,


            seatOverview: {

                total:
                    seats.length,

                used:
                    usedSeats.length,

                available:
                    Math.max(
                        0,
                        seats.length -
                        usedSeats.length
                    ),

                occupancy:
                    currentOccupancy,

                sections:
                    seatUsage

            },


            monthlyData,


            recentPerformance,


            insights: {

                revenueGrowth:
                    monthlyRevenueGrowth,

                reservationGrowth:
                    monthlyReservationGrowth,

                memberGrowth:
                    monthlyMemberGrowth,

                premiumPercentage:
                    premiumPlan
                        ? premiumPlan.percentage
                        : 0,

                highestOccupancySection:
                    highestOccupancySection
                        ? highestOccupancySection.name
                        : "—",

                highestOccupancy:
                    highestOccupancySection
                        ? highestOccupancySection.percentage
                        : 0,

                paymentSuccessRate:
                    paymentSuccessRate

            }

        });

    } catch (error) {

        console.error(
            "Admin reports error:",
            error
        );


        return res.status(500).json({

            success:
                false,

            message:
                "Unable to load admin reports.",

            error:
                error.message

        });

    }

};


// ==========================================================
// EXPORT
// ==========================================================

module.exports = {

    getAdminDashboard,

    getAdminReports

};