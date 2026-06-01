import { Router } from "express";
import { specialityRoute } from "../modules/speciality/speciality.route";
import { authRoute } from "../modules/auth/auth.route";
import { userRoute } from "../modules/user/user.route";
import { doctorRoute } from "../modules/doctor/doctor.route";
import { adminRoute } from "../modules/admin/admin.route";
import { scheduleRoute } from "../modules/schedule/schedule.route";

const router = Router();

router.use("/auth", authRoute);

router.use("/auth/user", userRoute);

router.use("/specialities", specialityRoute);

router.use("/doctors", doctorRoute);

router.use("/admins", adminRoute);

router.use("/schedules", scheduleRoute);

export const indexRoutes = router;
