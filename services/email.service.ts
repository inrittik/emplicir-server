import ApiError from "../utils/ApiError"
import httpStatus from "http-status"
const { send_mail } = require("../middlewares/mail")
const config = require("../config/config");
const User = require("../models/userModel");

/**
 * Send Reset Password Email
 * @param {string} email
 * @param {string} token
 * @returns {string}
 */

const sendResetPasswordEmail = (email:string, token:string) => {
  try {
    send_mail({
      mail: config.email.fromMail,
      reciever: email,
      subject: "Reset Password Link",
      text: `
        <h2>Please follow the given link below to reset your password</h2>
        <a href=${config.client_url}/auth/password/reset/${token} >Click this link to reset your password</a>
        <p>The link will expire after ${config.jwt.accessExpirationMinutes} minutes.</p>
        `,
    });
    const successMessage = `Email has been sent to ${email}. Kindly follow the link to reset your password`;
    return successMessage;
  } catch (err) {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server couldn't process the reset, please try again.");
  }
};

/**
 * Send Verify Email
 * @param {string} email
 * @param {string} token
 * @returns {string}
 */

 const sendVerifyEmail = async (email:string, token:string) => {
   try {
     const body = {
       receiver: email,
       subject: "Verify Email",
       text: `
        <h2>Please follow the given link below to confirm your email</h2>
        <a href=${config.client_url}/auth/verify_email/${token} >Click Here</a>
        <p>The link will expire after ${config.jwt.accessExpirationMinutes} minutes.</p>
        `,
     };
    await send_mail(body);
    const successMessage = `Email has been sent to ${email}. Kindly open the link to Verify your email`;
    return successMessage;
  } catch (err) {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server couldn't process the email Verification, please try again.");
  }
};


/**
 * Send OTP Email
 * @param {string} email
 * @param {string} token
 * @returns {string}
 */
const sendEmailOtp = async (user) => {
  try
  {
    const otpCode = Math.floor( 1000 + Math.random() * 9000 );
    await send_mail({
      mail: config.email.fromMail,
      reciever: user.email,
      subject: "OTP for Verification",
      text: `
        <h2>OTP Verification</h2>
        <a>Here is you OTP ${otpCode}</a>
        `,
    });
    user.auth.otp = {code: otpCode};
    await user.save()
    return user;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server couldn't process the reset, please try again.");
  }
};

module.exports = {
  sendResetPasswordEmail,
  sendEmailOtp,
  sendVerifyEmail
};
