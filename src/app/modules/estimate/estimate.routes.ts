import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../types/user.type";
import { EstimateController } from "./estimate.controller";

const router = Router();

router.post(
  "/",
  // validateRequest(EstimateSchema),
  auth(UserRole.USER, UserRole.MECHANIC),
  EstimateController.createEstimateController
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  EstimateController.getAllEstimateController
);

export const EstimateRoutes = router;
