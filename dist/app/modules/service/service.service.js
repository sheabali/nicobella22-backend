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
exports.ServicesPricing = void 0;
const zod_1 = require("zod");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createService = (payload, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Create the service pricing
        const created = yield prisma_1.default.servicePricing.create({
            data: {
                mechanicId: authUser.id,
                serviceName: payload.serviceName,
                servicePrice: payload.servicePrice,
            },
        });
        return {
            data: created,
        };
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return {
                success: false,
                message: "Validation failed.",
                errors: error.flatten().fieldErrors,
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const getAllService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield prisma_1.default.servicePricing.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            success: true,
            data: services,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const getServiceByMechanic = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("authUser", authUser);
    try {
        // Check if the user is a mechanic
        if (authUser.role !== "MECHANIC") {
            throw new Error("Unauthorized: Only mechanics can view their service pricing.");
        }
        const services = yield prisma_1.default.servicePricing.findMany({
            where: {
                mechanicId: authUser.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            success: true,
            data: services,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
exports.ServicesPricing = {
    createService,
    getAllService,
    getServiceByMechanic,
};
