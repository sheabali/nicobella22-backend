import { Router } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "../../types/user.type";
import { VehicleController } from "./vehicle.controller";

const router = Router();

router.post(
  "/",
  // validateRequest(),
  auth(UserRole.USER),
  VehicleController.createVehicle
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  VehicleController.getAllVehicle
);

export const VehicleRoutes = router;
