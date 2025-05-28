"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_type_1 = require("../../types/user.type");
const upload_1 = require("../../utils/upload");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.get("/", user_controller_1.UserController.getAllUser);
router.get("/me", (0, auth_1.default)(user_type_1.UserRole.USER, user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC), user_controller_1.UserController.getMe);
router.post("/register", 
// validateRequest(UserValidation.createUserValidationSchema),
upload_1.upload.single("file"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, user_controller_1.UserController.createUser);
router.patch("/update-profile", upload_1.upload.single("file"), (req, res, next) => {
    if (req.body.data) {
        req.body = JSON.parse(req.body.data); // 'data' is expected to be JSON stringified
    }
    next();
}, (0, auth_1.default)(user_type_1.UserRole.USER, user_type_1.UserRole.ADMIN, user_type_1.UserRole.MECHANIC), (0, validateRequest_1.default)(user_validation_1.UserValidation.updateUserValidationSchema), user_controller_1.UserController.updateUser);
router.delete("/:userId", user_controller_1.UserController.deleteUser);
exports.UserRoutes = router;
