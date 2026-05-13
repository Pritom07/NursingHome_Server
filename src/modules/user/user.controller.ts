import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { cookieUtils } from "../../utils/cookie";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const data = await userService.createDoctor(payLoad);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Doctor Created",
    data: data,
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const sessionToken = cookieUtils.getCookie(req, "better-auth.session_token");
  const result = await userService.createAdmin(payLoad, sessionToken);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Admin Created",
    data: result,
  });
});

export const userController = { createDoctor, createAdmin };
