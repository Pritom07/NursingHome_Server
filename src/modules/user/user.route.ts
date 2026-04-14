import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

router.post("/createDoctor", userController.createDoctor);

export const userRoute = router;
