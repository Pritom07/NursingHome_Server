import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await scheduleService.getAllSchedules(query);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Getting All Schedules Successfull",
    data: result,
  });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const scheduleId = req.params.id;
  const result = await scheduleService.getScheduleById(scheduleId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Getting Schedule By Id Successfull",
    data: result,
  });
});

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const payLoad = req.body;
  const result = await scheduleService.createSchedule(payLoad);

  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Schedule Created Successfully",
    data: result,
  });
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
  const scheduleId = req.params.id;
  const payLoad = req.body;
  const result = await scheduleService.updateSchedule(
    scheduleId as string,
    payLoad,
  );

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Update Schedule Successfull",
    data: result,
  });
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
  const scheduleId = req.params.id;
  const result = await scheduleService.deleteSchedule(scheduleId as string);

  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Delete Schedule Successfull",
    data: result,
  });
});

export const scheduleController = {
  getAllSchedules,
  createSchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
