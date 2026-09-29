const jwt = require("jsonwebtoken");
const User = require("../models/User");


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
                    "Authentication required."

            });

        }


        const token =
            authHeader.split(" ")[1];


        // ======================================================
        // VERIFY JWT
        // ======================================================

        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // ======================================================
        // FIND ADMIN USER
        // ======================================================

        const admin =
            await User.findOne({

                _id: decoded.id,

                role: "admin"

            });


        // ======================================================
        // ADMIN NOT FOUND
        // ======================================================

        if (!admin) {

            return res.status(403).json({

                success: false,

                message:
                    "Admin access required."

            });

        }


        // ======================================================
        // SAVE ADMIN IN REQUEST
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
                "Invalid or expired admin token."

        });

    }

};


module.exports = adminProtect;