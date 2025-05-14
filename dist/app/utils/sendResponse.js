"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data.statusCode).json({
        success: true,
        message: data.message,
        meta: data.meta || null || undefined,
        data: (data === null || data === void 0 ? void 0 : data.data) || null || undefined,
    });
};
exports.default = sendResponse;
