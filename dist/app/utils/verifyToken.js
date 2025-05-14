"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const config_1 = __importDefault(require("../config"));
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, (secret = config_1.default.jwtAccessSecret));
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized");
    }
};
exports.verifyToken = verifyToken;
