import express, { Request, Response } from "express";
import cors from "cors";
import { indexRoutes } from "./routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5000"],
    credentials: true,
  }),
);

app.use("/api/v1", indexRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to NursingHome_Server!");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
