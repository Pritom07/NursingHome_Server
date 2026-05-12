/*eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";

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

const getMe = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.user;
  const result = await authService.getMe(payLoad);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Getting Personal Information Successfully",
    data: result,
  });
});

const getNewTokens = catchAsync(async (req: Request, res: Response) => {
  const refreshtoken = cookieUtils.getCookie(req, "refreshToken");
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
  const result = await authService.getNewTokens(refreshtoken, sessionToken);
  const { accessToken, refreshToken, token } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Getting New Tokens Successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
  const result = await authService.changePassword(payLoad, sessionToken);
  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Change Password Successfull",
    data: result,
  });
});

const logOut = catchAsync(async (req: Request, res: Response) => {
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
  const result = await authService.logOut(sessionToken);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Logout Successfull",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const result = await authService.verifyEmail(payLoad);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Email Verification Successfull",
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  await authService.forgetPassword(payLoad);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password Reset OTP Send To Email",
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  await authService.resetPassword(payLoad);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Password Reset Successfull",
  });
});

export const authController = {
  registerPatient,
  signIn,
  getMe,
  getNewTokens,
  changePassword,
  logOut,
  verifyEmail,
  forgetPassword,
  resetPassword,
};
