import nodemailer from "nodemailer";
import { config } from "../config";
import { ISendEmail } from "../interfaces/sendEmail.interface";
import path from "path";
import AppError from "../errorHelpers/AppError";
import ejs from "ejs";
import status from "http-status";

const transporter = nodemailer.createTransport({
  host: config.EMAIL_SENDER_SMTP_HOST,
  port: Number(config.EMAIL_SENDER_SMTP_PORT),
  secure: true,
  auth: {
    user: config.EMAIL_SENDER_SMTP_USER,
    pass: config.EMAIL_SENDER_SMTP_PASS,
  },
});

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmail) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/templates/${templateName}.ejs`,
    );
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: config.EMAIL_SENDER_SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log(`Email sent to ${to} : ${info.messageId}`);
  } catch (err: any) {
    console.log(err.message);
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed_To_Send_Email");
  }
};

export default sendEmail;
