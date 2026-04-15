import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createDoctorSchema } from "./user.validation";

const router = Router();

router.post(
  "/createDoctor",
  validateRequest(createDoctorSchema),
  userController.createDoctor,
);

export const userRoute = router;
