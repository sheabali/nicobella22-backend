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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, resetPassLink, confirmLink) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: config_1.default.sendEmail.brevo_email,
            pass: config_1.default.sendEmail.brevo_pass,
        },
    });
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date());
    const clickableLink = `<a href="${confirmLink}" style="color: #121849; text-decoration: underline;">here</a>`;
    const clickableResetPass = `<a href="${resetPassLink}" style="color: #121849; text-decoration: underline;">here</a>`;
    const html = `
  <div style="max-width: 600px; margin: 0 auto; background-color: #f3f4fa; color: #333; border-radius: 8px; padding: 24px;">
    <table style="width: 100%;">
      <tr>
        <td>
          <img src="https://res.cloudinary.com/shariful10/image/upload/v1747038762/gqvxrllknqvh4tolaxld.png" alt="logo" style="height: 40px; margin-bottom: 16px;" />
        </td>
        <td style="text-align: right; color: #999;">${formattedDate}</td>
      </tr>
    </table>

    
    ${confirmLink
        ? `<h2 style="text-align: center; color: #122e5b;">Active Your Account.</h2>
        <div style="padding: 0 1em;">
      <p style="text-align: left; line-height: 28px; color: #000;">
          <strong style="color: #121849;">Activation Link:</strong> Click ${clickableLink} to active your account.
        </p>
    </div>`
        : `<h2 style="text-align: center; color: #122e5b;">Reset Your Password Within 5 
        Minutes.</h2>
        <div style="padding: 0 1em;">
      <p style="text-align: left; line-height: 28px; color: #000;">
          <strong style="color: #121849;">Reset Link:</strong> Click ${clickableResetPass} to reset your password.
        </p>
    </div>`}
  </div>
  `;
    yield transporter.sendMail({
        from: `"Support Team" <${config_1.default.sendEmail.email_from}>`,
        to,
        subject: `${resetPassLink ? "Reset Your Password" : "Active Your Account"}`,
        text: "Hello world?",
        html: html,
    });
});
exports.sendEmail = sendEmail;
