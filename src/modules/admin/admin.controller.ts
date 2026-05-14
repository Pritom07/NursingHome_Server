/*eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllAdmins = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllAdmins();

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Getting All Admins Successfull",
    data: result,
  });
});

const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adminService.getAdminById(id as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Get admin By Id Successfull",
    data: result,
  });
});

const updateAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payLoad = req.body;
  const result = await adminService.updateAdmin(id as string, payLoad);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Update Admin Successfull",
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = req.user;
  const result = await adminService.deleteAdmin(id as string, user);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Delete Admin Successfull",
  });
});

export const adminController = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
