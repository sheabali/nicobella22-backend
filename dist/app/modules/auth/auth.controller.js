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
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const activeAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    console.log(token);
    const result = yield auth_service_1.AuthService.activeAccount(token);
    res.redirect(`${config_1.default.frontend_url}/verified-success`);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User account activated successfully!",
        data: result,
    });
}));
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = yield auth_service_1.AuthService.loginUser(email, password);
    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: true,
        maxAge: 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: "User logged in successfully!",
        success: true,
        data: result,
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    yield auth_service_1.AuthService.changePassword(userId, currentPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "User password changed successfully!",
        success: true,
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield auth_service_1.AuthService.forgotPassword(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: result.message,
        success: true,
        data: result,
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;
    const result = yield auth_service_1.AuthService.resetPassword(token, newPassword, confirmPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: result.message,
        success: true,
        data: result,
    });
}));
exports.AuthController = {
    login,
    activeAccount,
    resetPassword,
    forgotPassword,
    changePassword,
};
