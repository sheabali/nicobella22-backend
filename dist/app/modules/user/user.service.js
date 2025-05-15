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
exports.UserService = void 0;
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const auth_utils_1 = require("../auth/auth.utils");
const user_utils_1 = require("./user.utils");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const verifyToken_1 = require("../../utils/verifyToken");
const createUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (isUserExist) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
    }
    const hashedPassword = yield (0, user_utils_1.hashPassword)(payload.password);
    const userData = Object.assign(Object.assign({}, payload), { password: hashedPassword });
    const res = yield prisma_1.default.user.create({
        data: userData,
    });
    const jwtPayload = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        profilePic: payload.profilePic,
        role: client_1.UserRole.USER,
        isActive: false,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtAccessSecret, config_1.default.jwtAccessExpiresIn);
    // const confirmLink = `${config.backendUrl}/auth/active/${accessToken}`;
    // await sendEmail(payload?.email, undefined, confirmLink);
    return {
        accessToken,
        res,
    };
});
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePic: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Users not found!');
    }
    return result;
});
const activeAccount = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = (0, verifyToken_1.verifyToken)(token);
    const user = yield prisma_1.default.user.findUnique({
        where: { email: decodedToken.email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (user.isActive) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already active!');
    }
    yield prisma_1.default.user.update({
        where: { email: decodedToken.email },
        data: { isActive: true },
    });
    return {
        accessToken: token,
    };
});
const updateUserIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    if (!payload.profilePic) {
        payload.profilePic = isUserExist.profilePic;
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: userId },
        data: payload,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePic: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
const deleteUserFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExist = yield prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found!');
    }
    yield prisma_1.default.user.delete({
        where: { id: userId },
    });
    return null;
});
exports.UserService = {
    activeAccount,
    createUserIntoDB,
    getAllUserFromDB,
    updateUserIntoDB,
    deleteUserFromDB,
};
