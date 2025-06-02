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
exports.BookingServices = void 0;
const client_1 = require("@prisma/client");
const mongodb_1 = require("mongodb");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const http_status_codes_1 = require("http-status-codes");
const zod_1 = require("zod");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const user_type_1 = require("../../types/user.type");
const generateEstimateId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastBooking = yield prisma_1.default.booking.findFirst({
        orderBy: { createdAt: "desc" },
        select: { estimateId: true },
    });
    let lastNumber = 0;
    if (lastBooking === null || lastBooking === void 0 ? void 0 : lastBooking.estimateId) {
        const match = lastBooking.estimateId.match(/\d+$/);
        if (match) {
            lastNumber = parseInt(match[0]);
        }
    }
    return `EST-${(lastNumber + 1).toString().padStart(5, "0")}`;
});
const bookingService = (payload, p0) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, mechanicId, companyId, service, amount, date, location, countryCode, phoneNumber, } = payload;
        console.log("booking payload", payload);
        // Validate userId
        if (!userId || !mongodb_1.ObjectId.isValid(userId)) {
            throw new ApiError_1.default(400, "Invalid user ID format. Must be a 24-character hexadecimal string.");
        }
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new ApiError_1.default(400, "User ID does not exist");
        }
        // Validate mechanicId
        if (!mechanicId || !mongodb_1.ObjectId.isValid(mechanicId)) {
            throw new ApiError_1.default(400, "Invalid mechanic ID format. Must be a 24-character hexadecimal string.");
        }
        const mechanic = yield prisma_1.default.user.findUnique({
            where: { id: mechanicId !== null && mechanicId !== void 0 ? mechanicId : undefined },
        });
        if (!mechanic) {
            throw new ApiError_1.default(400, "Mechanic ID does not exist");
        }
        // Validate companyId
        if (!companyId || !mongodb_1.ObjectId.isValid(companyId)) {
            throw new ApiError_1.default(400, "Invalid company ID format. Must be a 24-character hexadecimal string.");
        }
        const company = yield prisma_1.default.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            throw new ApiError_1.default(400, "Company ID does not exist");
        }
        // Additional validation for phoneNumber format (optional)
        if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
            throw new ApiError_1.default(400, "Invalid phone number format");
        }
        if (user.role == user_type_1.UserRole.MECHANIC) {
            throw new ApiError_1.default(403, "Mechanic are not create a booking");
        }
        // Generate a unique estimate ID
        const estimateId = yield generateEstimateId();
        // Create new booking
        const newBooking = yield prisma_1.default.booking.create({
            data: {
                user: { connect: { id: userId } },
                mechanic: { connect: { id: mechanicId } },
                company: { connect: { id: companyId } },
                estimateId,
                service,
                amount,
                date: new Date(date),
                location,
                countryCode,
                phoneNumber,
                status: "PENDING",
            },
        });
        return newBooking;
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            throw new ApiError_1.default(400, "Validation failed", error.errors.map((e) => e.message).join(", "));
        }
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2003") {
                throw new ApiError_1.default(400, "Invalid reference ID (user, mechanic, or company)");
            }
            if (error.code === "P2023") {
                throw new ApiError_1.default(400, "Invalid ID format: Malformed ObjectID");
            }
        }
        console.error("Error creating booking:", error);
        throw new ApiError_1.default(500, "Failed to create booking", error.message);
    }
});
const getAllBooking = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("authUser", authUser);
    try {
        // Validate email
        if (!authUser.email || typeof authUser.email !== "string") {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid or missing email");
        }
        // Fetch user by email
        const user = yield prisma_1.default.user.findUnique({
            where: { email: authUser.email },
        });
        console.log("user", user);
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Validate role
        const validRoles = [user_type_1.UserRole.USER, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.ADMIN];
        if (!validRoles.includes(authUser.role)) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid role for accessing bookings");
        }
        // Build role-based filter
        const rawFilter = {};
        if (authUser.role === user_type_1.UserRole.USER) {
            rawFilter.userId = user.id;
        }
        else if (authUser.role === user_type_1.UserRole.MECHANIC) {
            if (!authUser.id) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Mechanic ID is required");
            }
            rawFilter.mechanicId = user.id;
        }
        const builder = new QueryBuilder_1.default(prisma_1.default.booking, query);
        const bookings = yield builder
            .rawFilter(rawFilter)
            .search(["status", "note"]) // adjust searchable fields as needed
            .filter()
            .sort()
            .paginate()
            .include({
            user: true,
            mechanic: true,
            company: true,
        })
            .execute();
        const meta = yield builder.countTotal();
        console.log("Bookings retrieved:", meta);
        return { bookings, meta };
    }
    catch (error) {
        if (error instanceof ApiError_1.default)
            throw error;
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
            error.code === "P2023") {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid ID format: Malformed ObjectID");
        }
        console.error("❌ Error retrieving bookings:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to retrieve bookings", error.message);
    }
});
const RejectEstimates = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = {
        status: "REJECTED", // filter for rejected only
    };
    // Apply role-based filtering
    if (authUser.role === "USER") {
        filters.userId = authUser.id;
    }
    else if (authUser.role === "MECHANIC") {
        filters.mechanicId = authUser.id;
    }
    const builder = new QueryBuilder_1.default(prisma_1.default.booking, query);
    const rejectedEstimates = yield builder
        .filter()
        .rawFilter(filters)
        .sort()
        .paginate()
        .include({
        user: true,
        mechanic: true,
    })
        .execute();
    const meta = yield builder.countTotal();
    return {
        meta,
        data: rejectedEstimates,
    };
});
exports.BookingServices = {
    getAllBooking,
    bookingService,
    RejectEstimates,
};
