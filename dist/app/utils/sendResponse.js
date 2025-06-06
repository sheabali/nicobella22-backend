"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.message,
        message: data.message,
        data: data.data || null || undefined, // Ensure data is never undefined
        meta: data.meta, // Optional, for pagination or additional metadata
    });
};
exports.default = sendResponse;
