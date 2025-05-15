"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const company_validation_1 = require("./company.validation");
const company_controller_1 = require("./company.controller");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(company_validation_1.companyValidationSchema), company_controller_1.CompanyController.createCompany);
exports.CompanyRoutes = router;
