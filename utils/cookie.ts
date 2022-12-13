const {ApiSuccess} = require("../utils/ApiSuccess");
const config = require("../config/config")
import {Response} from "express"

const sendCookie = (
  { user = {}, tokens },
  statusCode:number,
  res:Response,
  message = "Operation Performed Successfully"
) => {
  const cookieParams = {
    expires: new Date(
      Date.now() + config.cookie.cookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    signed: true,
    maxAge: 2592000000,
    secure: true,
  };

  res.cookie("refreshToken", tokens.refresh.token, cookieParams);
  res.cookie("refreshTokenExpire", tokens.refresh.expires, cookieParams);
  res.cookie("accessToken", tokens.access.token, cookieParams);
  res.cookie("accessTokenExpire", tokens.access.expires, cookieParams);

  res.status(statusCode).send(ApiSuccess(true, { user }, message));
};

const sendNoCookies = (
  {},
  statusCode:number,
  res:Response,
  message = "Operation Performed Successfully"
) => {
  const cookieParams = {
    expires: new Date(
      Date.now() + config.cookie.cookieExpire * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    signed: true,
    maxAge: 2592000000,
    secure: true,
  };

  res.cookie("refreshToken", "", cookieParams);
  res.cookie("refreshTokenExpire", "", cookieParams);
  res.cookie("accessToken", "", cookieParams);
  res.cookie("accessTokenExpire", "", cookieParams);

  res.status(statusCode).send(ApiSuccess(true, {}, message));
};

module.exports = { sendCookie, sendNoCookies };
