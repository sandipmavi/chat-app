const express = require("express");
const router = express.Router();
const checkEmail = require("../controller/checkEmail");
const registerUser = require("../controller/registerUser");
const checkPassword = require("../controller/checkPassword");
const userDetails = require("../controller/userDetails");
const logout = require("../controller/logout");
const updateUserDetail = require("../controller/updateUserDetail");
const searchUser = require("../controller/searchUser");
//create user API

router.post("/register", registerUser);
// check user email
router.post("/email", checkEmail);
//  check user password
router.post("/password", checkPassword);
// login userDetails
router.get("/user-details", userDetails);
//logout user
router.get("/logout", logout);
//user update
router.post("/update", updateUserDetail);
//search-user
router.post("/search", searchUser);

module.exports = router;
