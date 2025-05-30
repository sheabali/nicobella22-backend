"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_type_1 = require("../../types/user.type");
const account_controller_1 = require("./account.controller");
const router = (0, express_1.Router)();
router.get("/mechanic", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.getAllMechanic);
router.get("/mechanics", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.getAllMechanics);
router.get("/user", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.getAllUser);
router.patch("/mechanic/:mechanicId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.deactivateMechanic);
router.patch("/mechanic-warning/:mechanicId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.warningMechanic);
router.get("/service", 
// auth(UserRole.ADMIN),
account_controller_1.AccountController.getAllServiceController);
router.patch("/service/:serviceId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.deactivateService);
router.post("/service/:serviceId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.activeService);
router.delete("/service/:serviceId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.deleteService);
router.delete("/customer/:customerId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.deleteCustomer);
router.patch("/customer/:customerId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.deactivateCustomer);
router.get("/appointment", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.appointmentController);
router.patch("/appointment/:appointmentId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.appointmentStatusController);
router.get("/a-mechanic", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.getAllActiveMechanic);
router.get("/total-service", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.totalBookedService);
router.get("/total-services-booked", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.totalServicesBooked);
router.get("/total-revenue", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.totalRevenue);
router.get("/company/:mechanicId", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.getSingleCompanyWithMechanicId);
router.patch("/make-admin", (0, auth_1.default)(user_type_1.UserRole.ADMIN), account_controller_1.AccountController.makeAdmin);
// router.post("need-help", auth(UserRole.USER), AccountController.needHelp);
exports.AccountRoutes = router;
