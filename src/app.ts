import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

// parsers
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(cors({ origin: ["http://localhost:6010"], credentials: true }));

// app routes
app.use("/api/v1", router);

const test = async (req: Request, res: Response) => {
  res.send(
    `<div style="background: black; border-radius: 15px; width: 700px; height: 200px; margin: auto; margin-top: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center;"><h1 style="color: white; text-align: center;">Welcome to the server of Something!</h1></div>`
  );
};

app.get("/", test);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
