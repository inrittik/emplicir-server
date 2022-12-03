const {httpServer} = require("./app")
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({path:path.join(__dirname, `./.env`)})
let server:any;
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log(`⚡️[DB]: Connected`);
  server = httpServer.listen(process.env.PORT, () => {
    console.log(`⚡️[Server]: Listening on port ${process.env.PORT}`);
  })
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(1);
    })
  }
  else {
    process.exit(1);
  }
}

const unexpectedErrorHandler = (error:unknown) => {
  let message:string;
  if (error instanceof Error) message = error.message;
  else message = String(error);
  console.log(message);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close();
  }
});