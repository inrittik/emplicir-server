import jwt from "jsonwebtoken";
const userService = require("./user.service");
const config = require("../config/config")
const Token = require("../models/tokenModel");
const { tokenTypes } = require("../config/tokens");
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import dayjs from "dayjs"
import moment from "moment"


/**
 * Generate token
 * @param {ObjectId} userId
 * @param {dayjs} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (user, expires, type, secret = config.jwt.secret) => {
  const payload = {
    id: user.id,
    iat: dayjs().unix(),
    exp: expires.unix(),
    username: user.username,
    role: user.role,
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
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
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
const generateEmailVerifyToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = moment().add(config.jwt.resetExpirationMinutes, "minutes");
  const emailVerifyToken = generateToken(
    user,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(emailVerifyToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return emailVerifyToken;
};
