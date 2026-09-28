const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {

        // Get authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authorization token is required"
            });
        }

        // Expected format:
        // Bearer YOUR_TOKEN
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store logged-in user information
        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = protect;