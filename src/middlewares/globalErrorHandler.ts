/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import status from "http-status";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (config.NODE_ENV === "development") {
    console.log(err);
  }

  let httpStatusCode = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = err.stack;

  if (err instanceof Error) {
    message = err.message;
    stack = err.stack;
  }

  const errorResponse = {
    success: false,
    message,
    error: config.NODE_ENV === "development" ? err.message : undefined,
    stack: config.NODE_ENV === "development" ? stack : undefined,
  };

  return res.status(httpStatusCode).json(errorResponse);
};
