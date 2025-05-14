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
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const verifyToken_1 = require("../../utils/verifyToken");
const comparePasswords_1 = require("../../utils/comparePasswords");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const user_utils_1 = require("../user/user.utils");
const sendEmail_1 = require("../../utils/sendEmail");
const activeAccount = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, verifyToken_1.verifyToken)(token);
    const user = yield prisma_1.default.user.findUnique({
        where: { email: decodedToken.email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (user.isActive) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already active!");
    }
    yield prisma_1.default.user.update({
        where: { email: decodedToken.email },
        data: { isActive: true },
    });
    return null;
});
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (!user.isActive) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User is not active!");
    }
    const isPasswordMatched = yield (0, comparePasswords_1.passwordCompare)(password, user.password);
    if (!isPasswordMatched) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password is incorrect!");
    }
    const jwtPayload = {
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        isActive: user.isActive,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtAccessSecret, config_1.default.jwtAccessExpiresIn);
    return {
        accessToken,
    };
});
const changePassword = (userId, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const isPasswordMatch = yield (0, comparePasswords_1.passwordCompare)(currentPassword, user.password);
    if (!isPasswordMatch) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Current password is incorrect!");
    }
    const hashedNewPassword = yield (0, user_utils_1.hashPassword)(newPassword);
    yield prisma_1.default.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });
    return null;
});
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (!user.isActive) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "User account is not active!");
    }
    const jwtPayload = {
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        isActive: user.isActive,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtAccessSecret, config_1.default.jwtResetPasswordExpiresIn);
    const resetLink = `${config_1.default.backendUrl}/auth/reset-password/${resetToken}`;
    yield (0, sendEmail_1.sendEmail)(user.email, resetLink);
    return {
        message: "Password reset link sent to your email.",
    };
});
const resetPassword = (token, newPassword, confirmPassword) => __awaiter(void 0, void 0, void 0, function* () {
    if (newPassword !== confirmPassword) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Passwords do not match!");
    }
    const decoded = (0, verifyToken_1.verifyToken)(token, config_1.default.jwtAccessSecret);
    const user = yield prisma_1.default.user.findUnique({
        where: { email: decoded.email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const hashedPassword = yield (0, user_utils_1.hashPassword)(newPassword);
    yield prisma_1.default.user.update({
        where: { email: decoded.email },
        data: { password: hashedPassword },
    });
    return {
        message: "Password reset successfully!",
    };
});
exports.AuthService = {
    loginUser,
    resetPassword,
    activeAccount,
    changePassword,
    forgotPassword,
};
