import nodemailer from "nodemailer"
const config = require("../config/config");

const send_mail = async (data:any) => {
  try {
    const transporter = nodemailer.createTransport({
      port: config.email.smtp.port,
      host: config.email.smtp.host,
      auth: {
        user: config.email.smtp.auth.user,
        pass: config.email.smtp.auth.pass,
      },
    });

    var mailOptions = {
      from: config.email.fromMail,
      to: data.reciever,
      subject: data.subject,
      text: data.text,
    };

    await transporter.sendMail(mailOptions, function (error:any, info:any) {
      if (error) {
        return { message: error };
      } else {
        return { message: `Mail was sent to ${data.reciever} successfully` };
      }
    });
  } catch (err) {
    return { message: err };
  }
};

module.exports.send_mail = send_mail;
