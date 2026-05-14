/*eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateAdmin } from "./admin.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";

const getAllAdmins = async () => {
  const res = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
    },
  });

  return res;
};

const getAdminById = async (id: string) => {
  const res = await prisma.admin.findUnique({
    where: { id },
    include: { user: true },
  });

  return res;
};

const updateAdmin = async (id: string, payLoad: IUpdateAdmin) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: { id },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Not Found");
  }

  const { name, email, profilePhoto, ...rest } = payLoad.admin;

  await prisma.admin.update({
    where: { id },
    data: { ...payLoad.admin },
  });

  if (name) {
    await prisma.user.update({
      where: { id: isAdminExist.user_id },
      data: { name },
    });
  }

  if (email) {
    await prisma.user.update({
      where: { id: isAdminExist.user_id },
      data: { email },
    });
  }

  if (profilePhoto) {
    await prisma.user.update({
      where: { id: isAdminExist.user_id },
      data: { image: profilePhoto },
    });
  }

  const result = await getAdminById(id);

  return result;
};

const deleteAdmin = async (id: string, user: IRequestUser) => {
  const isAdminExist = await prisma.admin.findUnique({
    where: { id },
  });

  if (!isAdminExist) {
    throw new AppError(status.NOT_FOUND, "Admin Not Found");
  }

  if (isAdminExist.user_id === user.userId) {
    throw new AppError(status.CONFLICT, "You Can't Delete Yourself");
  }

  await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isAdminExist.user_id },
      data: {
        status: UserStatus.DELETED,
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.session.deleteMany({
      where: { userId: isAdminExist.user_id },
    });

    await tx.account.deleteMany({
      where: { userId: isAdminExist.user_id },
    });
  });
};

export const adminService = {
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
