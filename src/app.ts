import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { indexRoutes } from "./routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import path from "path";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import qs from "qs";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/templates"));
app.set("query parser", (str: string) => qs.parse(str));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/auth", toNodeHandler(auth));
app.use(cookieParser());

app.use("/api/v1", indexRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to NursingHome_Server!");
});

app.use(notFound);
app.use(globalErrorHandler);

export default app;
