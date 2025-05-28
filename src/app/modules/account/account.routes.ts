import { Router } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "../../types/user.type";
import { AccountController } from "./account.controller";

const router = Router();

router.get("/mechanic", auth(UserRole.ADMIN), AccountController.getAllMechanic);
router.get("/user", auth(UserRole.ADMIN), AccountController.getAllUser);

router.patch(
  "/mechanic/:mechanicId",
  auth(UserRole.ADMIN),
  AccountController.deactivateMechanic
);
router.patch(
  "/mechanic-warning/:mechanicId",
  auth(UserRole.ADMIN),
  AccountController.warningMechanic
);

router.get(
  "/service",
  // auth(UserRole.ADMIN),
  AccountController.getAllServiceController
);
router.patch(
  "/service/:serviceId",
  auth(UserRole.ADMIN),
  AccountController.deactivateService
);
router.delete(
  "/service/:serviceId",
  auth(UserRole.ADMIN),
  AccountController.deleteService
);

router.delete(
  "/customer/:customerId",
  auth(UserRole.ADMIN),
  AccountController.deleteCustomer
);

router.patch(
  "/customer/:customerId",
  auth(UserRole.ADMIN),
  AccountController.deactivateCustomer
);
router.get(
  "/appointment",
  auth(UserRole.ADMIN),
  AccountController.appointmentController
);

router.patch(
  "/appointment/:appointmentId",
  auth(UserRole.ADMIN),
  AccountController.appointmentStatusController
);

router.get(
  "/a-mechanic",
  auth(UserRole.ADMIN),
  AccountController.getAllActiveMechanic
);

router.get(
  "/total-service",
  auth(UserRole.ADMIN),
  AccountController.totalBookedService
);

router.get(
  "/total-services-booked",
  auth(UserRole.ADMIN),
  AccountController.totalServicesBooked
);

router.get(
  "/total-revenue",
  auth(UserRole.ADMIN),
  AccountController.totalRevenue
);

// router.post("need-help", auth(UserRole.USER), AccountController.needHelp);

export const AccountRoutes = router;
