"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_type_1 = require("../../types/user.type");
const estimate_controller_1 = require("./estimate.controller");
const router = (0, express_1.Router)();
router.post("/", 
// validateRequest(EstimateSchema),
(0, auth_1.default)(user_type_1.UserRole.USER, user_type_1.UserRole.MECHANIC), estimate_controller_1.EstimateController.createEstimateController);
router.get("/", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), estimate_controller_1.EstimateController.getAllEstimateController);
router.get("/total-estimates", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), estimate_controller_1.EstimateController.totalEstimatesController);
router.get("/total-estimates-accepted", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), estimate_controller_1.EstimateController.totalEstimatesAcceptedController);
router.get("/upcoming-appointments", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), estimate_controller_1.EstimateController.upcomingAppointmentsController);
router.patch("/:estimateId", (0, auth_1.default)(user_type_1.UserRole.MECHANIC), estimate_controller_1.EstimateController.rejectEstimateController);
router.put("/:estimateId", (0, auth_1.default)(user_type_1.UserRole.MECHANIC), // make sure this middleware sets req.user
estimate_controller_1.EstimateController.acceptEstimateController);
exports.EstimateRoutes = router;
