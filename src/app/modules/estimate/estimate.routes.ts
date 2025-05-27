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
router.get(
  "/total-estimates",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  EstimateController.totalEstimatesController
);
router.get(
  "/total-estimates-accepted",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  EstimateController.totalEstimatesAcceptedController
);
router.get(
  "/upcoming-appointments",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  EstimateController.upcomingAppointmentsController
);

router.patch(
  "/:estimateId",
  auth(UserRole.MECHANIC),
  EstimateController.rejectEstimateController
);
router.put(
  "/:estimateId",
  auth(UserRole.MECHANIC), // make sure this middleware sets req.user
  EstimateController.acceptEstimateController
);

export const EstimateRoutes = router;
