import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (
  to: string,
  resetPassLink?: string,
  confirmLink?: string
) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV === "production",
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.app_pass,
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

    
    ${
      confirmLink
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
    </div>`
    }
  </div>
  `;

  await transporter.sendMail({
    from: `"Sk Shariful Islam" <${config.emailSender.email}>`,
    to,
    subject: `${resetPassLink ? "Reset Your Password" : "Active Your Account"}`,
    text: "Hello world?",
    html: html,
  });
};
