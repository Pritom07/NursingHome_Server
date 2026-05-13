import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createAdminSchema, createDoctorSchema } from "./user.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/createDoctor",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(createDoctorSchema),
  userController.createDoctor,
);

router.post(
  "/createAdmin",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(createAdminSchema),
  userController.createAdmin,
);

export const userRoute = router;
