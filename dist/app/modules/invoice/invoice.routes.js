"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_type_1 = require("../../types/user.type");
const invoice_controller_1 = require("./invoice.controller");
const invoice_validation_1 = require("./invoice.validation");
const router = (0, express_1.Router)();
router.post("/", (0, validateRequest_1.default)(invoice_validation_1.invoiceSchema), (0, auth_1.default)(user_type_1.UserRole.MECHANIC), invoice_controller_1.InvoiceController.createInvoiceController);
router.get("/", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), invoice_controller_1.InvoiceController.getAllInvoiceController);
router.get("/invoice-rechart-data", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), invoice_controller_1.InvoiceController.getAllInvoiceRechartData);
exports.InvoiceRoutes = router;
