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
exports.EstimateService = exports.upcomingAppointments = exports.totalEstimatesAccepted = exports.createEstimate = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const generateEstimateId = () => __awaiter(void 0, void 0, void 0, function* () {
    const lastEstimate = yield prisma_1.default.estimate.findFirst({
        orderBy: { createdAt: "desc" },
        select: { estimateId: true },
    });
    let lastNumber = 0;
    if (lastEstimate === null || lastEstimate === void 0 ? void 0 : lastEstimate.estimateId) {
        const match = lastEstimate.estimateId.match(/\d+$/);
        if (match) {
            lastNumber = parseInt(match[0]);
        }
    }
    return `EST-${(lastNumber + 1).toString().padStart(5, "0")}`;
});
const createEstimate = (payload, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Optional: check if user exists
    const user = yield prisma_1.default.user.findUnique({
        where: { id: authUser.id },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "User not found");
    }
    // Optional: check if mechanic exists
    const mechanic = yield prisma_1.default.user.findUnique({
        where: { id: (_a = payload.mechanicId) !== null && _a !== void 0 ? _a : undefined },
    });
    if (!mechanic) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Mechanic not found");
    }
    // Generate a unique estimate ID
    const estimateId = yield generateEstimateId();
    const newEstimate = yield prisma_1.default.estimate.create({
        data: {
            estimateId,
            userId: authUser.id,
            mechanicId: payload.mechanicId,
            service: payload.service,
            amount: payload.amount,
            status: payload.status || client_1.Status.PENDING,
            date: new Date(payload.date),
        },
    });
    return newEstimate;
});
exports.createEstimate = createEstimate;
const getAllEstimate = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("authUser", authUser);
    // Base filters based on role
    const filters = {};
    if (authUser.role === "USER") {
        filters.userId = authUser.id;
    }
    else if (authUser.role === "MECHANIC") {
        filters.mechanicId = authUser.id;
    }
    // Initialize builder
    const builder = new QueryBuilder_1.default(prisma_1.default.estimate, query);
    const estimates = yield builder
        .search(["estimateId", "service"])
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
        data: estimates,
    };
});
const acceptEstimateStatus = (estimateId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Updating estimateId:", estimateId, "to status: ACCEPTED");
    try {
        // Validate the estimate exists
        const estimate = yield prisma_1.default.booking.findUnique({
            where: { id: estimateId },
        });
        if (!estimate) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Estimate not found");
        }
        // Update the status on the corresponding booking
        const updatedBooking = yield prisma_1.default.booking.update({
            where: {
                id: estimateId,
            },
            data: {
                status: "ACCEPT",
            },
        });
        console.log("updatedBooking", updatedBooking);
        return updatedBooking;
    }
    catch (error) {
        console.error("Failed to update estimate status:", error);
        // Re-throw original ApiError if it was thrown
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        // Throw generic server error otherwise
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Could not update estimate status");
    }
});
const rejectEstimateStatus = (estimateId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Updating estimateId:", estimateId, "to status: REJECTED");
    try {
        // Validate the estimate exists
        const estimate = yield prisma_1.default.booking.findUnique({
            where: { id: estimateId },
        });
        if (!estimate) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Estimate not found");
        }
        // Update the status on the corresponding booking
        const updatedBooking = yield prisma_1.default.booking.update({
            where: {
                id: estimateId,
            },
            data: {
                status: "REJECTED",
            },
        });
        return updatedBooking;
    }
    catch (error) {
        console.error("Failed to update estimate status:", error);
        // Re-throw original ApiError if it was thrown
        if (error instanceof ApiError_1.default) {
            throw error;
        }
        // Throw generic server error otherwise
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Could not update estimate status");
    }
});
const totalEstimates = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Calculating total estimates for user:", authUser.id);
    // Find the user by email
    const user = yield prisma_1.default.user.findUnique({
        where: { email: authUser.email },
    });
    console.log("user found:", user);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const filters = {};
    if (authUser.role === "USER") {
        filters.userId = user.id;
    }
    else if (authUser.role === "MECHANIC") {
        filters.mechanicId = user.mechanicId;
    }
    const total = yield prisma_1.default.booking.count({
        where: filters,
    });
    console.log("Total estimates for user:", authUser.id, "is", total);
    return { total };
});
const totalEstimatesAccepted = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Calculating total accepted estimates for user:", authUser.id);
    // Find the user by email
    const user = yield prisma_1.default.user.findUnique({
        where: { email: authUser.email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    // Build filters
    const filters = {
        status: "ACCEPT", // Only count accepted bookings
    };
    if (authUser.role === "USER") {
        filters.userId = user.id;
    }
    else if (authUser.role === "MECHANIC") {
        filters.mechanicId = user.mechanicId || undefined;
    }
    const total = yield prisma_1.default.booking.count({
        where: filters,
    });
    console.log("Total accepted estimates for user:", authUser.id, "is", total);
    return { total };
});
exports.totalEstimatesAccepted = totalEstimatesAccepted;
const upcomingAppointments = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Find the user by email
    const user = yield prisma_1.default.user.findUnique({
        where: { email: authUser.email },
    });
    console.log("user found:", user);
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to start of today
    const filters = {
        status: "PENDING",
    };
    if (authUser.role === "USER") {
        filters.userId = user.id;
    }
    else if (authUser.role === "MECHANIC") {
        filters.mechanicId = (_a = user.mechanicId) !== null && _a !== void 0 ? _a : undefined;
    }
    const total = yield prisma_1.default.booking.count({
        where: filters,
    });
    console.log("a", total);
    console.log("Total upcoming PENDING bookings for user:", user.id, "is", total);
    return { total };
});
exports.upcomingAppointments = upcomingAppointments;
exports.EstimateService = {
    createEstimate: exports.createEstimate,
    getAllEstimate,
    acceptEstimateStatus,
    rejectEstimateStatus,
    totalEstimatesAccepted: exports.totalEstimatesAccepted,
    totalEstimates,
    upcomingAppointments: exports.upcomingAppointments,
};
