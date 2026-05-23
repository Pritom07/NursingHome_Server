import { Router } from "express";
import { specialityController } from "./speciality.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middlewares/validateRequest";
import { createSpecialitySchema } from "./speciality.validation";

const router = Router();

router.get("/", specialityController.getAllSpecialities);

router.post(
  "/",
  checkAuth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  multerUpload.single("file"),
  validateRequest(createSpecialitySchema),
  specialityController.createSpeciality,
);

router.patch("/:id", specialityController.updateSpeciality);

router.delete("/:id", specialityController.deleteSpeciality);

export const specialityRoute = router;
