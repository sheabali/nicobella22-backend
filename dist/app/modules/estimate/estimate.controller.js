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
exports.EstimateController = exports.getAllEstimateController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const estimate_service_1 = require("./estimate.service");
const createEstimateController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const result = yield estimate_service_1.EstimateService.createEstimate(req.body, authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Estimate created successfully",
        success: true,
        data: result,
    });
}));
exports.getAllEstimateController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const result = yield estimate_service_1.EstimateService.getAllEstimate(req.query, authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Estimates retrieved successfully",
        success: true,
        data: result,
    });
}));
const acceptEstimateController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const { estimateId } = req.params;
    const updatedEstimate = yield estimate_service_1.EstimateService.acceptEstimateStatus(estimateId
    // status as Status
    );
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Estimate status updated successfully",
        data: updatedEstimate,
    });
}));
const rejectEstimateController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const { estimateId } = req.params;
    // const { status } = req.body;
    // if (!status || !["PENDING", "ACCEPT", "REJECT"].includes(status)) {
    //   throw new Error("Invalid or missing status value");
    // }
    const updatedEstimate = yield estimate_service_1.EstimateService.rejectEstimateStatus(estimateId
    // status as Status
    );
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Estimate status updated successfully",
        data: updatedEstimate,
    });
}));
const totalEstimatesController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    console.log("authUser", authUser);
    // const { status } = req.body;
    // if (!status || !["PENDING", "ACCEPT", "REJECT"].includes(status)) {
    //   throw new Error("Invalid or missing status value");
    // }
    const updatedEstimate = yield estimate_service_1.EstimateService.totalEstimates(authUser
    // status as Status
    );
    console.log("Total Estimates:", updatedEstimate);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Total Estimates retrieved successfully",
        data: updatedEstimate,
    });
}));
const totalEstimatesAcceptedController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const updatedEstimate = yield estimate_service_1.EstimateService.totalEstimatesAccepted(authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Total Estimates Accepted retrieved successfully",
        data: updatedEstimate,
    });
}));
const upcomingAppointmentsController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const updatedEstimate = yield estimate_service_1.EstimateService.upcomingAppointments(authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Upcoming appointments retrieved successfully",
        data: updatedEstimate,
    });
}));
exports.EstimateController = {
    createEstimateController,
    getAllEstimateController: exports.getAllEstimateController,
    rejectEstimateController,
    acceptEstimateController,
    totalEstimatesController,
    totalEstimatesAcceptedController,
    upcomingAppointmentsController,
};
