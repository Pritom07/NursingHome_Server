import { Router } from "express";
import { doctorController } from "./doctor.controller";
import validateRequest from "../../middlewares/validateRequest";
import { updateDoctorSchema } from "./doctor.validation";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.get("/", doctorController.getAllDoctors);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.getDoctorById,
);

router.patch(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(updateDoctorSchema),
  doctorController.updateDoctor,
);

router.delete(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  doctorController.deleteDoctor,
);

export const doctorRoute = router;
