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

router.post("/verify-email", authController.verifyEmail);

router.post("/forget-password", authController.forgetPassword);

router.post("/reset-password", authController.resetPassword);

router.get("/sign-in/google", authController.googleLogin);

router.get("/google/success", authController.googleLoginSuccess);

router.get("/oauth/error", authController.handleOauthError);

export const authRoute = router;
