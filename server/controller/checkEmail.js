const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
async function checkEmail(req, res) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not registered",
        error: true,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

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
      message: "Login successfully",
      token: token,
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error Login:", error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      message: "Catch Error",
      data: error.message || error,
    });
  }
}

module.exports = checkEmail;
