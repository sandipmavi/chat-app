const UserModel = require('../models/userModel');
const bcryptjs =  require('bcryptjs');


async function registerUser(req, res) {
    try {
        console.log(req.body);
        const { name, email, password, profile_pic } = req.body; // Change request to req
        const checkEmail = await UserModel.findOne({ email });
        if (checkEmail) {
            return res.status(409).json({ // Use 409 Conflict for already registered email
                message: "Email is already registered",
                error: true,
            });
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);
        
        const payload = { name, email, profile_pic, password: hashPassword };
        const user = new UserModel(payload);
        const userSave = await user.save();
        
        return res.status(201).json({
            message: "User registered successfully",
            data: userSave,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}
module.exports =  registerUser;