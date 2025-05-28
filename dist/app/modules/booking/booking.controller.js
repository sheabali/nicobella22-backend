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
exports.BookingController = exports.getRejectedEstimatesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const booking_service_1 = require("./booking.service");
const createBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield booking_service_1.BookingServices.bookingService(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Booking created succesfully",
        success: true,
        data: result,
        // Assuming the service returns a meal object
    });
}));
const getAllBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Call the service with query and authenticated user
    const result = yield booking_service_1.BookingServices.getAllBooking(req.query, req.user);
    console.log("result", result.meta);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Bookings retrieved successfully",
        success: true,
        data: result.bookings, // The bookings array
        meta: result.meta, // Include pagination metadata
    });
}));
exports.getRejectedEstimatesController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authUser = req.user;
    const result = yield booking_service_1.BookingServices.RejectEstimates(req.query, authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Rejected estimates retrieved successfully",
        success: true,
        data: result,
    });
}));
exports.BookingController = {
    createBooking,
    getAllBooking,
    getRejectedEstimatesController: exports.getRejectedEstimatesController,
};
