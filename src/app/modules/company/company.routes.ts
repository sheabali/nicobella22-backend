import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { companyValidationSchema } from './company.validation';
import { CompanyController } from './company.controller';

const router = Router();

router.post(
  '/',
  validateRequest(companyValidationSchema),
  CompanyController.createCompany
);

export const CompanyRoutes = router;
