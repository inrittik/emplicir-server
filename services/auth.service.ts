const userService = require("./user.service");
const tokenService = require("./token.service");
const { tokenTypes } = require("../config/tokens");
const Token = require("../models/tokenModel");
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<user>}
 */
const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<any> => {
  const user = await userService.getUserByEmail(email);

  if (!user || !(await user.validatePassword(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Verify Email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
 const verifyEmail = async (VerifyEmailToken:string) => {
   try {
    const VerifyEmailTokenDoc = await tokenService.verifyToken(VerifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const user = await userService.getUserById(VerifyEmailTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
    }
    await userService.updateUserById(user, { isEmailVerified: true });
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email Verification failed');
  }
};

module.exports = {
  loginUserWithEmailAndPassword,
  verifyEmail,
};
