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
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
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
const getAllNeedHelp = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const queryBuilder = new QueryBuilder_1.default(prisma_1.default.contact, query);
        const services = yield queryBuilder
            .search(["serviceName"])
            .filter()
            // .include({ mechanic: true })
            .sort()
            .paginate()
            .execute();
        const meta = yield queryBuilder.countTotal();
        return {
            success: true,
            data: services,
            meta,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while fetching services.",
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
