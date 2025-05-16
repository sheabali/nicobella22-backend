import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  mechanicRegistrationSchema,
  // workingDaysValidationSchema,
  companyValidationSchema,
  servicePricingValidationSchema,
} from './mechanic.validation';
import { MechanicController } from './mechanic.controller';
import { UserValidation } from '../user/user.validation';

const router = Router();

// Step 1: Mechanic Registration (Personal Information)
router.post(
  '/',
  validateRequest(mechanicRegistrationSchema),
  MechanicController.mechanicRegistration
);

// Step 2: Add Company Information
router.post(
  '/company',
  validateRequest(companyValidationSchema),
  MechanicController.addCompany
);

// Step 3: Add Working Days (Handle multiple days)
router.post(
  '/working-days',
  // validateRequest(workingDaysValidationSchema),
  MechanicController.createWorkingDays
);

// Step 4: Add Service Pricing
// router.post(
//   '/service-pricing',
//   validateRequest(servicePricingValidationSchema),
//   MechanicController.addServicePricing
// );

// Step 5: Sign-Up Completion
router.post(
  '/sign-up-complete',
  validateRequest(UserValidation.createUserValidationSchema),
  MechanicController.signUpComplete
);

export const MechanicRoutes = router;
