import { Router } from "express";
import { specialityController } from "./speciality.controller";

const router = Router();

router.get("/", specialityController.getAllSpecialities);

router.post("/", specialityController.createSpeciality);

router.patch("/:id", specialityController.updateSpeciality);

router.delete("/:id", specialityController.deleteSpeciality);

export const specialityRoute = router;
