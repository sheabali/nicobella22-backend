"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_type_1 = require("../../types/user.type");
const booking_controller_1 = require("./booking.controller");
const booking_validation_1 = require("./booking.validation");
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.default)(booking_validation_1.bookingValidationSchema), (0, auth_1.default)(user_type_1.UserRole.USER), booking_controller_1.BookingController.createBooking);
router.get("/", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), booking_controller_1.BookingController.getAllBooking);
router.get("/reject-estimates", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), booking_controller_1.BookingController.getRejectedEstimatesController);
exports.BookingRoutes = router;
