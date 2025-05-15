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
exports.CompanyServices = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const client_1 = require("@prisma/client");
const mongodb_1 = require("mongodb");
const companyService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // Input validation
        if (!payload.name || !payload.email) {
            throw new ApiError_1.default(400, 'Name and email are required');
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            throw new ApiError_1.default(400, 'Invalid email format');
        }
        if (!payload.address ||
            !payload.country ||
            !payload.city ||
            !payload.phoneNumber) {
            throw new ApiError_1.default(400, 'Address, country, city, and phone number are required');
        }
        // Check for existing company by email
        const existingCompany = yield prisma_1.default.company.findUnique({
            where: {
                email: payload.email,
            },
        });
        if (existingCompany) {
            throw new ApiError_1.default(409, 'Company with this email already registered');
        }
        // Validate mechanicId if provided
        if (payload.mechanicId) {
            if (!mongodb_1.ObjectId.isValid(payload.mechanicId)) {
                throw new ApiError_1.default(400, 'Invalid mechanic ID format. Must be a 24-character hexadecimal string.');
            }
            const mechanic = yield prisma_1.default.mechanicRegistration.findUnique({
                where: { id: payload.mechanicId },
            });
            if (!mechanic) {
                throw new ApiError_1.default(400, 'Mechanic ID does not exist');
            }
        }
        // Create new company
        const newCompany = yield prisma_1.default.company.create({
            data: {
                name: payload.name,
                address: payload.address,
                country: payload.country,
                city: payload.city,
                phoneNumber: payload.phoneNumber,
                email: payload.email,
                mechanicId: (_a = payload.mechanicId) !== null && _a !== void 0 ? _a : null,
            },
        });
        return newCompany;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ApiError_1.default(409, 'A company with this email already exists');
            }
            if (error.code === 'P2003') {
                throw new ApiError_1.default(400, 'Invalid mechanic ID');
            }
            if (error.code === 'P2023') {
                throw new ApiError_1.default(400, 'Invalid ID format: Malformed ObjectID');
            }
        }
        console.error('Error registering company:', error);
        throw new ApiError_1.default(500, 'Failed to register company', error.message);
    }
});
exports.CompanyServices = {
    companyService,
};
