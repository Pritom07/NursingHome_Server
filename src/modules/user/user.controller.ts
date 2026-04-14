import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

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

export const userController = { createDoctor };
