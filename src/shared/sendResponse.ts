import { Response } from "express";
import { IResponse } from "../interfaces/succesResponse";

export const sendResponse = <T>(res: Response, responseData: IResponse<T>) => {
  const { httpStatusCode, success, message, data } = responseData;
  return res.status(httpStatusCode).json({ success, message, data });
};
