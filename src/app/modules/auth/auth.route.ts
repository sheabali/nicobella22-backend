import { Router } from "express";
import { AuthController } from "./auth.controller";
import { AuthValidation } from "./auth.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.get("/active/:token", AuthController.activeAccount);

router.post(
  "/login",
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.login
);

router.put(
  "/change-password/:userId",
  validateRequest(AuthValidation.changePasswordValidationSchema),
  AuthController.changePassword
);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password/:token", AuthController.resetPassword);

export const AuthRoutes = router;
