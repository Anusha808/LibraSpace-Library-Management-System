const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER USER
// ======================================================
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check whether user already exists
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone || ""
        });

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "User with this email already exists"
            });
        }

        return res.status(500).json({
            message: "Server error during registration"
        });
    }
};


// ======================================================
// LOGIN USER
// ======================================================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user by email
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Prevent inactive accounts from logging in
        if (!user.isActive) {
            return res.status(403).json({
                message: "Your account is inactive. Please contact the administrator."
            });
        }

        // Create JWT token
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing from environment variables");

            return res.status(500).json({
                message: "Server authentication configuration error"
            });
        }

        const token = jwt.sign(
            {
                id: user._id.toString(),
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Send response
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error during login"
        });
    }
};


// ======================================================
// GET LOGGED-IN USER PROFILE
// GET /api/auth/profile
// Requires JWT authentication
// ======================================================
const getProfile = async (req, res) => {
    try {
        // User ID comes from the verified JWT
        const userId = req.user.id;

        const user = await User.findById(userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile loaded successfully",
            user
        });

    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            message: "Server error while loading profile"
        });
    }
};


// ======================================================
// UPDATE LOGGED-IN USER PROFILE
// PUT /api/auth/profile
// Requires JWT authentication
// ======================================================
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, phone } = req.body;

        // Validate required fields
        if (
            typeof name !== "string" ||
            !name.trim() ||
            typeof email !== "string" ||
            !email.trim()
        ) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const normalizedName = name.trim();
        const normalizedEmail = email.trim().toLowerCase();

        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }

        // Check if another account uses this email
        const existingUser = await User.findOne({
            email: normalizedEmail,
            _id: { $ne: userId }
        });

        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        // Update only permitted profile fields
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name: normalizedName,
                    email: normalizedEmail,
                    phone: typeof phone === "string"
                        ? phone.trim()
                        : ""
                }
            },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("Update profile error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                message: "This email is already registered"
            });
        }

        return res.status(500).json({
            message: "Server error while updating profile"
        });
    }
};


// ======================================================
// EXPORT CONTROLLERS
// ======================================================
module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};