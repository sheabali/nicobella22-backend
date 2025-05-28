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
exports.NeedHelpController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const needHelp_Service_1 = require("./needHelp.Service");
const createNeedHelpController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield needHelp_Service_1.NeedHelpService.createNeedHelp(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Help request submitted successfully.",
        success: true,
        data: result,
    });
}));
const getAllNeedHelpController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield needHelp_Service_1.NeedHelpService.getAllNeedHelp(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Help request retrieved successfully.",
        success: true,
        data: result,
    });
}));
const getSingleHelp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { helpId } = req.params;
    //   const authUser = req.user as { userId: string; role: string };
    const result = yield needHelp_Service_1.NeedHelpService.getSingleHelp(helpId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        message: "Vehicle retrieved successfully",
        success: true,
        data: result,
    });
}));
exports.NeedHelpController = {
    createNeedHelpController,
    getAllNeedHelpController,
    getSingleHelp,
};
