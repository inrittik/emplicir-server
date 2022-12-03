import { Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";
const { ApiSuccess } = require("../utils/ApiSuccess");
const catchAsync = require("../utils/catchAsync");
const { authService, userService, emailService, tokenService } = require("../services");
const {sendCookie} = require("../utils/cookie")

exports.registerUser = catchAsync(async (req:Request, res:Response) => {
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

exports.loginUser = catchAsync(async (req:Request, res:Response) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  if (!user.isEmailVerified) {
    const emailVerifictionToken = await tokenService.generateEmailVerifyToken(
      req.body.email
    );
    await emailService.sendVerifyEmail(req.body.email, emailVerifictionToken);
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Please Verify your Email first. Check your Email inbox to verify your email"
    );
  }
  sendCookie({ user, tokens }, 201, res, "Logged in successfully");
});

exports.checkUser = catchAsync(async (req:Request, res:Response) => {});

exports.logoutUser = catchAsync(async (req:Request, res:Response) => {});

exports.updatePassword = catchAsync(async (req:Request, res:Response) => {});

exports.forgotPassword = catchAsync(async (req:Request, res:Response) => {});

exports.resetPassword = catchAsync(async (req:Request, res:Response) => {});

exports.sendEmailOtp = catchAsync(async (req:Request, res:Response) => {});

exports.verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.verifyEmail(req.body.token);
  res
    .status(httpStatus.OK)
    .send(
      ApiSuccess(
        true,
        { user },
        "User verified successfully, You can login Now"
      )
    );
});

exports.sendSmsOtp = catchAsync(async (req:Request, res:Response) => {});

exports.verifySmsOtp = catchAsync(async (req:Request, res:Response) => {});

exports.updateUserById = catchAsync(async (req: Request, res: Response) => {});
