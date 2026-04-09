import { Router } from "express";
import { specialityRoute } from "../modules/speciality/speciality.route";

const router = Router();

router.use("/specialities", specialityRoute);

export const indexRoutes = router;
