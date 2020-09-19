const express = require("express");
const authRoute = express.Router();
const authController = require("../controller/auth.controller");

authRoute.route("/signup").post(authController.signUp);
authRoute.route("/signin").post(authController.signIn);

module.exports = authRoute;
