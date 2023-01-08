import jwt from "jsonwebtoken";
const userService = require("./user.service");
const config = require("../config/config");
const Token = require("../models/tokenModel");
const { tokenTypes } = require("../config/tokens");
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import dayjs from "dayjs";
import { Types } from "mongoose";


/**
 * Generate token
 * @param {ObjectId} userId
 * @param {dayjs} expires
 * @param {string} username
 * @param {string} userRole
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (
  userId: Types.ObjectId,
  expires: dayjs.Dayjs,
  username: string,
  userRole: string,
  type: string,
  secret: string = config.jwt.secret
) => {
  const payload = {
    id: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    username: username,
    role: userRole,
    type,
  };
  return jwt.sign(payload, secret);
};


/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {dayjs} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: Types.ObjectId,
  expires: dayjs.Dayjs,
  type: string,
  blacklisted = false
) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};


/**
 * Generate Email verification
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateEmailVerifyToken = async (email: string) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = dayjs().add(config.jwt.accessExpirationMinutes, "minutes");
  const emailVerifyToken = generateToken(
    user.id,
    expires,
    user.username,
    user.role,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(emailVerifyToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return emailVerifyToken;
};


/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user: any) => {
  const accessTokenExpires = dayjs().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    user.username,
    user.role,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = dayjs().add(
    config.jwt.refreshExpirationDays,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    user.username,
    user.role,
    tokenTypes.REFRESH
  );


  // await saveToken(accessToken, user.id, accessTokenExpires, tokenTypes.ACCESS);
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};


/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: string) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.id,
    blacklisted: false,
  });
  if (!tokenDoc) {
    return new ApiError(
      httpStatus.NOT_FOUND,
      "Token not found or has been blacklisted"
    );
  }
  return tokenDoc;
};


/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = dayjs().add(config.jwt.resetExpirationMinutes, "minutes");
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    user.username,
    user.role,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};


module.exports = {
  generateEmailVerifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  verifyToken,
};
