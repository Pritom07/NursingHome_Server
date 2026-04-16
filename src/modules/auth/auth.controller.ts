/*eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const data = await authService.registerPatient(payLoad);
  const { accessToken, refreshToken, token, ...rest } = data;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

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
  const { accessToken, refreshToken, token, ...rest } = data;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User LoggedIn",
    data: data,
  });
});

export const authController = { registerPatient, signIn };
