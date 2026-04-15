import status from "http-status";
import { IErrorSource } from "../interfaces/errResponse.interface";

export const handleZodError = (err: any) => {
  const httpStatusCode = status.BAD_REQUEST;
  const message = "Zod Validation Error";
  const errorSources: IErrorSource[] = [];

  err.issues.forEach((issue: any) =>
    errorSources.push({
      path: issue.path.join("."),
      message: issue.message,
    }),
  );
  const stack = err.stack;

  return {
    httpStatusCode,
    message,
    errorSources,
    stack,
  };
};
