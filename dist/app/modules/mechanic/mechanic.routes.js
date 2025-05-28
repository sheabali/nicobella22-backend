"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const upload_1 = require("../../utils/upload");
const user_validation_1 = require("../user/user.validation");
const mechanic_controller_1 = require("./mechanic.controller");
const mechanic_validation_1 = require("./mechanic.validation");
const router = (0, express_1.Router)();
// Step 1: Mechanic Registration (Personal Information)
router.post("/", (0, validateRequest_1.default)(mechanic_validation_1.mechanicRegistrationSchema), mechanic_controller_1.MechanicController.mechanicRegistration);
// Step 2: Add Company Information
router.post("/company", (0, validateRequest_1.default)(mechanic_validation_1.companyValidationSchema), mechanic_controller_1.MechanicController.addCompany);
// Step 3: Add Working Days (Handle multiple days)
router.post("/working-days", 
// validateRequest(workingDaysValidationSchema),
mechanic_controller_1.MechanicController.createWorkingDays);
// Step 4: Add Service Pricing
// router.post(
//   '/service-pricing',
//   validateRequest(servicePricingValidationSchema),
//   MechanicController.addServicePricing
// );
// Step 5: Sign-Up Completion
router.post("/sign-up-complete", upload_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), mechanic_controller_1.MechanicController.signUpComplete);
exports.MechanicRoutes = router;
