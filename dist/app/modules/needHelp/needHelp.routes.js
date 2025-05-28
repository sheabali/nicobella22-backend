"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NeedHelpRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_type_1 = require("../../types/user.type");
const needHelp_controller_1 = require("./needHelp.controller");
const router = (0, express_1.Router)();
router.get("/", (0, auth_1.default)(user_type_1.UserRole.ADMIN), needHelp_controller_1.NeedHelpController.getAllNeedHelpController);
router.post("/", needHelp_controller_1.NeedHelpController.createNeedHelpController);
router.get("/:helpId", needHelp_controller_1.NeedHelpController.getSingleHelp);
exports.NeedHelpRoutes = router;
