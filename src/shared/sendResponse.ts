import { Response } from "express";
import { IResponse } from "../interfaces/succesResponse.interface";

export const sendResponse = <T>(res: Response, responseData: IResponse<T>) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  return res.status(httpStatusCode).json({ success, message, data, meta });
};
