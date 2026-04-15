/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import { Speciality, UserRole } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctor } from "./user.interface";

const createDoctor = async (payLoad: ICreateDoctor) => {
  const isExist = await prisma.user.findUnique({
    where: { email: payLoad.doctor.email },
  });

  if (isExist) {
    throw new AppError(status.CONFLICT, "Doctor already exist");
  }

  const specialities: Speciality[] = [];

  for (const speciality of payLoad.specialities) {
    const isSpecialityExist = await prisma.speciality.findUnique({
      where: { id: speciality },
    });

    if (!isSpecialityExist) {
      throw new AppError(
        status.NOT_FOUND,
        `Speciality Not Found For Id : ${speciality}`,
      );
    }
    specialities.push(isSpecialityExist);
  }

  const createUser = await auth.api.signUpEmail({
    body: {
      name: payLoad.doctor.name,
      email: payLoad.doctor.email,
      password: payLoad.password,
      role: UserRole.DOCTOR,
      needPasswordChange: true,
    },
  });

  if (!createUser.user) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "Registration failed");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          user_id: createUser.user.id,
          name: payLoad.doctor.name,
          email: payLoad.doctor.email,
          profilePhoto: payLoad.doctor.profilePhoto ?? null,
          contactNumber: payLoad.doctor.contactNumber,
          address: payLoad.doctor.address ?? null,
          registrationNumber: payLoad.doctor.registrationNumber,
          experience: payLoad.doctor.experience ?? null,
          appointmentFee: payLoad.doctor.appointmentFee,
          gender: payLoad.doctor.gender,
          qualification: payLoad.doctor.qualification,
          designation: payLoad.doctor.designation ?? null,
          currentWorkingPlace: payLoad.doctor.currentWorkingPlace ?? null,
          deletedAt: payLoad.doctor.deletedAt ?? null,
        },
      });

      const doctorSpecialityData = specialities.map((speciality) => {
        return {
          doctor_id: doctorData.id,
          speciality_id: speciality.id,
        };
      });

      await tx.doctorSpeciality.createMany({
        data: doctorSpecialityData,
      });

      const res = await tx.doctor.findUnique({
        where: { id: doctorData.id },
        include: {
          user: {
            select: {
              id: true,
              emailVerified: true,
              role: true,
              status: true,
              needPasswordChange: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialities: {
            select: {
              speciality: true,
            },
          },
        },
      });

      return res;
    });

    return result;
  } catch (err: any) {
    await prisma.user.delete({
      where: { id: createUser.user.id },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Doctor Registration Failed",
    );
  }
};

export const userService = { createDoctor };
