/*eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import { cookieUtils } from "../../utils/cookie";
import { config } from "../../config";
import { auth } from "../../lib/auth";

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

/** /api/v1/auth/sign-in/google?redirect=/dashboard */
const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect ?? "/dashboard";
  const encodedRedirectPath = encodeURIComponent(redirectPath as string);
  const callbackURL = `${config.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

  res.render("googleRedirect", {
    betterAuthURL: config.BETTER_AUTH_URL,
    callbackURL,
  });
});

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/dashboard";
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");

  if (!sessionToken) {
    return res.redirect(`${config.FRONTEND_URL}/sign-in?error=oauth_failed`);
  }

  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  });

  if (!session) {
    return res.redirect(
      `${config.FRONTEND_URL}/sign-in?error=no_session_found`,
    );
  }

  if (session && !session.user) {
    return res.redirect(`${config.FRONTEND_URL}/sign-in?error=no_user_found`);
  }

  const result = await authService.googleLoginSuccess(session);
  const { accessToken, refreshToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

  return res.redirect(`${config.FRONTEND_URL}${finalRedirectPath}`);
});

const handleOauthError = catchAsync(async (req: Request, res: Response) => {
  const error = req.query.error || "oauth_failed";
  return res.redirect(`${config.FRONTEND_URL}/sign-in?error=${error}`);
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
  googleLogin,
  googleLoginSuccess,
  handleOauthError,
};
