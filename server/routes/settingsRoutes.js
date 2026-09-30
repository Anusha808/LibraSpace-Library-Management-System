const express = require("express");

const adminProtect = require(
    "../middleware/adminProtect"
);

const {
    getSettings,
    updateSettings,
    changeAdminPassword
} = require(
    "../controllers/settingsController"
);

const router = express.Router();

/*
=========================================================
GET SETTINGS
=========================================================
*/

router.get(
    "/",
    adminProtect,
    getSettings
);

/*
=========================================================
UPDATE SETTINGS
=========================================================
*/

router.put(
    "/",
    adminProtect,
    updateSettings
);

/*
=========================================================
CHANGE ADMIN PASSWORD
=========================================================
*/

router.put(
    "/password",
    adminProtect,
    changeAdminPassword
);

module.exports = router;