import { Router } from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "../../types/user.type";
import { BookingController } from "./booking.controller";
import { bookingValidationSchema } from "./booking.validation";

const router = Router();

router.post(
  "/",
  validateRequest(bookingValidationSchema),
  auth(UserRole.USER),
  BookingController.createBooking
);
router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  BookingController.getAllBooking
);

router.get(
  "/reject-estimates",
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  BookingController.getRejectedEstimatesController
);

export const BookingRoutes = router;
