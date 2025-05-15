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
exports.MechanicServices = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const registerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if mechanic already exists by a unique field
        const existingMechanic = yield prisma_1.default.mechanicRegistration.findFirst({
            where: {
                email: payload.email,
            },
        });
        if (existingMechanic) {
            throw new ApiError_1.default(409, 'Mechanic already registered');
        }
        // Proceed with registration
        const newRegistration = yield prisma_1.default.mechanicRegistration.create({
            data: payload,
        });
        return newRegistration;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(500, 'Failed to register mechanic', error.stack);
    }
});
exports.MechanicServices = {
    registerService,
};
