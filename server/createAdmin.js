const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const createAdmin = async () => {
    try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const adminEmail = "admin@libraspace.com";
        const adminPassword = "admin123";

        // Check if admin already exists
        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            // Update existing account
            admin.name = "LibraSpace Administrator";
            admin.password = await bcrypt.hash(adminPassword, 10);
            admin.role = "admin";

            await admin.save();

            console.log("Admin account updated successfully.");
        } else {
            // Create new admin
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            admin = new User({
                name: "LibraSpace Administrator",
                email: adminEmail,
                password: hashedPassword,
                phone: "",
                role: "admin"
            });

            await admin.save();

            console.log("Admin created successfully.");
        }

        console.log("--------------------------------");
        console.log("Admin Login Details");
        console.log("--------------------------------");
        console.log("Email:", adminEmail);
        console.log("Password:", adminPassword);
        console.log("Role: admin");
        console.log("--------------------------------");

        await mongoose.disconnect();

        console.log("MongoDB disconnected");
    } catch (error) {
        console.error("Error creating/updating admin:", error);

        try {
            await mongoose.disconnect();
        } catch (disconnectError) {
            console.error("Error disconnecting MongoDB:", disconnectError);
        }
    }
};

createAdmin();