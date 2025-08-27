const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");

async function registerUser(req, res) {
  try {
    console.log(req.body);
    const { name, email, password, profile_pic } = req.body; // Change request to req
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return res.status(409).json({
        // Use 409 Conflict for already registered email
        message: "Email is already registered",
        error: true,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const payload = { name, email, profile_pic, password: hashPassword };
    const user = new UserModel(payload);
    const userSave = await user.save();

    const tokenData = {
      id: user._id,
      email: user.email,
    };
    const userData = user.toObject();
    delete userData.password;

    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const cookieOption = {
      httpOnly: true,

      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    return res.cookie("token", token, cookieOption).status(200).json({
      message: "Register successfully",
      token: token,
      success: true,
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
module.exports = registerUser;
