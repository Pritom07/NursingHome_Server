import { CookieOptions } from "better-auth";
import { Request, Response } from "express";
import type { CookieOptions as ExpressCookieOptions } from "express-serve-static-core";

const setCookie = (
  res: Response,
  key: string,
  value: string,
  options: CookieOptions,
) => {
  res.cookie(key, value, options as ExpressCookieOptions);
};

const getCookie = (req: Request, key: string) => {
  return req.cookies[key];
};

const clearCookie = (res: Response, key: string, options: CookieOptions) => {
  res.clearCookie(key, options as ExpressCookieOptions);
};

export const cookieUtils = { setCookie, getCookie, clearCookie };
