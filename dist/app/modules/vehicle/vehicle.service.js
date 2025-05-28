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
exports.VehicleService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const createVehicle = (payload, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aag", payload);
    const user = yield prisma_1.default.user.findUnique({
        where: { email: authUser.email },
    });
    console.log(user);
    if (!user) {
        throw new ApiError_1.default(400, "User does not exist");
    }
    // Optionally check role and mechanicId
    if (authUser.role === "user" && !authUser.id) {
        throw new ApiError_1.default(400, "Mechanic ID is required for mechanics");
    }
    // if (!images || images.length === 0) {
    //   throw new ApiError(StatusCodes.BAD_REQUEST, "Vehicle images are required.");
    // }
    // payload.image = images.map((image) => image.path);
    const newVehicle = yield prisma_1.default.vehicle.create({
        data: {
            userId: authUser.id,
            vehicleName: payload.vehicleName,
            vehicleMake: payload.vehicleMake,
            vehicleModel: payload.vehicleModel,
            vehicleYear: payload.vehicleYear,
            lastServiceDate: new Date(payload.lastServiceDate),
            image: payload.image,
        },
    });
    console.log("Vehicle created:", newVehicle);
    return newVehicle;
});
const getAllVehicle = (authUser, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield prisma_1.default.vehicle.findMany({
            where: {
                userId: authUser.id,
            },
            orderBy: { createdAt: "desc" },
        });
        return vehicles;
    }
    catch (error) {
        console.error("Error fetching vehicles:", error);
        throw new Error("Failed to fetch vehicles");
    }
});
const getSingleVehicle = (vehicleId, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("vehicleId", vehicleId);
    const vehicle = yield prisma_1.default.vehicle.findFirst({
        where: {
            id: vehicleId,
            userId: authUser.userId, // restrict to vehicles owned by the user
        },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    email: true,
                },
            },
        },
    });
    if (!vehicle) {
        throw new ApiError_1.default(404, "Vehicle not found or access denied");
    }
    return vehicle;
});
const deleteVehicle = (vehicleId, authUser) => __awaiter(void 0, void 0, void 0, function* () {
    // First, find the vehicle and make sure it belongs to the user
    const existingVehicle = yield prisma_1.default.vehicle.findUnique({
        where: { id: vehicleId },
    });
    console.log("existingVehicle", existingVehicle);
    if (!existingVehicle) {
        throw new ApiError_1.default(404, "Vehicle not found");
    }
    // Perform the deletion
    yield prisma_1.default.vehicle.delete({
        where: { id: vehicleId },
    });
    return { message: "Vehicle deleted successfully" };
});
exports.VehicleService = {
    createVehicle,
    getAllVehicle,
    getSingleVehicle,
    deleteVehicle,
};
