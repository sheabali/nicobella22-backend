"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_type_1 = require("../../types/user.type");
const upload_1 = require("../../utils/upload");
const vehicle_controller_1 = require("./vehicle.controller");
const router = (0, express_1.Router)();
router.post("/", 
// validateRequest(),
(0, auth_1.default)(user_type_1.UserRole.USER), 
// multerUpload.fields([{ name: "images" }]),
// parseBody,
upload_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, vehicle_controller_1.VehicleController.createVehicle);
router.get("/", (0, auth_1.default)(user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC, user_type_1.UserRole.USER), vehicle_controller_1.VehicleController.getAllVehicle);
router.get("/:vehicleId", (0, auth_1.default)(user_type_1.UserRole.USER), vehicle_controller_1.VehicleController.getSingleVehicle);
router.delete("/:vehicleId", (0, auth_1.default)(user_type_1.UserRole.USER), vehicle_controller_1.VehicleController.deleteVehicleController);
exports.VehicleRoutes = router;
