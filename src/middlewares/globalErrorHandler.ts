/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import status from "http-status";
import * as z from "zod";
import {
  IErrorResponse,
  IErrorSource,
} from "../interfaces/errResponse.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (config.NODE_ENV === "development") {
    console.log(err);
  }

  let httpStatusCode: number = status.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let errorSources: IErrorSource[] = [];
  let stack: string | undefined = undefined;

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    httpStatusCode = simplifiedError.httpStatusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
    stack = simplifiedError.stack;
  } else if (err instanceof AppError) {
    httpStatusCode = err.httpStatusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
    stack = err.stack;
  } else if (err instanceof Error) {
    httpStatusCode = status.INTERNAL_SERVER_ERROR;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
    stack = err.stack;
  }

  const errorResponse: IErrorResponse = {
    success: false,
    message,
    errorSources,
    error: config.NODE_ENV === "development" ? err.message : undefined,
    stack: config.NODE_ENV === "development" ? stack : undefined,
  };

  return res.status(httpStatusCode).json(errorResponse);
};
