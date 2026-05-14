import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";
import validateRequest from "../../middlewares/validateRequest";
import { updateAdminSchema } from "./admin.validation";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAllAdmins,
);

router.get(
  "/:id",
  checkAuth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminController.getAdminById,
);

router.patch(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  validateRequest(updateAdminSchema),
  adminController.updateAdmin,
);

router.delete(
  "/:id",
  checkAuth(UserRole.SUPER_ADMIN),
  adminController.deleteAdmin,
);

export const adminRoute = router;
