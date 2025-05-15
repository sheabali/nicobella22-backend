"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const verifyToken = (token, secret = config_1.default.jwtAccessSecret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "JWT token is expired");
        }
        else if (error.name === "JsonWebTokenError") {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid JWT token");
        }
        else {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Failed to verify token");
        }
    }
};
exports.verifyToken = verifyToken;
