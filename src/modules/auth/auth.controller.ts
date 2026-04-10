import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const signUp = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const data = await authService.signUp(payLoad);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "User Created",
    data: data,
  });
});

const signIn = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const data = await authService.signIn(payLoad);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "User LoggedIn",
    data: data,
  });
});

export const authController = { signUp, signIn };
