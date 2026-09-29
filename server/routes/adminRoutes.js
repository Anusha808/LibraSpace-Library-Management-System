const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const {
    getAdminDashboard
} = require("../controllers/adminController");


// ==========================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ==========================================================

const adminProtect = async (
    req,
    res,
    next
) => {

    try {

        const authHeader =
            req.headers.authorization;


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


        const token =
            authHeader.split(" ")[1];


        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        const admin =
            await User.findOne({
                _id: decoded.id,
                role: "admin"
            });


        if (!admin) {

            return res.status(403).json({
                success: false,
                message:
                    "Administrator access denied."
            });

        }


        req.admin = admin;

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


module.exports = router;