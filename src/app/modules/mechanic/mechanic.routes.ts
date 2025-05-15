import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import {
  mechanicRegistrationSchema,
  workingDayValidationSchema,
} from './mechanic.validation';
import { AuthController } from '../auth/auth.controller';
import { MechanicController } from './mechanic.controller';
import { CompanyController } from '../company/company.controller';
import { UserValidation } from '../user/user.validation';

const router = Router();

router.post(
  '/',
  validateRequest(mechanicRegistrationSchema),
  MechanicController.mechanicRegistration
);

router.post(
  '/working-day',
  validateRequest(workingDayValidationSchema),
  MechanicController.createWorkingDay
);
router.post(
  '/sign-up-complete',
  validateRequest(UserValidation.createUserValidationSchema),
  MechanicController.signUpComplete
);

export const MechanicRoutes = router;
