import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { upload } from "../../utils/upload";
import { UserValidation } from "../user/user.validation";
import { MechanicController } from "./mechanic.controller";
import {
  // workingDaysValidationSchema,
  companyValidationSchema,
  mechanicRegistrationSchema,
} from "./mechanic.validation";

const router = Router();

// Step 1: Mechanic Registration (Personal Information)
router.post(
  "/",
  validateRequest(mechanicRegistrationSchema),
  MechanicController.mechanicRegistration
);

// Step 2: Add Company Information
router.post(
  "/company",
  validateRequest(companyValidationSchema),
  MechanicController.addCompany
);

// Step 3: Add Working Days (Handle multiple days)
router.post(
  "/working-days",
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
  "/sign-up-complete",
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(UserValidation.createUserValidationSchema),
  MechanicController.signUpComplete
);

export const MechanicRoutes = router;
