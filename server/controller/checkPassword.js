const UserModel = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Ensure this import is correct

async function checkPassword(req, res) {
    try {
        const { password, userId } = req.body;
        const user = await UserModel.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
            });
        }

        const verifyPassword = await bcryptjs.compare(password, user.password);
        if (!verifyPassword) {
            return res.status(400).json({
                message: "Wrong Password",
                error: true,
            });
        }

        const tokenData = {
            id: userId,
            email: user.email
        };
        
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        const cookieOption = {
            httpOnly: true,
            secure: true,
        };

        return res.cookie('token', token, cookieOption).status(200).json({
            message: "Login successfully",
            token: token,
            success: true,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}

module.exports = checkPassword;
