import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
import ErrorResponse from "../utils/ErrorResponse";
const { ApiSuccess } = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, emailService, tokenService } = require("../services");
const { sendCookie, sendNoCookies } = require("../utils/cookie")
const { tokenTypes } = require("../config/tokens");
const config = require("../config/config");
const Token = require("../models/tokenModel");
const User = require("../models/userModel");

/**
 * Register a user
 * Request Body: user
 * Response Data: user
 */
exports.registerUser = catchAsync(async (req:Request, res:Response) => {
  const user = await userService.createUser(req.body);
  if (user instanceof ApiError) {
    return ErrorResponse(user,res)
  }
  const emailVerifictionToken = await tokenService.generateEmailVerifyToken(
    req.body.email
  );
  if (emailVerifictionToken instanceof ApiError) { 
    return ErrorResponse(emailVerifictionToken,res);
  }
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


/**
 * Login user
 * Request Body: email, password
 * Response Data: user
 */
exports.loginUser = catchAsync(async (req:Request, res:Response) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  if (user instanceof ApiError) { 
    return ErrorResponse(user,res);
  }
  const tokens = await tokenService.generateAuthTokens(user);
  if (tokens instanceof ApiError) { 
    return ErrorResponse(tokens,res);
  }

  if (!user.isEmailVerified) {
    const emailVerifictionToken = await tokenService.generateEmailVerifyToken(
      req.body.email
    );
    if(emailVerifictionToken instanceof ApiError) return ErrorResponse(emailVerifictionToken,res);
    await emailService.sendVerifyEmail(req.body.email, emailVerifictionToken);
    return res.status(httpStatus.BAD_REQUEST).send({error: "Please Verify your Email first. Check your Email inbox to verify your email"})
  }
  sendCookie({ user, tokens }, httpStatus.ACCEPTED, res, "Logged in successfully");
});

exports.checkUser = catchAsync(async (req:Request, res:Response) => {});


/** 
 * Logout user
 * Request: refreshToken
 * Response
*/
exports.logoutUser = catchAsync(async (req: Request, res: Response) => {
  await Token.findOneAndRemove({
    token: req.signedCookies.refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  sendNoCookies({}, httpStatus.ACCEPTED, res, "Logged out successfully");
});


/** 
 * Update password
 * Request Body: user
 * Response Data: user, tokens
 */
exports.updatePassword = catchAsync(async (req: Request, res: Response, next:NextFunction) => {
  try {
    const user = await User.findById(req.body.user.id).select("+password");
    const isPassValid = await user.validatePassword(req.body.oldPassword);

    if (!isPassValid) {
      return res.status(httpStatus.UNAUTHORIZED).send({ message: "Old Password is Invalid" });
    }

    user.password = req.body.newPassword;
    await user.save();

    await tokenService.removeTokensForUser(user._id, tokenTypes.REFRESH);
    const tokens = await tokenService.generateAuthTokens(user);
    sendCookie(
      { user, tokens },
      httpStatus.ACCEPTED,
      res,
      "Password updated and logged in successfully."
    );
  } catch (err) {
    next(err);
  }
});


/** 
 * Forgot password
 * Request Body: email
 * Response: reset password email
*/
exports.forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res
    .status(httpStatus.OK)
    .send(
      ApiSuccess(
        true,
        {},
        `Password reset sent at ${req.body.email}, Check your email.`
      )
    );
});


/** 
 * Reset password
 * Request Body: token, password
 * Response: Success
*/
exports.resetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body.token, req.body.password);
  res
    .status(httpStatus.OK)
    .send(ApiSuccess(true, {}, "Password changed successfully"));
});

exports.sendEmailOtp = catchAsync(async (req:Request, res:Response) => {});


/**
 * Verify email
 * Request Params: token
 * Response Data: user
 */
exports.verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.verifyEmail(req.params.token);
  res
    .status(httpStatus.OK)
    .send(
      ApiSuccess(
        true,
        { user },
        "User verified successfully, You can close this wiindow and login now."
      )
    );
});

exports.sendSmsOtp = catchAsync(async (req:Request, res:Response) => {});

exports.verifySmsOtp = catchAsync(async (req:Request, res:Response) => {});


/** 
 * Update user
 * Request Body: user
 * Response Data: user
*/
exports.updateUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserById(req.params.id, req.body.user);
  res
    .status(httpStatus.CREATED)
    .send(ApiSuccess(true, { user }, "user updated successfully"));
});
