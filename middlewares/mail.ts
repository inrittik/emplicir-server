import nodemailer from "nodemailer"
import { EmailTf } from "../interfaces/Email";
const config = require("../config/config");

const send_mail = async (data:EmailTf) => {
  try {
    const transporter = nodemailer.createTransport({
      service: config.email.smtp.service,
      host: config.email.smtp.host,
      port: config.email.smtp.port,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });

    const mailOptions = {
      from: config.email.smtp.host,
      to: data.receiver,
      subject: data.subject,
      html: data.text,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return {message: error};
      } else {
        return {message: "Email sent"};
      }
    });
  } catch (err) {
    return {message: err};
  }
};

module.exports = { send_mail };
