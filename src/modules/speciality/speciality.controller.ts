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

const getAllSpecialities = catchAsync(async (req: Request, res: Response) => {
  const data = await specialityService.getAllSpecialities();
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Get All Specialities",
    data: data,
  });
});

const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = await specialityService.deleteSpeciality(id as string);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality Deleted",
    data: data,
  });
});

const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payLoad = req.body;
  const data = await specialityService.updateSpeciality(id as string, payLoad);
  sendResponse(res, {
    httpStatusCode: 200,
    success: true,
    message: "Speciality Updated",
    data: data,
  });
});

export const specialityController = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
  updateSpeciality,
};
