const User = require("../models/userModel");
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
const { ApiSuccess } = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { authService, userService } = require("../services");

exports.registerUser = catchAsync(async (req: any, res: any) => {
  const user = await userService.createUser(req.body);
  res
    .status(httpStatus.CREATED)
    .send(ApiSuccess(true, { user }, "User registered successfully"));
});

exports.loginUser = () => {};

exports.checkUser = () => {};

exports.logoutUser = () => {};

exports.updatePassword = () => {};

exports.forgotPassword = () => {};

exports.resetPassword = () => {};

exports.sendEmailOtp = () => {};

exports.verifyEmail = () => {};

exports.sendSmsOtp = () => {};

exports.verifySmsOtp = () => {};

exports.updateUserById = () => {};
