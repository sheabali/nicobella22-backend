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
exports.InvoiceService = void 0;
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_type_1 = require("../../types/user.type");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createInvoice = (payload, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Authenticated user:", authUser);
    // Optional: role-based access check
    if (authUser.role !== "ADMIN" && authUser.role !== "MECHANIC") {
        throw new Error("Unauthorized to create invoice");
    }
    // Validate input (optional here if already done in controller)
    // Create invoice using Prisma
    const invoice = yield prisma_1.default.invoice.create({
        data: {
            estimateId: payload.estimateId,
            userId: payload.userId,
            companyId: payload.companyId,
            mechanicId: payload.mechanicId,
            serviceType: payload.serviceType,
            servicePrice: payload.servicePrice,
            date: new Date(payload.date),
            time: payload.time,
            status: payload.status,
        },
    });
    return invoice;
});
const getAllInvoice = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Build role-based filter
        const rawFilter = {};
        if (authUser.role === user_type_1.UserRole.USER) {
            rawFilter.userId = authUser.id;
        }
        else if (authUser.role === user_type_1.UserRole.MECHANIC) {
            if (!authUser.id) {
                throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Mechanic ID is required");
            }
            rawFilter.mechanicId = authUser.id;
        }
        // For ADMIN, no filter needed (they see everything)
        const builder = new QueryBuilder_1.default(prisma_1.default.invoice, query);
        const invoices = yield builder
            .rawFilter(rawFilter) // apply role-based filter
            .filter()
            .search([
            "estimate.estimateId",
            "user.firstName",
            "user.lastName",
            "mechanic.firstName",
            "mechanic.lastName",
        ])
            .sort()
            .paginate()
            .include({
            user: true,
            mechanic: true,
            // estimate: true,
            company: true,
        })
            .execute();
        const meta = yield builder.countTotal();
        return {
            success: true,
            data: invoices,
            meta,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while fetching invoices.",
        };
    }
});
const getAllInvoiceRechartData = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield prisma_1.default.invoice.findMany({
            where: {
                mechanicId: authUser.id, // Assuming you want to filter by the authenticated user
            },
            include: {
                user: true,
                // Uncomment the following as needed
                // mechanic: true,
                // estimate: true,
                // company: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            success: true,
            data: invoices,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while fetching invoices.",
        };
    }
});
exports.InvoiceService = {
    createInvoice,
    getAllInvoice,
    getAllInvoiceRechartData,
};
