const Settings = require("../models/Settings");
const User = require("../models/User");

/*
=========================================================
GET ADMIN USER ID
=========================================================
*/

const getAdminUserId = (req) => {
    if (!req.user) {
        return null;
    }

    return (
        req.user.id ||
        req.user._id ||
        req.user.userId
    );
};

/*
=========================================================
GET SETTINGS
GET /api/admin/settings
=========================================================
*/

const getSettings = async (req, res) => {
    try {
        let settings =
            await Settings.findOne({
                settingsKey: "LIBRASPACE_SETTINGS"
            });

        /*
        Create default settings document
        automatically if it does not exist.
        */

        if (!settings) {
            settings = await Settings.create({
                settingsKey: "LIBRASPACE_SETTINGS"
            });
        }

        /*
        Get currently logged-in admin
        */

        const adminUserId =
            getAdminUserId(req);

        let admin = null;

        if (adminUserId) {
            admin = await User.findById(
                adminUserId
            ).select(
                "name email role isActive"
            );
        }

        /*
        Razorpay public configuration.
        NEVER return RAZORPAY_KEY_SECRET.
        */

        const razorpayKey =
            process.env.RAZORPAY_KEY_ID || "";

        const razorpayMode =
            process.env.RAZORPAY_MODE ||
            "Test Mode";

        return res.status(200).json({
            success: true,

            settings: {
                libraryName: settings.libraryName,
                libraryEmail: settings.libraryEmail,
                libraryPhone: settings.libraryPhone,
                address: settings.address,

                openingTime: settings.openingTime,
                closingTime: settings.closingTime,

                maxReservationHours:
                    settings.maxReservationHours,

                advanceBookingDays:
                    settings.advanceBookingDays,

                cancellationHours:
                    settings.cancellationHours,

                maintenanceMode:
                    settings.maintenanceMode,

                emailNotifications:
                    settings.emailNotifications,

                reservationAlerts:
                    settings.reservationAlerts,

                membershipAlerts:
                    settings.membershipAlerts,

                paymentAlerts:
                    settings.paymentAlerts,

                adminName:
                    admin?.name ||
                    "Administrator",

                adminEmail:
                    admin?.email ||
                    "admin@libraspace.com",

                razorpayMode,

                razorpayKey:
                    razorpayKey ||
                    "Not configured"
            },

            admin: admin
                ? {
                      id: admin._id,
                      name: admin.name,
                      email: admin.email,
                      role: admin.role,
                      isActive:
                          admin.isActive !== false
                  }
                : null,

            notificationCount: 0
        });
    } catch (error) {
        console.error(
            "Get Settings Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to load admin settings."
        });
    }
};

/*
=========================================================
UPDATE SETTINGS
PUT /api/admin/settings
=========================================================
*/

const updateSettings = async (req, res) => {
    try {
        const {
            libraryName,
            libraryEmail,
            libraryPhone,
            address,

            openingTime,
            closingTime,

            maxReservationHours,
            advanceBookingDays,
            cancellationHours,

            maintenanceMode,

            emailNotifications,
            reservationAlerts,
            membershipAlerts,
            paymentAlerts,

            adminName,
            adminEmail
        } = req.body;

        /*
        ================================================
        Find or create settings
        ================================================
        */

        let settings =
            await Settings.findOne({
                settingsKey: "LIBRASPACE_SETTINGS"
            });

        if (!settings) {
            settings = new Settings({
                settingsKey:
                    "LIBRASPACE_SETTINGS"
            });
        }

        /*
        ================================================
        Update library settings
        ================================================
        */

        if (libraryName !== undefined) {
            settings.libraryName =
                String(libraryName).trim();
        }

        if (libraryEmail !== undefined) {
            settings.libraryEmail =
                String(libraryEmail)
                    .trim()
                    .toLowerCase();
        }

        if (libraryPhone !== undefined) {
            settings.libraryPhone =
                String(libraryPhone).trim();
        }

        if (address !== undefined) {
            settings.address =
                String(address).trim();
        }

        /*
        ================================================
        Operating hours
        ================================================
        */

        if (openingTime !== undefined) {
            settings.openingTime =
                openingTime;
        }

        if (closingTime !== undefined) {
            settings.closingTime =
                closingTime;
        }

        /*
        ================================================
        Reservation settings
        ================================================
        */

        if (
            maxReservationHours !==
            undefined
        ) {
            settings.maxReservationHours =
                Number(maxReservationHours);
        }

        if (
            advanceBookingDays !==
            undefined
        ) {
            settings.advanceBookingDays =
                Number(advanceBookingDays);
        }

        if (
            cancellationHours !==
            undefined
        ) {
            settings.cancellationHours =
                Number(cancellationHours);
        }

        if (
            maintenanceMode !==
            undefined
        ) {
            settings.maintenanceMode =
                Boolean(maintenanceMode);
        }

        /*
        ================================================
        Notification settings
        ================================================
        */

        if (
            emailNotifications !==
            undefined
        ) {
            settings.emailNotifications =
                Boolean(emailNotifications);
        }

        if (
            reservationAlerts !==
            undefined
        ) {
            settings.reservationAlerts =
                Boolean(reservationAlerts);
        }

        if (
            membershipAlerts !==
            undefined
        ) {
            settings.membershipAlerts =
                Boolean(membershipAlerts);
        }

        if (
            paymentAlerts !==
            undefined
        ) {
            settings.paymentAlerts =
                Boolean(paymentAlerts);
        }

        await settings.save();

        /*
        ================================================
        Update admin profile
        ================================================
        */

        const adminUserId =
            getAdminUserId(req);

        let admin = null;

        if (adminUserId) {
            admin = await User.findById(
                adminUserId
            );

            if (admin) {
                if (
                    adminName !== undefined &&
                    String(adminName).trim()
                ) {
                    admin.name =
                        String(
                            adminName
                        ).trim();
                }

                if (
                    adminEmail !== undefined &&
                    String(adminEmail).trim()
                ) {
                    admin.email =
                        String(
                            adminEmail
                        )
                            .trim()
                            .toLowerCase();
                }

                await admin.save();
            }
        }

        /*
        ================================================
        Response
        ================================================
        */

        const razorpayKey =
            process.env.RAZORPAY_KEY_ID || "";

        const razorpayMode =
            process.env.RAZORPAY_MODE ||
            "Test Mode";

        return res.status(200).json({
            success: true,

            message:
                "Settings saved successfully.",

            settings: {
                libraryName:
                    settings.libraryName,

                libraryEmail:
                    settings.libraryEmail,

                libraryPhone:
                    settings.libraryPhone,

                address:
                    settings.address,

                openingTime:
                    settings.openingTime,

                closingTime:
                    settings.closingTime,

                maxReservationHours:
                    settings.maxReservationHours,

                advanceBookingDays:
                    settings.advanceBookingDays,

                cancellationHours:
                    settings.cancellationHours,

                maintenanceMode:
                    settings.maintenanceMode,

                emailNotifications:
                    settings.emailNotifications,

                reservationAlerts:
                    settings.reservationAlerts,

                membershipAlerts:
                    settings.membershipAlerts,

                paymentAlerts:
                    settings.paymentAlerts,

                adminName:
                    admin?.name ||
                    "Administrator",

                adminEmail:
                    admin?.email ||
                    "admin@libraspace.com",

                razorpayMode,

                razorpayKey:
                    razorpayKey ||
                    "Not configured"
            }
        });
    } catch (error) {
        console.error(
            "Update Settings Error:",
            error
        );

        /*
        Duplicate email protection
        */

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message:
                    "This administrator email is already in use."
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to save settings."
        });
    }
};

/*
=========================================================
CHANGE ADMIN PASSWORD
PUT /api/admin/settings/password
=========================================================
*/

const changeAdminPassword = async (
    req,
    res
) => {
    try {
        const {
            newPassword
        } = req.body;

        if (!newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password is required."
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must contain at least 6 characters."
            });
        }

        const adminUserId =
            getAdminUserId(req);

        if (!adminUserId) {
            return res.status(401).json({
                success: false,
                message:
                    "Administrator authentication failed."
            });
        }

        const admin =
            await User.findById(
                adminUserId
            );

        if (!admin) {
            return res.status(404).json({
                success: false,
                message:
                    "Administrator account not found."
            });
        }

        if (admin.role !== "admin") {
            return res.status(403).json({
                success: false,
                message:
                    "Only administrators can change this password."
            });
        }

        /*
        Use the same password storage approach
        already used by your authentication system.
        */

        admin.password = newPassword;

        await admin.save();

        return res.status(200).json({
            success: true,
            message:
                "Password changed successfully."
        });
    } catch (error) {
        console.error(
            "Change Password Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to change administrator password."
        });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    changeAdminPassword
};