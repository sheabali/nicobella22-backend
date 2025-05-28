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
exports.VehicleController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const vehicle_service_1 = require("./vehicle.service");
// const createPoem = catchAsync(async (req, res) => {
//   if (req.file) {
//     req.body.image = ⁠ /uploads/${req.file.filename} ⁠;
//   }
//   const result = await PoemService.createPoemIntoDB(req.body);
//   sendResponse(res, {
//     statusCode: status.CREATED,
//     message: "Poem created successfully!",
//     data: result,
//   });
// });
const createVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
    }
    console.log("req.file", req.file);
    console.log("aa", req.body);
    const result = yield vehicle_service_1.VehicleService.createVehicle(req.body, 
    // req.file as any, // Ensure type assertion
    req.user);
    console.log("vehicle", result);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Vehicle created succesfully",
        success: true,
        data: result,
    });
}));
const getAllVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield vehicle_service_1.VehicleService.getAllVehicle(req.user, req.query);
    console.log(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Vehicle are retrieved succesfully",
        success: true,
        data: result,
    });
}));
const getSingleVehicle = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const authUser = req.user; // typed user if available
    const result = yield vehicle_service_1.VehicleService.getSingleVehicle(vehicleId, authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Vehicle retrieved successfully",
        success: true,
        data: result,
    });
}));
const deleteVehicleController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const authUser = req.user;
    const result = yield vehicle_service_1.VehicleService.deleteVehicle(vehicleId, authUser);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Vehicle deleted successfully",
        success: true,
        data: result,
    });
}));
exports.VehicleController = {
    createVehicle,
    getAllVehicle,
    getSingleVehicle,
    deleteVehicleController,
};
