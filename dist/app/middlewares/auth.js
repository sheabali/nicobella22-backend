"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const http_status_codes_1 = require("http-status-codes");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const prisma_1 = __importDefault(require("../utils/prisma"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        if (!token) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, 
            // config.jwt_access_secre as string
            config_1.default.jwtAccessSecret);
            const { role, email, id } = decoded;
            const user = yield prisma_1.default.user.findMany({
                where: { id, email, role, isActive: true },
            });
            if (!user) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "This user is not found!");
            }
            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                return next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Token has expired! Please login again."));
            }
            return next(new ApiError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Invalid token!"));
        }
    }));
};
exports.default = auth;
