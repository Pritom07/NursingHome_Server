import { Router } from "express";
import { scheduleController } from "./schedule.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import validateRequest from "../../middlewares/validateRequest";
import {
  createScheduleSchema,
  updateScheduleSchema,
} from "./schedule.validation";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  scheduleController.getAllSchedules,
);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  scheduleController.getScheduleById,
);

router.post(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createScheduleSchema),
  scheduleController.createSchedule,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateScheduleSchema),
  scheduleController.updateSchedule,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  scheduleController.deleteSchedule,
);

export const scheduleRoute = router;
