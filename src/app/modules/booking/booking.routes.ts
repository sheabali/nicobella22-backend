import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { bookingValidationSchema } from './booking.validation';
import { BookingController } from './booking.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../types/user.type';

const router = Router();

router.post(
  '/',
  validateRequest(bookingValidationSchema),
  auth(UserRole.USER),
  BookingController.createBooking
);
router.get(
  '/',
  auth(UserRole.ADMIN, UserRole.MECHANIC, UserRole.USER),
  BookingController.getAllBooking
);

export const BookingRoutes = router;
