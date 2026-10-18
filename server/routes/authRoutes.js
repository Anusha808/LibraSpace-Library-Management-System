const express = require("express");
const router = express.Router();

// Import authentication controllers
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
} = require("../controllers/authController");

// Import JWT authentication middleware
const protect = require("../middleware/authMiddleware");


// ==========================================================
// REGISTER USER
// POST /api/auth/register
// ==========================================================
router.post("/register", registerUser);


// ==========================================================
// LOGIN USER
// POST /api/auth/login
// ==========================================================
router.post("/login", loginUser);


// ==========================================================
// GET LOGGED-IN USER PROFILE
// GET /api/auth/profile
// Requires a valid JWT token
// ==========================================================
router.get("/profile", protect, getProfile);


// ==========================================================
// UPDATE LOGGED-IN USER PROFILE
// PUT /api/auth/profile
// Requires a valid JWT token
// ==========================================================
router.put("/profile", protect, updateProfile);


// ==========================================================
// EXPORT ROUTER
// ==========================================================
module.exports = router;