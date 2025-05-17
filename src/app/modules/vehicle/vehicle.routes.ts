import { Router } from "express";

import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { parseBody } from "../../middlewares/bodyParser";
import { UserRole } from "../../types/user.type";
import { VehicleController } from "./vehicle.controller";

const router = Router();

router.post(
  "/",
  // validateRequest(),
  auth(UserRole.USER),
  multerUpload.fields([{ name: "images" }]),
  parseBody,
  VehicleController.createVehicle
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  VehicleController.getAllVehicle
);
router.get(
  "/:vehicleId",
  auth(UserRole.USER),
  VehicleController.getSingleVehicle
);
router.delete(
  "/:vehicleId",
  auth(UserRole.USER),
  VehicleController.deleteVehicleController
);

export const VehicleRoutes = router;
