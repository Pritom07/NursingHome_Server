import { addHours, addMinutes, format } from "date-fns";
import { ICreateSchedule, IUpdateSchedule } from "./schedule.interface";
import { convertDateTime } from "./schedule.utils";
import { prisma } from "../../lib/prisma";
import { queryBuilder } from "../../utils/queryBuilder";
import { Prisma, Schedule } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/queryBuilder.interface";
import {
  scheduleFilterableFields,
  scheduleIncludeConfig,
  scheduleSearchableFields,
} from "./schedule.constant";

const getAllSchedules = async (query: IQueryParams) => {
  const scheduleModel = {
    findMany: prisma.schedule.findMany.bind(prisma.schedule),
    count: prisma.schedule.count.bind(prisma.schedule),
  };

  const queryBuilderInterface = new queryBuilder<
    Schedule,
    Prisma.ScheduleWhereInput,
    Prisma.ScheduleInclude
  >(scheduleModel as any, query, {
    searchableFields: scheduleSearchableFields,
    filterableFields: scheduleFilterableFields,
  });

  const result = await queryBuilderInterface
    .search()
    .filter()
    .paginate()
    .sort()
    .fields()
    .dynamicInclude(scheduleIncludeConfig, [])
    .execute();

  return result;
};

const getScheduleById = async (scheduleId: string) => {
  const result = await prisma.schedule.findUnique({
    where: { id: scheduleId },
  });

  return result;
};

const createSchedule = async (payLoad: ICreateSchedule) => {
  const { startDate, endDate, startTime, endTime } = payLoad;

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  const interval = 30;
  const schedules = [];

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0]),
        ),
        Number(startTime.split(":")[1]),
      ),
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM=dd")}`,
          Number(endTime.split(":")[0]),
        ),
        Number(endTime.split(":")[1]),
      ),
    );

    while (startDateTime < endDateTime) {
      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, interval));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: scheduleData,
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });

        schedules.push(result);
      }

      startDateTime.setTime(startDateTime.getTime() + interval);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const updateSchedule = async (scheduleId: string, payLoad: IUpdateSchedule) => {
  const { startDate, endDate, startTime, endTime } = payLoad;

  const startDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(startDate), "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0]),
      ),
      Number(startTime.split(":")[1]),
    ),
  );

  const endDateTime = new Date(
    addMinutes(
      addHours(
        `${format(new Date(endDate), "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0]),
      ),
      Number(endTime.split(":")[1]),
    ),
  );

  const result = await prisma.schedule.update({
    where: { id: scheduleId },
    data: {
      startDateTime: startDateTime,
      endDateTime: endDateTime,
    },
  });

  return result;
};

const deleteSchedule = async (scheduleId: string) => {
  const result = await prisma.schedule.delete({
    where: { id: scheduleId },
  });

  return result;
};

export const scheduleService = {
  getAllSchedules,
  createSchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};
