const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel'); // Ensure you have this import

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        return {
            message: "Session timeout",
            logout: true,
        };
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await UserModel.findById(decode.id).select('-password');

        if (!user) {
            return {
                message: "User not found",
                logout: true,
            };
        }

        return user; // Return the user object
    } catch (error) {
        return {
            message: error.message || "Invalid token",
            logout: true,
        };
    }
};

module.exports = getUserDetailsFromToken;
