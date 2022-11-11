import dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: path.join(__dirname, `../.env`),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  client_url: process.env.CLIENT_URL,
  mongoose: {
    url: process.env.MONGODB_URI,
    options: {},
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASS,
      },
    },
    fromTitle: process.env.SMTP_REPLY_TITLE,
    fromMail: process.env.SMTP_REPLY_MAIL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetExpirationMinutes: process.env.JWT_RESET_EXPIRATION_MINUTES,
  },
};