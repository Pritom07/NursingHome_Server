import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { UserRole, UserStatus } from "../../generated/prisma/enums";
import { bearer, emailOTP } from "better-auth/plugins";
import sendEmail from "../utils/email";
import { config } from "../config";
import AppError from "../errorHelpers/AppError";
import status from "http-status";

export const auth = betterAuth({
  baseURL: config.BETTER_AUTH_URL,
  secret: config.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [
    config.BETTER_AUTH_URL || "http://localhost:5000",
    "http://localhost:3000",
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 60 /**60 days */,
    updateAge: 60 * 60 * 24 * 60 /**60 days */,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 60 /**60 days */,
    },
  },

  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const isUserExist = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!isUserExist) {
            console.log(
              `User with email : ${email} is not found. can't send otp`,
            );
            return;
          }

          if (isUserExist && isUserExist.role === UserRole.SUPER_ADMIN) {
            console.log(
              `User with email : ${email} is a super_admin. Skipping sending verification otp`,
            );
            return;
          }

          if (isUserExist && !isUserExist.emailVerified) {
            sendEmail({
              to: email,
              subject: "Email Verification OTP",
              templateName: "otp",
              templateData: {
                name: isUserExist.name,
                otp,
              },
            });
          }
        } else if (type === "forget-password") {
          const isUserExist = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!isUserExist) {
            throw new AppError(status.NOT_FOUND, "User_Not_Found");
          }

          sendEmail({
            to: email,
            subject: "Password Reset OTP",
            templateName: "passwordResetOtp",
            templateData: {
              name: isUserExist.name,
              otp,
            },
          });
        }
      },
      expiresIn: 60 * 2 /**2 min */,
      otpLength: 6,
    }),
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.PATIENT,
      },
      status: {
        type: "string",
        required: true,
        defaultValue: UserStatus.ACTIVE,
      },
      needPasswordChange: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDeleted: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      deletedAt: {
        type: "date",
        required: false,
        defaultValue: null,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignIn: true,
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },

  advanced: {
    useSecureCookies: false,
    cookies: {
      state: {
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        },
      },
      sessionToken: {
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
        },
      },
    },
  },
});
