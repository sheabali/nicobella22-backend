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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
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
        const builder = new QueryBuilder_1.default(prisma_1.default.invoice, query);
        const invoices = yield builder
            .search([
            "estimate.estimateId",
            "user.firstName",
            "user.lastName",
            "mechanic.firstName",
            "mechanic.lastName",
        ])
            .filter()
            .sort()
            .paginate()
            .include({
            user: true,
            // mechanic: true,
            // estimate: true, // if needed
            // company: true, // if needed
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
