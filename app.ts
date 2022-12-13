import express from "express";
import cors from "cors";
import { createServer } from "http";
const authRouter = require("./routers/authRouter")
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("cookie-encrypter");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.JWT_SECRET));
app.use(cookieEncrypter(process.env.JWT_SECRET));

const ALLOWED_ORIGINS = ["http://localhost:3000"];
app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));

const httpServer = createServer(app);

app.use((req, res, next) => {
  const { origin } = req.headers;
  const theOrigin =
    ALLOWED_ORIGINS.indexOf(origin) >= 0 ? origin : ALLOWED_ORIGINS[0];
  res.header("Access-Control-Allow-Origin", theOrigin);
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.options("*", cors());

app.use("/auth/", authRouter);

module.exports = { httpServer };
