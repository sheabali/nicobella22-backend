"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_type_1 = require("../../types/user.type");
const service_controller_1 = require("./service.controller");
const service_validation_1 = require("./service.validation");
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.default)(service_validation_1.servicePricingSchema), (0, auth_1.default)(user_type_1.UserRole.MECHANIC, user_type_1.UserRole.ADMIN, user_type_1.UserRole.USER), service_controller_1.serviceController.createServiceController);
router.get("/", service_controller_1.serviceController.getAllServiceController);
router.get("/mechanic", (0, auth_1.default)(user_type_1.UserRole.MECHANIC), service_controller_1.serviceController.getAllServiceByMechanicController);
exports.ServiceRoutes = router;
