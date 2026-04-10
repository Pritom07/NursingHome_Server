import { Router } from "express";
import { specialityRoute } from "../modules/speciality/speciality.route";
import { authRoute } from "../modules/auth/auth.route";

const router = Router();

router.use("/auth", authRoute);

router.use("/specialities", specialityRoute);

export const indexRoutes = router;
