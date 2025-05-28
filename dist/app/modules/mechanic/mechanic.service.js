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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_type_1 = require("../../types/user.type");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const auth_utils_1 = require("../auth/auth.utils");
const user_utils_1 = require("../user/user.utils");
// Step 1: Register Mechanic (Personal Information)
const registerService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate required fields
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phoneNumber",
            "country",
            "city",
            "zipCode",
        ];
        for (const field of requiredFields) {
            if (!payload[field]) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `${field} is required`);
            }
        }
        // Check if mechanic already exists by email
        const existingMechanic = yield prisma_1.default.mechanicRegistration.findFirst({
            where: { email: payload.email },
        });
        if (existingMechanic) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Mechanic already registered");
        }
        // Hash password if provided
        if (payload.password) {
            payload.password = yield (0, user_utils_1.hashPassword)(payload.password);
        }
        else {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Password is required");
        }
        // Create MechanicRegistration entry
        const newRegistration = yield prisma_1.default.mechanicRegistration.create({
            data: {
                id: payload.id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                password: payload.password,
                phoneNumber: payload.phoneNumber,
                country: payload.country,
                city: payload.city,
                zipCode: payload.zipCode,
                servicesOffered: payload.servicesOffered || "Oil Change", // Default if not provided
            },
        });
        return newRegistration;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to register mechanic", error.stack);
    }
});
// Step 2: Add Company Information
const addCompany = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate required fields
        const requiredFields = [
            "name",
            "address",
            "country",
            "city",
            "phoneNumber",
            "email",
            "mechanicId",
        ];
        for (const field of requiredFields) {
            if (!payload[field]) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `${field} is required`);
            }
        }
        // Check if mechanic exists
        if (!payload.mechanicId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "mechanicId is required");
        }
        const mechanicExists = yield prisma_1.default.mechanicRegistration.findUnique({
            where: { id: payload.mechanicId },
        });
        if (!mechanicExists) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mechanic not found for the given mechanicId");
        }
        // Check if company email already exists
        const existingCompany = yield prisma_1.default.company.findFirst({
            where: { email: payload.email },
        });
        if (existingCompany) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.CONFLICT, "Company email already registered");
        }
        // Create Company entry
        const newCompany = yield prisma_1.default.company.create({
            data: {
                name: payload.name,
                address: payload.address,
                country: payload.country,
                city: payload.city,
                phoneNumber: payload.phoneNumber,
                email: payload.email,
                mechanicId: payload.mechanicId,
            },
        });
        return newCompany;
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add company", error.stack);
    }
});
// Step 3: Add Working Days (Handle multiple days)
const addWorkingDays = (mechanicId, workingDays) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("mechanicEx", mechanicId, workingDays);
        // Validate mechanicId
        if (!mechanicId || !workingDays || !Array.isArray(workingDays)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Mechanic ID and working days array are required");
        }
        // Check if mechanic exists
        const mechanicExists = yield prisma_1.default.mechanicRegistration.findUnique({
            where: { id: mechanicId },
        });
        if (!mechanicExists) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mechanic not found for the given mechanicId");
        }
        // Prepare working days data
        const workingDayEntries = workingDays.map((day) => ({
            day: day.day,
            isClosed: day.isClosed,
            openTime: day.openTime || null,
            closeTime: day.closeTime || null,
            mechanicId,
        }));
        // Create multiple WorkingDay entries
        yield prisma_1.default.workingDay.createMany({
            data: workingDayEntries,
        });
        return { message: "Working days added successfully" };
    }
    catch (error) {
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to add working days", error.stack);
    }
});
// Step 4: Add Service Pricing
// const addServicePricing = async (payload: Partial<ServicePricing>) => {
//   try {
//     // Validate required fields
//     const requiredFields: (keyof ServicePricing)[] = [
//       'service',
//       'amount',
//       'mechanicId',
//     ];
//     for (const field of requiredFields) {
//       if (!payload[field]) {
//         throw new ApiError(StatusCodes.BAD_REQUEST, `${field} is required`);
//       }
//     }
//     // Check if mechanic exists
//     const mechanicExists = await prisma.mechanicRegistration.findUnique({
//       where: { id: payload.mechanicId },
//     });
//     if (!mechanicExists) {
//       throw new ApiError(
//         StatusCodes.NOT_FOUND,
//         'Mechanic not found for the given mechanicId'
//       );
//     }
//     // Create ServicePricing entry
//     const newServicePricing = await prisma.servicePricing.create({
//       data: {
//         service: payload.service!,
//         amount: payload.amount!,
//         mechanicId: payload.mechanicId!,
//       },
//     });
//     return newServicePricing;
//   } catch (error: any) {
//     if (error instanceof ApiError) {
//       throw error;
//     }
//     throw new ApiError(
//       StatusCodes.INTERNAL_SERVER_ERROR,
//       'Failed to add service pricing',
//       error.stack
//     );
//   }
// };
// Step 5: Complete Sign-Up
const signUpComplete = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Log payload for debugging
        console.log("Sign-up payload:", payload);
        // Validate required fields
        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "password",
        ];
        for (const field of requiredFields) {
            if (!payload[field]) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `${field} is required`);
            }
        }
        if (!payload.mechanicId) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Mechanic ID is required");
        }
        // Check if all previous steps are complete
        const mechanic = yield prisma_1.default.mechanicRegistration.findUnique({
            where: { id: payload.mechanicId },
            include: {
                companies: true,
                workingDays: true,
            },
        });
        if (!mechanic) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Mechanic not found");
        }
        if (!mechanic.companies.length) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Company information is missing");
        }
        if (!mechanic.workingDays.length) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Working days are missing");
        }
        // Check if user already exists
        const isUserExist = yield prisma_1.default.user.findUnique({
            where: { email: payload.email },
        });
        if (isUserExist) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User already exists");
        }
        // Hash password
        const hashedPassword = yield (0, user_utils_1.hashPassword)(payload.password);
        // Destructure to exclude image and mechanicId from being accidentally spread
        const { image, mechanicId, password } = payload, rest = __rest(payload, ["image", "mechanicId", "password"]);
        // Prepare user data with required fields asserted as non-undefined
        const userData = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
            image: image !== null && image !== void 0 ? image : "",
            password: hashedPassword,
            isActive: true,
            role: user_type_1.UserRole.MECHANIC,
            // Add any other fields from rest if needed, but required fields must be non-undefined
        };
        // Create new user
        const newUser = yield prisma_1.default.user.create({
            data: userData,
        });
        // Link User to MechanicRegistration
        yield prisma_1.default.mechanicRegistration.update({
            where: { id: mechanicId },
            data: { users: { connect: { id: newUser.id } } },
        });
        // Generate JWT token
        const jwtPayload = {
            id: newUser.id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            profilePic: newUser.image,
            role: newUser.role,
            isActive: newUser.isActive,
        };
        const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtAccessSecret, config_1.default.jwtAccessExpiresIn);
        return {
            accessToken,
            user: newUser,
        };
    }
    catch (error) {
        console.error("Sign-up complete error:", error); // 🔍 real error log
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to complete sign-up", error.stack);
    }
});
exports.MechanicServices = {
    registerService,
    addCompany,
    addWorkingDays,
    signUpComplete,
};
