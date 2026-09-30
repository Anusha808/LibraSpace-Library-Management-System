const crypto = require("crypto");
const Razorpay = require("razorpay");

const Payment = require("../models/Payment");
const Membership = require("../models/Membership");
const MembershipPlan = require("../models/MembershipPlan");

// =========================================================
// RAZORPAY INSTANCE
// =========================================================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// =========================================================
// HELPER - GET DURATION DAYS
// =========================================================

const getDurationDays = (duration) => {

    if (
        duration === undefined ||
        duration === null
    ) {
        return 30;
    }

    const value =
        String(duration)
            .trim()
            .toLowerCase();

    const match =
        value.match(/\d+/);

    if (!match) {
        return 30;
    }

    const number =
        Number(match[0]);

    if (
        !Number.isFinite(number) ||
        number <= 0
    ) {
        return 30;
    }

    if (
        value.includes("year") ||
        value.includes("years")
    ) {
        return number * 365;
    }

    if (
        value.includes("month") ||
        value.includes("months")
    ) {
        return number * 30;
    }

    if (
        value.includes("week") ||
        value.includes("weeks")
    ) {
        return number * 7;
    }

    return number;
};


// =========================================================
// GET MY PAYMENTS
// =========================================================
// GET /api/payments/my
// =========================================================

const getMyPayments = async (
    req,
    res
) => {

    try {

        const payments =
            await Payment.find({
                user: req.user.id
            })
                .populate("membership")
                .populate("planId")
                .sort({
                    paymentDate: -1
                });

        return res.status(200).json({

            success: true,

            payments
        });

    } catch (error) {

        console.error(
            "Get payments error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching payment history"
        });
    }
};


// =========================================================
// CREATE RAZORPAY ORDER
// =========================================================
// POST /api/payments/create-order
// =========================================================

const createRazorpayOrder = async (
    req,
    res
) => {

    try {

        const {
            amount,
            description,
            duration,
            membership,
            planId
        } = req.body;


        // =================================================
        // VALIDATE AMOUNT
        // =================================================

        const numericAmount =
            Number(amount);


        if (
            !Number.isFinite(
                numericAmount
            ) ||
            numericAmount <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "A valid payment amount is required."
            });
        }


        // =================================================
        // RAZORPAY CONFIGURATION
        // =================================================

        if (
            !process.env.RAZORPAY_KEY_ID ||
            !process.env.RAZORPAY_KEY_SECRET
        ) {

            return res.status(500).json({

                success: false,

                message:
                    "Razorpay is not configured on the server."
            });
        }


        // =================================================
        // VERIFY PLAN
        // =================================================

        let selectedPlan = null;


        if (planId) {

            selectedPlan =
                await MembershipPlan.findById(
                    planId
                );


            if (!selectedPlan) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Selected membership plan was not found."
                });
            }


            /*
            Use the database plan price
            rather than trusting the frontend amount.
            */

            if (
                selectedPlan.price !==
                undefined
            ) {

                const planPrice =
                    Number(
                        selectedPlan.price
                    );


                if (
                    !Number.isFinite(
                        planPrice
                    ) ||
                    planPrice <= 0
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Selected membership plan has an invalid price."
                    });
                }


                /*
                Use database amount.
                */

                if (
                    Math.round(
                        numericAmount * 100
                    ) !==
                    Math.round(
                        planPrice * 100
                    )
                ) {

                    return res.status(400).json({

                        success: false,

                        message:
                            "Payment amount does not match the selected membership plan."
                    });
                }
            }
        }


        // =================================================
        // VERIFY EXISTING MEMBERSHIP
        // =================================================

        let membershipRecord =
            null;


        if (membership) {

            membershipRecord =
                await Membership.findOne({

                    _id:
                        membership,

                    user:
                        req.user.id
                });


            if (!membershipRecord) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Membership was not found for this account."
                });
            }
        }


        // =================================================
        // CREATE RAZORPAY ORDER
        // =================================================

        const amountInPaise =
            Math.round(
                numericAmount * 100
            );


        const receipt =
            `LIBRA_${Date.now()}_${String(
                req.user.id
            ).slice(-6)}`;


        const order =
            await razorpay.orders.create({

                amount:
                    amountInPaise,

                currency:
                    "INR",

                receipt,

                notes: {

                    userId:
                        String(
                            req.user.id
                        ),

                    membershipId:
                        membership
                            ? String(
                                  membership
                              )
                            : "",

                    planId:
                        planId
                            ? String(
                                  planId
                              )
                            : "",

                    description:
                        description ||
                        "LibraSpace Membership Payment"
                }
            });


        // =================================================
        // SAVE PENDING PAYMENT
        // =================================================

        const payment =
            await Payment.create({

                user:
                    req.user.id,

                transactionId:
                    order.id,

                razorpayOrderId:
                    order.id,

                planId:
                    planId || null,

                description:
                    description ||
                    "LibraSpace Membership Payment",

                duration:
                    duration ||
                    selectedPlan
                        ? `${selectedPlan.durationDays} days`
                        : "30 days",

                method:
                    "Razorpay",

                amount:
                    numericAmount,

                status:
                    "Pending",

                paymentDate:
                    new Date(),

                membership:
                    membership || null
            });


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Razorpay order created successfully.",

            keyId:
                process.env.RAZORPAY_KEY_ID,

            orderId:
                order.id,

            amount:
                order.amount,

            currency:
                order.currency,

            paymentId:
                payment._id
        });

    } catch (error) {

        console.error(
            "Create Razorpay order error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.error?.description ||
                error.message ||
                "Server error while creating Razorpay order."
        });
    }
};


// =========================================================
// VERIFY RAZORPAY PAYMENT
// =========================================================
// POST /api/payments/verify
// =========================================================

const verifyRazorpayPayment = async (
    req,
    res
) => {

    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        // =================================================
        // VALIDATE RESPONSE
        // =================================================

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Razorpay payment verification data is incomplete."
            });
        }


        // =================================================
        // FIND PAYMENT
        // =================================================

        const payment =
            await Payment.findOne({

                user:
                    req.user.id,

                razorpayOrderId:
                    razorpay_order_id

            })
                .populate("planId")
                .populate("membership");


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment order was not found."
            });
        }


        // =================================================
        // ALREADY VERIFIED
        // =================================================

        if (
            payment.status ===
            "Successful"
        ) {

            return res.status(200).json({

                success: true,

                message:
                    "Payment has already been verified.",

                payment,

                membership:
                    payment.membership
            });
        }


        // =================================================
        // GENERATE SIGNATURE
        // =================================================

        const generatedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");


        // =================================================
        // SAFE SIGNATURE COMPARISON
        // =================================================

        const expectedBuffer =
            Buffer.from(
                generatedSignature,
                "utf8"
            );

        const receivedBuffer =
            Buffer.from(
                razorpay_signature,
                "utf8"
            );


        if (
            expectedBuffer.length !==
            receivedBuffer.length
        ) {

            payment.status =
                "Failed";

            await payment.save();

            return res.status(400).json({

                success: false,

                message:
                    "Payment signature verification failed."
            });
        }


        const signatureMatches =
            crypto.timingSafeEqual(
                expectedBuffer,
                receivedBuffer
            );


        if (!signatureMatches) {

            payment.status =
                "Failed";

            await payment.save();

            return res.status(400).json({

                success: false,

                message:
                    "Payment signature verification failed."
            });
        }


        // =================================================
        // PAYMENT SUCCESSFUL
        // =================================================

        payment.status =
            "Successful";

        payment.razorpayPaymentId =
            razorpay_payment_id;

        payment.razorpaySignature =
            razorpay_signature;

        payment.paymentDate =
            new Date();


        // =================================================
        // GET PLAN
        // =================================================

        let plan =
            payment.planId;


        if (
            plan &&
            typeof plan === "object"
        ) {

            // Already populated.

        } else if (
            payment.planId
        ) {

            plan =
                await MembershipPlan.findById(
                    payment.planId
                );
        }


        if (!plan) {

            payment.status =
                "Failed";

            await payment.save();

            return res.status(400).json({

                success: false,

                message:
                    "Membership plan could not be found."
            });
        }


        // =================================================
        // CHECK EXISTING MEMBERSHIP
        // =================================================

        let membership =
            payment.membership;


        // =================================================
        // NEW MEMBERSHIP
        // =================================================

        if (!membership) {

            const now =
                new Date();


            const durationDays =
                Number(
                    plan.durationDays ||
                    getDurationDays(
                        payment.duration
                    )
                );


            const expiryDate =
                new Date(now);


            expiryDate.setDate(
                expiryDate.getDate() +
                durationDays
            );


            membership =
                await Membership.create({

                    user:
                        req.user.id,

                    planName:
                        plan.name,

                    planType:
                        plan.planType,

                    monthlyFee:
                        Number(
                            plan.price || 0
                        ),

                    startDate:
                        now,

                    expiryDate,

                    status:
                        "active"
                });


            // Attach membership to payment

            payment.membership =
                membership._id;


        } else {

            // =================================================
            // EXISTING MEMBERSHIP RENEWAL
            // =================================================

            const now =
                new Date();


            const currentExpiry =
                membership.expiryDate
                    ? new Date(
                          membership.expiryDate
                      )
                    : null;


            let renewalStart =
                now;


            if (
                currentExpiry &&
                currentExpiry >
                    now
            ) {

                renewalStart =
                    currentExpiry;
            }


            const durationDays =
                Number(
                    plan.durationDays ||
                    getDurationDays(
                        payment.duration
                    )
                );


            const newExpiryDate =
                new Date(
                    renewalStart
                );


            newExpiryDate.setDate(
                newExpiryDate.getDate() +
                durationDays
            );


            membership.planName =
                plan.name;

            membership.planType =
                plan.planType;

            membership.monthlyFee =
                Number(
                    plan.price || 0
                );

            membership.expiryDate =
                newExpiryDate;

            membership.status =
                "active";


            await membership.save();

            payment.membership =
                membership._id;
        }


        // =================================================
        // SAVE SUCCESSFUL PAYMENT
        // =================================================

        await payment.save();


        // =================================================
        // GET COMPLETE PAYMENT
        // =================================================

        const completedPayment =
            await Payment.findById(
                payment._id
            )
                .populate("membership")
                .populate("planId");


        // =================================================
        // SUCCESS RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                payment.membership
                    ? "Payment verified and membership updated successfully."
                    : "Payment verified and membership created successfully.",

            payment:
                completedPayment,

            membership
        });

    } catch (error) {

        console.error(
            "Verify Razorpay payment error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Server error while verifying payment."
        });
    }
};


// =========================================================
// MARK PAYMENT FAILED
// =========================================================
// POST /api/payments/failed
// =========================================================

const markPaymentFailed = async (
    req,
    res
) => {

    try {

        const {
            razorpayOrderId,
            razorpayPaymentId
        } = req.body;


        if (!razorpayOrderId) {

            return res.status(400).json({

                success: false,

                message:
                    "Razorpay order ID is required."
            });
        }


        const payment =
            await Payment.findOne({

                user:
                    req.user.id,

                razorpayOrderId
            });


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment order was not found."
            });
        }


        payment.status =
            "Failed";


        if (
            razorpayPaymentId
        ) {

            payment.razorpayPaymentId =
                razorpayPaymentId;
        }


        await payment.save();


        return res.status(200).json({

            success: true,

            message:
                "Payment marked as failed.",

            payment
        });

    } catch (error) {

        console.error(
            "Mark payment failed error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while updating failed payment."
        });
    }
};


// =========================================================
// CREATE MANUAL PAYMENT
// =========================================================

const createPayment = async (
    req,
    res
) => {

    try {

        const {
            transactionId,
            description,
            duration,
            method,
            amount,
            status,
            paymentDate,
            membership,
            planId
        } = req.body;


        if (
            !transactionId ||
            !description ||
            !duration ||
            amount === undefined
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Transaction ID, description, duration and amount are required"
            });
        }


        const existingPayment =
            await Payment.findOne({
                transactionId
            });


        if (existingPayment) {

            return res.status(400).json({

                success: false,

                message:
                    "Payment with this transaction ID already exists"
            });
        }


        const payment =
            await Payment.create({

                user:
                    req.user.id,

                transactionId,

                description,

                duration,

                method:
                    method ||
                    "Razorpay",

                amount,

                status:
                    status ||
                    "Successful",

                paymentDate:
                    paymentDate
                        ? new Date(
                              paymentDate
                          )
                        : new Date(),

                membership:
                    membership ||
                    null,

                planId:
                    planId ||
                    null
            });


        return res.status(201).json({

            success: true,

            message:
                "Payment recorded successfully",

            payment
        });

    } catch (error) {

        console.error(
            "Create payment error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating payment"
        });
    }
};


// =========================================================
// GET SINGLE PAYMENT
// =========================================================
// GET /api/payments/:id
// =========================================================

const getPaymentById = async (
    req,
    res
) => {

    try {

        const {
            id
        } = req.params;


        const payment =
            await Payment.findOne({

                _id:
                    id,

                user:
                    req.user.id

            })
                .populate("membership")
                .populate("planId");


        if (!payment) {

            return res.status(404).json({

                success: false,

                message:
                    "Payment not found"
            });
        }


        return res.status(200).json({

            success: true,

            payment
        });

    } catch (error) {

        console.error(
            "Get payment error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while fetching payment"
        });
    }
};


// =========================================================
// EXPORTS
// =========================================================

module.exports = {

    getMyPayments,

    createPayment,

    getPaymentById,

    createRazorpayOrder,

    verifyRazorpayPayment,

    markPaymentFailed
};