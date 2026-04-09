import express, { Request, Response } from "express";
import cors from "cors";
import { indexRoutes } from "./routes";

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

export default app;
