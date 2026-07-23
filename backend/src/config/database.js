const mongoose = require("mongoose");
const User = require("../models/User");

const connectDB = async () => {
    try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Seed default admin user if none exists, or verify and update password
    const adminEmail = 'ahmad63@gmai.com';
    const adminExists = await User.findOne({ email: adminEmail }).select('+password');
    if (!adminExists) {
        await User.create({
            username: 'Ahmad63',
            email: adminEmail,
            password: 'ahmad63',
            role: 'admin'
        });
        console.log(`✅ Default admin user seeded: ${adminEmail}`);
    } else {
        const isMatch = await adminExists.comparePassword('ahmad63');
        if (!isMatch) {
            adminExists.password = 'ahmad63';
            await adminExists.save();
            console.log(`✅ Default admin user password reset/updated: ${adminEmail}`);
        }
    }
    } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
    }
};

module.exports = connectDB;