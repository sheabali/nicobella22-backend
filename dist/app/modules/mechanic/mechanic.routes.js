"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const mechanic_validation_1 = require("./mechanic.validation");
const mechanic_controller_1 = require("./mechanic.controller");
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_1.default)(mechanic_validation_1.mechanicRegistrationSchema), mechanic_controller_1.MechanicController.mechanicRegistration);
exports.MechanicRoutes = router;
