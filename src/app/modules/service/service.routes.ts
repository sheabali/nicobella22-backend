import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";

import auth from "../../middlewares/auth";
import { UserRole } from "../../types/user.type";
import { serviceController } from "./service.controller";
import { servicePricingSchema } from "./service.validation";

const router = Router();

router.post(
  "/",
  validateRequest(servicePricingSchema),
  auth(UserRole.MECHANIC, UserRole.ADMIN, UserRole.USER),
  serviceController.createServiceController
);
router.get("/", serviceController.getAllServiceController);

router.get(
  "/mechanic",
  auth(UserRole.MECHANIC),
  serviceController.getAllServiceByMechanicController
);

export const ServiceRoutes = router;
