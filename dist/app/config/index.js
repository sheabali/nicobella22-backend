"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT || 2026,
    databaseUrl: process.env.DATABASE_URL,
    emailSender: {
        email: process.env.EMAIL,
        app_pass: process.env.APP_PASS,
    },
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryAPISecret: process.env.CLOUDINARY_API_SECRET,
    cloudinaryAPIKey: process.env.CLOUDINARY_API_KEY,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    resetPassUILink: process.env.RESET_PASS_UI_LINK,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    jwtResetPasswordExpiresIn: process.env.JWT_RESET_PASS_ACCESS_EXPIRES_IN,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    backendUrl: process.env.BACKEND_URL,
};
