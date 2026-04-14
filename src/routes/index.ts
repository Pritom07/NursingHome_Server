import { Router } from "express";
import { specialityRoute } from "../modules/speciality/speciality.route";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";

const router = Router();

router.use("/auth", authRoute);

router.use("/user", userRoute);

router.use("/specialities", specialityRoute);

export const indexRoutes = router;
