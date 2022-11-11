import ApiError from "../utils/ApiError"
import httpStatus from "http-status"
const { send_mail } = require("../middlewares/mail")
const config = require("../config/config");

/**
 * Send Reset Password Email
 * @param {string} email
 * @param {string} token
 * @returns {string}
 */

const sendResetPasswordEmail = (email:any, token:any) => {
  try {
    send_mail({
      title: "Reset Password Link",
      mail: config.email.fromMail,
      reciever: email,
      subject: "Reset Password Link",
      text: `
        <h2>Please follow the given link below to reset your password</h2>
        <a href=${config.client_url}/reset_password?token=${token} >Click this link to reset your password</a>
        <p>The link will expire after 30 minutes.</p>
        `,
    });
    const successMessage = `Email has been sent to ${email}. Kindly follow the link to reset your password`;
    return successMessage;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server couldn't process the reset, please try again.");
  }
};

/**
 * Send Verify Email
 * @param {string} email
 * @param {string} token
 * @returns {string}
 */

 const sendVerifyEmail = (email, token) => {
  try {
    send_mail({
      title: "Email Verification Link",
      mail: config.email.fromMail,
      reciever: email,
      subject: "Verify Link",
      text: `
        <h2>Please follow the given link below to Verify your email</h2>
        <a href=${config.client_url}/verify_email?token=${token} >Click this link to Verify your email</a>
        <p>The link will expire after 30 minutes.</p>
        `,
    });
    const successMessage = `Email has been sent to ${email}. Kindly open the link to Verify your email`;
    return successMessage;
  } catch (err) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Server couldn't process the email Verification, please try again.");
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
      title: "Emplicir OTP Email",
      mail: config.email.fromMail,
      reciever: user.email,
      subject: "OTP",
      text: `
        <h2>OTP Verification</h2>
        <a>Here is you OTP ${otpCode}</a>
        `,
    });
    user.auth.otp = {code: otpCode};
    await user. save()
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
