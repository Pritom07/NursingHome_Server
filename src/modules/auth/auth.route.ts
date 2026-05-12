import { Router } from "express";
import { authController } from "./auth.controller";
import checkAuth from "../../middlewares/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/sign-up/email", authController.registerPatient);

router.post("/sign-in/email", authController.signIn);

router.get(
  "/me",
  checkAuth(
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
  authController.getMe,
);

router.post("/refresh-token", authController.getNewTokens);

router.post(
  "/change-password",
  checkAuth(
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.ADMIN,
    UserRole.SUPER_ADMIN,
  ),
  authController.changePassword,
);

router.post("/logout", authController.logOut);

export const authRoute = router;
