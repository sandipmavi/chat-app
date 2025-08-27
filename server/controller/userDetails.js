const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/userModel");
async function userDetails(req, res) {
  try {
    const { userId } = req.body;
    const token = req.cookies.token || "";
    if (!token) {
      return res.status(401).json({
        message: "UnAuthorized",
        success: false,
      });
    }

    const user = await UserModel.findById(userId).select("-password");

    return res.status(200).json({
      message: "user- details",
      data: user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
module.exports = userDetails;
