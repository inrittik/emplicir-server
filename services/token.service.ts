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
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = dayjs().add(config.jwt.resetExpirationMinutes, "minutes");
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

module.exports = {
  generateEmailVerifyToken  
}