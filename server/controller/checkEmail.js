const UserModel = require("../models/userModel");

async function checkEmail(req, res) {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email }).select("-password");

    if (!user) {
      return res.status(404).json({
        
        message: "User not registered",
        error: true,
      });
    }

    return res.status(200).json({
      message: "Email verified",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error checking email:", error); // Log the error for debugging
    return res.status(500).json({
      error: true,
      message: error.message || error,
    });
  }
}

module.exports = checkEmail;
