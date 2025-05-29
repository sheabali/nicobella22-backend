"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const account_service_1 = require("./account.service");
const getAllMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield account_service_1.AccountService.getAllMechanic(req.query, req.user);
    console.log("result", result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Mechanic retrieved successfully",
        success: true,
        data: result,
    });
}));
const getAllMechanics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield account_service_1.AccountService.getAllMechanics(req.query, req.user);
    console.log("result", result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Mechanic retrieved successfully",
        success: true,
        data: result,
    });
}));
const getAllUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield account_service_1.AccountService.getAllUser(req.query, req.user);
    console.log("result", result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User retrieved successfully",
        success: true,
        data: result,
    });
}));
const deactivateMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mechanicId } = req.params;
    const result = yield account_service_1.AccountService.deactivateMechanic(mechanicId);
    console.log("result", result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Mechanic deactivate successfully",
        success: true,
        data: result,
    });
}));
const warningMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mechanicId } = req.params;
    const { warning } = req.body;
    console.log("warning from", warning);
    const result = yield account_service_1.AccountService.warningMechanic(mechanicId, warning);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Mechanic warning post successfully",
        success: true,
        data: result,
    });
}));
const getAllServiceController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield account_service_1.AccountService.getAllService(req.query, req.user);
    console.log("result", result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Mechanic retrieved successfully",
        success: true,
        data: result,
    });
}));
const deactivateService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    const { isActive } = req.body;
    console.log("status from", isActive);
    const result = yield account_service_1.AccountService.deactivateService(serviceId, isActive);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Mechanic deactivate successfully",
        success: true,
        data: result,
    });
}));
const deleteService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { serviceId } = req.params;
    const result = yield account_service_1.AccountService.deleteService(serviceId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Service deleted successfully.",
        success: true,
        data: result,
    });
}));
const deleteCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const result = yield account_service_1.AccountService.deleteCustomer(customerId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Customer deleted successfully.",
        success: true,
        data: result,
    });
}));
const deactivateCustomer = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customerId } = req.params;
    const result = yield account_service_1.AccountService.deactivateCustomer(customerId);
    console.log(result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Customer deactivate successfully",
        success: true,
        data: result,
    });
}));
const appointmentController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield account_service_1.AccountService.appointmentService(query, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Appointments retrieved successfully",
        success: true,
        data: result,
    });
}));
const appointmentStatusController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { appointmentId } = req.params;
    const { status } = req.body;
    console.log("status from", { status });
    const result = yield account_service_1.AccountService.appointmentStatus(appointmentId, { status });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Appointment status updated successfully",
        success: true,
        data: result,
    });
}));
const getAllActiveMechanic = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield account_service_1.AccountService.countActiveMechanics(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Active Mechanic retrieved successfully!",
        data: result,
    });
}));
const totalBookedService = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield account_service_1.AccountService.totalBookedService(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Total Service retrieved successfully!",
        data: result,
    });
}));
const totalServicesBooked = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the service with authenticated user
    const result = yield account_service_1.AccountService.totalServicesBooked(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Total Booked retrieved successfully",
        success: true,
        data: result, // The bookings array
    });
}));
const getSingleCompanyWithMechanicId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the service with authenticated user
    const { mechanicId } = req.params;
    const result = yield account_service_1.AccountService.getSingleCompanyWithMechanicId(mechanicId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Company With Mechanic retrieved successfully",
        success: true,
        data: result,
    });
}));
const totalRevenue = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the service with authenticated user
    const result = yield account_service_1.AccountService.totalRevenue(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Total Revenue retrieved successfully",
        success: true,
        data: result,
    });
}));
exports.AccountController = {
    getAllMechanic,
    getAllUser,
    deleteCustomer,
    deactivateMechanic,
    warningMechanic,
    getAllServiceController,
    deleteService,
    deactivateService,
    deactivateCustomer,
    appointmentController,
    appointmentStatusController,
    getAllActiveMechanic,
    totalBookedService,
    totalServicesBooked,
    totalRevenue,
    getAllMechanics,
    getSingleCompanyWithMechanicId,
};
