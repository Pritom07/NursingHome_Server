import { JWTPayload } from "better-auth";
import { jwtUtils } from "./jwt";
import { config } from "../config";
import { JwtPayload } from "jsonwebtoken";
import { cookieUtils } from "./cookie";
import { Response } from "express";

const getAccessToken = (payLoad: JWTPayload) => {
  const accessToken = jwtUtils.createToken(
    payLoad,
    config.ACCESS_TOKEN_SECRET,
    { expiresIn: 60 * 60 * 24 * 1000 },
  );
  return accessToken;
};

const getRefreshToken = (payLoad: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(
    payLoad,
    config.REFRESH_TOKEN_SECRET,
    { expiresIn: 60 * 60 * 24 * 1000 * 7 },
  );
  return refreshToken;
};

const setAccessTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1000,
  });
};

const setRefreshTokenCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1000 * 7,
  });
};

const setBetterAuthSessionCookie = (res: Response, token: string) => {
  cookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1000,
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};
