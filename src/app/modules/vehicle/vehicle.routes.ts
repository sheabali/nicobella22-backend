import { NextFunction, Request, Response, Router } from "express";

import auth from "../../middlewares/auth";
import { UserRole } from "../../types/user.type";
import { upload } from "../../utils/upload";
import { VehicleController } from "./vehicle.controller";

const router = Router();

router.post(
  "/",
  // validateRequest(),
  auth(UserRole.USER),
  // multerUpload.fields([{ name: "images" }]),
  // upload.single('file', )
  // parseBody,

  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
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
