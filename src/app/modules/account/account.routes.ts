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
export const AccountRoutes = router;
