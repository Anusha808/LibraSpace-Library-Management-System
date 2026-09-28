const Payment = require("../models/Payment");

// =========================================
// GET MY PAYMENTS
// =========================================

const getMyPayments = async (req, res) => {

    try {

        const payments = await Payment.find({
            user: req.user.id
        })
            .sort({
                paymentDate: -1
            });

        res.status(200).json({
            payments
        });

    } catch (error) {

        console.error(
            "Get payments error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching payment history"
        });
    }
};


// =========================================
// CREATE PAYMENT
// =========================================

const createPayment = async (req, res) => {

    try {

        const {
            transactionId,
            description,
            duration,
            method,
            amount,
            status,
            paymentDate,
            membership
        } = req.body;


        if (
            !transactionId ||
            !description ||
            !duration ||
            amount === undefined
        ) {

            return res.status(400).json({
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
                message:
                    "Payment with this transaction ID already exists"
            });
        }


        const payment =
            await Payment.create({

                user: req.user.id,

                transactionId,

                description,

                duration,

                method:
                    method || "Razorpay",

                amount,

                status:
                    status || "Successful",

                paymentDate:
                    paymentDate
                        ? new Date(paymentDate)
                        : new Date(),

                membership:
                    membership || null
            });


        res.status(201).json({

            message:
                "Payment recorded successfully",

            payment

        });

    } catch (error) {

        console.error(
            "Create payment error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while creating payment"
        });
    }
};


// =========================================
// GET SINGLE PAYMENT
// =========================================

const getPaymentById = async (req, res) => {

    try {

        const { id } = req.params;


        const payment =
            await Payment.findOne({

                _id: id,

                user: req.user.id

            });


        if (!payment) {

            return res.status(404).json({
                message:
                    "Payment not found"
            });
        }


        res.status(200).json({
            payment
        });

    } catch (error) {

        console.error(
            "Get payment error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while fetching payment"
        });
    }
};


module.exports = {
    getMyPayments,
    createPayment,
    getPaymentById
};