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
exports.NeedHelpService = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createNeedHelp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newEntry = yield prisma_1.default.contact.create({
            data: payload,
        });
        return {
            data: newEntry,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while submitting the help request.",
        };
    }
});
const getAllNeedHelp = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    if (authUser.role !== "ADMIN") {
        return {
            success: false,
            message: "You are not authorized to view this resource.",
        };
    }
    try {
        const entries = yield prisma_1.default.contact.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        return {
            data: entries,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while fetching help requests.",
        };
    }
});
const getSingleHelp = (helpId) => __awaiter(void 0, void 0, void 0, function* () {
    const entries = yield prisma_1.default.contact.findUnique({
        where: {
            id: helpId,
        },
    });
    return {
        entries,
    };
});
exports.NeedHelpService = {
    createNeedHelp,
    getAllNeedHelp,
    getSingleHelp,
};
