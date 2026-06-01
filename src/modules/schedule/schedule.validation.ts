import * as z from "zod";

export const createScheduleSchema = z.object({
  startDate: z.string("startDate Required"),
  endDate: z.string("endDate Required"),
  startTime: z.string("startTime Required"),
  endTime: z.string("endDTime Required"),
});

export const updateScheduleSchema = z.object({
  startDate: z.string("startDate Required"),
  endDate: z.string("endDate Required"),
  startTime: z.string("startTime Required"),
  endTime: z.string("endDTime Required"),
});
