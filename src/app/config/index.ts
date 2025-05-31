import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 2026,
  databaseUrl: process.env.DATABASE_URL,
  emailSender: {
    email: process.env.EMAIL,
    app_pass: process.env.APP_PASS,
  },
  sendEmail: {
    email_from: process.env.EMAIL_FROM,
    brevo_pass: process.env.BREVO_PASS,
    brevo_email: process.env.BREVO_EMAIL,
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
  frontend_url: process.env.FRONTEND_URL,
  jwt_reset_password_expiresin: process.env.JWT_RESET_PASSWORD_EXPIRESIN,
};
