const User = require("../models/userModel");
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
const { ApiSuccess } = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, emailService, tokenService } = require("../services");

exports.registerUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const emailVerifictionToken = await tokenService.generateEmailVerifyToken(
    req.body.email
  );
  await emailService.sendVerifyEmail(req.body.email, emailVerifictionToken);
  res
    .status(httpStatus.CREATED)
    .send(
      ApiSuccess(
        true,
        { user },
        `User registered successfully and Verification email has been sent to ${req.body.email}`
      )
    );
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
