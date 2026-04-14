import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const data = await authService.registerPatient(payLoad);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "User Created",
    data: data,
  });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const data = await authService.signIn(payLoad);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User LoggedIn",
    data: data,
  });
});

export const authController = { registerPatient, signIn };
