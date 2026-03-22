const express = require("express");
const { handleRegisterUser, handleLoginUser, handleLogoutUser } = require("../controllers/user.controller");
const registerValidator = require("../validation/auth.validator");
const { identifyUser } = require("../middleware/auth.middleware");

const userRoute = express.Router();

// /api/auth/register
userRoute.post("/register", registerValidator, handleRegisterUser);
// /api/auth/login
userRoute.post("/login", registerValidator, handleLoginUser);
// /api/auth/logout
userRoute.post("/logout", identifyUser, handleLogoutUser);

module.exports = userRoute;
