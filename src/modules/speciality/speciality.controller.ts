import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const data = await specialityService.createSpeciality(payLoad);
  sendResponse(res, {
    httpStatusCode: 201,
    success: true,
    message: "Speciality Created",
    data: data,
  });
});

export const specialityController = { createSpeciality };
