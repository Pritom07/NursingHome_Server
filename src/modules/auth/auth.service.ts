/*eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { IRegisterPatient, ISignIn } from "./auth.interface";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { config } from "../../config";
import { JWTPayload } from "better-auth";

const registerPatient = async (payLoad: IRegisterPatient) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payLoad.email },
  });

  if (isExist) {
    throw new AppError(
      status.CONFLICT,
      "User already exists. Use another email",
    );
  }

  const createUser = await auth.api.signUpEmail({
    body: payLoad,
  });

  if (!createUser.user) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Registration Failed");
  }

  try {
    const res = await prisma.$transaction(async (tx) => {
      const patientData = await tx.patient.create({
        data: {
          user_id: createUser.user.id,
          name: createUser.user.name,
          email: createUser.user.email,
        },
      });

      const result = await tx.patient.findUnique({
        where: { id: patientData.id },
      });

      const accessToken = tokenUtils.getAccessToken({
        userId: createUser.user.id,
        name: createUser.user.name,
        email: createUser.user.email,
        emailVerified: createUser.user.emailVerified,
        role: createUser.user.role,
        status: createUser.user.status,
        isDeleted: createUser.user.isDeleted,
      });

      const refreshToken = tokenUtils.getRefreshToken({
        userId: createUser.user.id,
        name: createUser.user.name,
        email: createUser.user.email,
        emailVerified: createUser.user.emailVerified,
        role: createUser.user.role,
        status: createUser.user.status,
        isDeleted: createUser.user.isDeleted,
      });

      return { accessToken, refreshToken, ...result, ...createUser };
    });

    return res;
  } catch (err: any) {
    await prisma.user.delete({
      where: {
        email: createUser.user.email,
      },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Patient Registration Failed",
    );
  }
};

const signIn = async (payLoad: ISignIn) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payLoad.email },
  });

  if (!isExist) {
    throw new AppError(status.NOT_FOUND, "User Not Found");
  }

  if (isExist && isExist.status === UserStatus.BLOCK) {
    throw new AppError(status.FORBIDDEN, "User is BLOCKED");
  }

  if (
    isExist &&
    (isExist.isDeleted === true || isExist.status === UserStatus.DELETED)
  ) {
    throw new AppError(status.GONE, "User is DELETED");
  }

  const res = await auth.api.signInEmail({
    body: payLoad,
  });

  const accessToken = tokenUtils.getAccessToken({
    userId: res.user.id,
    name: res.user.name,
    email: res.user.email,
    emailVerified: res.user.emailVerified,
    role: res.user.role,
    status: res.user.status,
    isDeleted: res.user.isDeleted,
  });

  const refreshToken = tokenUtils.getRefreshToken({
    userId: res.user.id,
    name: res.user.name,
    email: res.user.email,
    emailVerified: res.user.emailVerified,
    role: res.user.role,
    status: res.user.status,
    isDeleted: res.user.isDeleted,
  });

  return { accessToken, refreshToken, ...res };
};

const getMe = async (payLoad: IRequestUser) => {
  const res = await prisma.user.findUnique({
    where: {
      id: payLoad.userId,
    },
    include: {
      doctor: {
        include: {
          appointments: true,
          prescriptions: true,
          reviews: true,
          specialities: true,
        },
      },
      patient: {
        include: {
          appointments: true,
          prescriptions: true,
          reviews: true,
          patientHealthData: true,
          medicalReports: true,
        },
      },
      admin: true,
    },
  });

  return res;
};

const getNewTokens = async (refreshToken: string, sessionToken: string) => {
  const isUserexist = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!isUserexist) {
    throw new AppError(status.NOT_FOUND, "User_Not_Found");
  }

  const verifyToken = jwtUtils.verifyToken(
    refreshToken,
    config.REFRESH_TOKEN_SECRET,
  ) as JWTPayload;

  if (!verifyToken) {
    throw new AppError(status.UNAUTHORIZED, "Unauthorized_Access");
  }

  const newAccessToken = tokenUtils.getAccessToken({
    userId: verifyToken.userId,
    name: verifyToken.name,
    email: verifyToken.email,
    emailVerified: verifyToken.emailVerified,
    role: verifyToken.role,
    status: verifyToken.status,
    isDeleted: verifyToken.isDeleted,
  });

  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: verifyToken.userId,
    name: verifyToken.name,
    email: verifyToken.email,
    emailVerified: verifyToken.emailVerified,
    role: verifyToken.role,
    status: verifyToken.status,
    isDeleted: verifyToken.isDeleted,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 60 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    token,
  };
};

export const authService = { registerPatient, signIn, getMe, getNewTokens };
