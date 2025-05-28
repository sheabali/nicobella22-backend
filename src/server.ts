import { Server } from "http";
import app from "./app";
import config from "./app/config";

let server: Server;

const main = async () => {
  try {
    server = app.listen(Number(config.port), "10.0.10.12", () => {
      console.log(`🚀 App is listening on port: 10.0.10.12`);
    });
  } catch (err) {
    console.log(err);
  }
};

main();

process.on("unhandledRejection", () => {
  console.log(`❌ unhandledRejection is detected, shutting down...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`❌ uncaughtException is detected, shutting down...`);
  process.exit(1);
});
