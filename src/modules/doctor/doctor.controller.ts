/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctors = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await doctorService.getAllDoctors(query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Getting All Doctor Successfull",
    data: result.data!,
    meta: result.meta!,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorService.getDoctorById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get Doctor By Id Successfull",
    data: result,
  });
});

const updateDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payLoad = req.body;
  const result = await doctorService.updateDoctor(id as string, payLoad);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Update Doctor Successfull",
    data: result,
  });
});

const deleteDoctor = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await doctorService.deleteDoctor(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Delete Doctor successfull",
  });
});

export const doctorController = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
