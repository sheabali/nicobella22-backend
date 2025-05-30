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
exports.AccountService = exports.totalBookedService = exports.getAllUser = exports.countActiveMechanics = void 0;
const client_1 = require("@prisma/client");
const http_status_codes_1 = require("http-status-codes");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_type_1 = require("../../types/user.type");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getAllMechanic = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure only ADMIN can access
        if (authUser.role !== "ADMIN") {
            throw new Error("Unauthorized: Only admin can view all mechanics.");
        }
        const builder = new QueryBuilder_1.default(prisma_1.default.user, query);
        const mechanics = yield builder
            .rawFilter({ role: "MECHANIC" }) // ensure role filtering
            .search(["firstName", "lastName", "email"])
            .filter()
            .sort()
            .paginate()
            .fields()
            .execute();
        const meta = yield builder.countTotal();
        return {
            success: true,
            data: mechanics,
            meta, // includes page, limit, total, totalPage
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const getAllMechanics = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (authUser.role !== "ADMIN") {
            throw new Error("Unauthorized: Only admin can view all mechanics.");
        }
        const builder = new QueryBuilder_1.default(prisma_1.default.user, query);
        const mechanics = yield builder
            .rawFilter({ role: "MECHANIC" })
            .search(["firstName", "lastName", "email"])
            .filter()
            .sort()
            .paginate()
            .fields()
            .execute();
        const meta = yield builder.countTotal();
        // Add service count & revenue to each mechanic
        const mechanicWithStats = yield Promise.all(mechanics.map((mechanic) => __awaiter(void 0, void 0, void 0, function* () {
            const services = yield prisma_1.default.booking.findMany({
                where: {
                    mechanicId: mechanic.mechanicId,
                    status: "ACCEPT", // only completed services
                },
                select: {
                    amount: true,
                },
            });
            console.log("services", services);
            const servicesCompleted = services.length;
            const totalRevenue = services.reduce((acc, s) => acc + s.amount, 0);
            return Object.assign(Object.assign({}, mechanic), { servicesCompleted,
                totalRevenue });
        })));
        return {
            success: true,
            data: mechanicWithStats,
            meta,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const countActiveMechanics = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Define filter for active mechanics
        const filters = {
            role: user_type_1.UserRole.MECHANIC,
            isActive: true,
        };
        // Count matching mechanics
        const total = yield prisma_1.default.user.count({
            where: filters,
        });
        // Log the count along with the requesting user's ID
        console.log("Total active mechanics for user:", authUser.id, "is", total);
        // Return the result
        return { total };
    }
    catch (error) {
        console.error("Failed to count active mechanics:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Could not count active mechanics");
    }
});
exports.countActiveMechanics = countActiveMechanics;
const getAllUser = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (authUser.role !== "ADMIN") {
            throw new Error("Unauthorized: Only admin can view all users.");
        }
        const builder = new QueryBuilder_1.default(prisma_1.default.user, query);
        const users = yield builder
            .rawFilter({ role: "USER" })
            .search(["firstName", "lastName", "email"])
            .filter()
            .sort()
            .paginate()
            .fields()
            .execute();
        const meta = yield builder.countTotal();
        // Add service count & totalSpent for each user
        const usersWithStats = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            const bookings = yield prisma_1.default.booking.findMany({
                where: {
                    userId: user.id,
                    status: "ACCEPT", // Only completed bookings
                },
                select: {
                    amount: true,
                },
            });
            const servicesCompleted = bookings.length;
            const totalSpent = bookings.reduce((acc, b) => acc + b.amount, 0);
            return Object.assign(Object.assign({}, user), { servicesCompleted,
                totalSpent });
        })));
        return {
            success: true,
            data: usersWithStats,
            meta,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
exports.getAllUser = getAllUser;
const deactivateMechanic = (mechanicId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch mechanic by ID
        const mechanic = yield prisma_1.default.user.findUnique({
            where: { id: mechanicId },
        });
        // If not found, throw error early
        if (!mechanic) {
            throw new Error("Mechanic not found.");
        }
        // If role is not MECHANIC, throw error
        if (mechanic.role !== "MECHANIC") {
            throw new Error("Invalid role. Only mechanics can be deactivated via this route.");
        }
        // Update isActive status
        const updatedMechanic = yield prisma_1.default.user.update({
            where: { id: mechanicId },
            data: { isActive: false },
        });
        console.log(updatedMechanic);
        return {
            success: true,
            data: updatedMechanic,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const warningMechanic = (mechanicId, warning) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the mechanic exists and has role = "MECHANIC"
        const mechanic = yield prisma_1.default.user.findUnique({
            where: { id: mechanicId },
        });
        if (!mechanic || mechanic.role !== "MECHANIC") {
            throw new Error("Mechanic not found or invalid role.");
        }
        // Update mechanic's warning field
        const updatedMechanic = yield prisma_1.default.user.update({
            where: { id: mechanicId },
            data: {
                warning: warning,
            },
        });
        return {
            data: updatedMechanic,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const getAllService = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filterData = prisma_1.default.servicePricing.findMany({
            where: { isDelete: false },
        });
        console.log("filterData", filterData);
        const queryBuilder = new QueryBuilder_1.default(prisma_1.default.servicePricing, query);
        const services = yield queryBuilder
            .search(["serviceName"])
            .filter()
            .include({ mechanic: true })
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
const activeService = (serviceId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch mechanic by ID
        const service = yield prisma_1.default.servicePricing.findUnique({
            where: { id: serviceId },
        });
        // If not found, throw error early
        if (!service) {
            throw new Error("Service not found.");
        }
        // Update isActive status
        const updatedService = yield prisma_1.default.servicePricing.update({
            where: { id: serviceId },
            data: { isActive: status },
        });
        return {
            success: true,
            data: updatedService,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const deactivateService = (serviceId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch mechanic by ID
        const service = yield prisma_1.default.servicePricing.findUnique({
            where: { id: serviceId },
        });
        // If not found, throw error early
        if (!service) {
            throw new Error("Service not found.");
        }
        // Update isActive status
        const updatedService = yield prisma_1.default.servicePricing.update({
            where: { id: serviceId },
            data: { isActive: status },
        });
        return {
            success: true,
            data: updatedService,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const deleteService = (serviceId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingService = yield prisma_1.default.servicePricing.findUnique({
            where: { id: serviceId },
        });
        if (!existingService) {
            return {
                success: false,
                message: "Service not found.",
            };
        }
        // Delete the service
        yield prisma_1.default.servicePricing.delete({
            where: { id: serviceId },
            // data: { isDelete: true },
        });
        return {
            success: true,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while deleting the service.",
        };
    }
});
const deleteCustomer = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("customer id", customerId);
    try {
        const existingUser = yield prisma_1.default.user.findUnique({
            where: { id: customerId },
        });
        if (!existingUser) {
            return {
                success: false,
                message: "User not found.",
            };
        }
        // Soft delete the user
        yield prisma_1.default.user.update({
            where: { id: customerId },
            data: {
                isDelete: true, // assuming this field exists in your Prisma model
            },
        });
        return {
            success: true,
            message: "Customer marked as deleted successfully.",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while deleting the customer.",
        };
    }
});
const deactivateCustomer = (customerId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch mechanic by ID
        const customer = yield prisma_1.default.user.findUnique({
            where: { id: customerId },
        });
        // console.log("warning", status);
        // If not found, throw error early
        if (!customer) {
            throw new Error("customer not found.");
        }
        // If role is not MECHANIC, throw error
        if (customer.role !== "USER") {
            throw new Error("Invalid role. Only customer can be deactivated via this route.");
        }
        // Update isActive status
        const updatedMechanic = yield prisma_1.default.user.update({
            where: { id: customerId },
            data: { isActive: false },
        });
        return {
            success: true,
            data: updatedMechanic,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred.",
        };
    }
});
const appointmentService = (query, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure only ADMIN can access
        if (authUser.role !== "ADMIN") {
            throw new Error("Unauthorized: Only admin can view appointments.");
        }
        const queryBuilder = new QueryBuilder_1.default(prisma_1.default.booking, query);
        const appointments = yield queryBuilder
            .search(["customerName", "mechanicName"])
            .filter()
            .include({
            user: true,
            mechanic: true,
            company: true, // optional, if you want company data as well
        })
            .sort()
            .paginate()
            .execute();
        const meta = yield queryBuilder.countTotal();
        return {
            success: true,
            data: appointments,
            meta,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error instanceof Error
                ? error.message
                : "An error occurred while fetching appointments.",
        };
    }
});
const appointmentStatus = (appointmentId_1, _a) => __awaiter(void 0, [appointmentId_1, _a], void 0, function* (appointmentId, { status, }) {
    // Validate new status
    const validStatuses = Object.values(client_1.Status);
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, `Invalid status. Allowed statuses: ${validStatuses.join(", ")}`);
    }
    // Find booking
    const booking = yield prisma_1.default.booking.findUnique({
        where: { id: appointmentId },
    });
    if (!booking) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Appointment not found.");
    }
    // Update status
    const updatedBooking = yield prisma_1.default.booking.update({
        where: { id: appointmentId },
        data: { status: status },
    });
    return {
        updatedBooking,
    };
});
const totalBookedService = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all service pricing entries
        const services = yield prisma_1.default.servicePricing.count({
            where: { isActive: false },
        });
        return {
            success: true,
            message: "All services fetched successfully.",
            data: services,
        };
    }
    catch (error) {
        console.error("Failed to fetch services:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Could not fetch service list");
    }
});
exports.totalBookedService = totalBookedService;
const totalServicesBooked = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch user by email
    const user = yield prisma_1.default.user.findUnique({
        where: { email: authUser.email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
    }
    // Count bookings for this user
    const totalBooked = yield prisma_1.default.booking.count();
    console.log(`Total services booked by user ${user.id}:`, totalBooked);
    return {
        success: true,
        message: "Total booked services fetched successfully.",
        data: { totalBooked },
    };
});
const totalRevenue = (authUser) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch user by email
        const user = yield prisma_1.default.user.findUnique({
            where: { email: authUser.email },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Sum up revenue from completed bookings associated with the user
        const result = yield prisma_1.default.invoice.findMany({
            where: {
                status: "ACCEPT",
            },
        });
        return {
            success: true,
            message: "Total revenue calculated successfully.",
            data: result,
        };
    }
    catch (error) {
        console.error("Failed to calculate total revenue:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Could not calculate total revenue");
    }
});
const getSingleCompanyWithMechanicId = (mechanicId, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("mechanicId", mechanicId);
    try {
        // Verify that the user exists
        const user = yield prisma_1.default.user.findUnique({
            where: { email: authUser.email },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Authenticated user not found");
        }
        // Find company record(s) for this mechanicId
        const companies = yield prisma_1.default.company.findMany({
            where: {
                mechanicId: mechanicId,
            },
        });
        if (companies.length === 0) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "No companies found for this mechanic");
        }
        return {
            success: true,
            message: "Company details retrieved successfully.",
            data: companies,
        };
    }
    catch (error) {
        console.error("Error fetching company by mechanic ID:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to retrieve company information");
    }
});
const makeAdmin = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch user by email
        const user = yield prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new ApiError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        // Update user's role to ADMIN
        const updatedUser = yield prisma_1.default.user.update({
            where: { email },
            data: { role: "ADMIN" },
        });
        return {
            success: true,
            message: "User has been promoted to admin successfully.",
            data: updatedUser,
        };
    }
    catch (error) {
        console.error("Failed to promote user to admin:", error);
        throw new ApiError_1.default(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Could not promote user to admin");
    }
});
exports.AccountService = {
    getAllMechanic,
    getAllUser: exports.getAllUser,
    deactivateMechanic,
    warningMechanic,
    getAllService,
    deactivateService,
    deleteCustomer,
    deleteService,
    deactivateCustomer,
    appointmentService,
    appointmentStatus,
    countActiveMechanics: exports.countActiveMechanics,
    totalBookedService: exports.totalBookedService,
    totalServicesBooked,
    totalRevenue,
    getAllMechanics,
    getSingleCompanyWithMechanicId,
    activeService,
    makeAdmin,
};
