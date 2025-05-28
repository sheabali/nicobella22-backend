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
exports.MechanicController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const mechanic_service_1 = require("./mechanic.service");
// Step 1: Mechanic Registration (Personal Information)
const mechanicRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mechanic_service_1.MechanicServices.registerService(Object.assign({}, req.body));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Mechanic registration successful",
        success: true,
        data: result,
    });
}));
// Step 2: Add Company Information
const addCompany = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield mechanic_service_1.MechanicServices.addCompany(Object.assign({}, req.body));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Company information added successfully",
        success: true,
        data: result,
    });
}));
// Step 3: Add Working Days (Handle multiple days)
const createWorkingDays = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mechanicId, workingDays } = req.body;
    // Validate input
    if (!mechanicId || !workingDays || !Array.isArray(workingDays)) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.BAD_REQUEST,
            message: "Mechanic ID and working days array are required",
            success: false,
            data: null,
        });
        return;
    }
    const result = yield mechanic_service_1.MechanicServices.addWorkingDays(mechanicId, workingDays);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Working days created successfully",
        success: true,
        data: result,
    });
}));
// Step 4: Add Service Pricing
// const addServicePricing = catchAsync(async (req: Request, res: Response) => {
//   const result = await MechanicServices.addServicePricing({
//     ...req.body,
//   });
//   sendResponse(res, {
//     statusCode: StatusCodes.CREATED,
//     message: 'Service pricing added successfully',
//     success: true,
//     data: result,
//   });
// });
// Step 5: Sign-Up Completion
const signUpComplete = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        req.body.image = `/uploads/${req.file.filename}`;
    }
    console.log("Sign-up data:", req.body);
    const result = yield mechanic_service_1.MechanicServices.signUpComplete(Object.assign({}, req.body));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Mechanic sign-up completed successfully",
        success: true,
        data: result,
    });
}));
exports.MechanicController = {
    mechanicRegistration,
    addCompany,
    createWorkingDays,
    signUpComplete,
};
