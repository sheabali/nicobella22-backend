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
exports.InvoiceController = void 0;
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const invoice_service_1 = require("./invoice.service");
const createInvoiceController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield invoice_service_1.InvoiceService.createInvoice(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.CREATED,
        message: "Create Invoice succesfully",
        success: true,
        data: result,
    });
}));
const getAllInvoiceController = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield invoice_service_1.InvoiceService.getAllInvoice(req.query, // Pass query params
    req.user // Pass authenticated user
    );
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK, // Use 200 OK for retrieval
        message: "Invoices retrieved successfully",
        success: true,
        data: result,
    });
}));
const getAllInvoiceRechartData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield invoice_service_1.InvoiceService.getAllInvoiceRechartData(req.user // Pass authenticated user
    );
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK, // Use 200 OK for retrieval
        message: "Rechart Data retrieved successfully",
        success: true,
        data: result,
    });
}));
exports.InvoiceController = {
    createInvoiceController,
    getAllInvoiceController,
    getAllInvoiceRechartData,
};
