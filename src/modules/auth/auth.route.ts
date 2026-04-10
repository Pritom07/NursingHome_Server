import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/sign-up/email", authController.signUp);

router.post("/sign-in/email", authController.signIn);

export const authRoute = router;
