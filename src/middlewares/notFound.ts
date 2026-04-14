import { Request, Response } from "express";
import status from "http-status";

export const notFound = (req: Request, res: Response) => {
  return res.status(status.NOT_FOUND).json({
    success: false,
    message: "Route Not Found",
    path: req.originalUrl,
    date: Date(),
  });
};
