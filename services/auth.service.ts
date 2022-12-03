const userService = require("./user.service");
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

module.exports = {
  loginUserWithEmailAndPassword,
};
