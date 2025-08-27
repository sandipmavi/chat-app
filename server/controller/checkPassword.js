const UserModel = require("../models/userModel");
const bcryptjs = require("bcryptjs");
 // Ensure this import is correct

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

    
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = checkPassword;
