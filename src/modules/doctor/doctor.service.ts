/* eslint-disable @typescript-eslint/no-unused-vars */
import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctor } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { queryBuilder } from "../../utils/queryBuilder";
import { Doctor, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interfaces/queryBuilder.interface";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";

const getAllDoctors = async (query: IQueryParams) => {
  const doctorModel = {
    count: prisma.doctor.count.bind(prisma.doctor),
    findmany: prisma.doctor.findMany.bind(prisma.doctor),
  };

  const queryBuilderInstance = new queryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(doctorModel, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });

  const result = await queryBuilderInstance
    .search()
    .filter()
    .paginate()
    .sort()
    .fields()
    .include({
      user: true,
      specialities: {
        include: {
          speciality: true,
        },
      },
    })
    .dynamicInclude(doctorIncludeConfig, [])
    .where({
      isDeleted: false,
    })
    .execute();

  return result;
};

const getDoctorById = async (id: string) => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      specialities: {
        select: {
          id: true,
          speciality_id: true,
          speciality: {
            select: {
              title: true,
            },
          },
        },
      },
      doctorSchedules: {
        select: {
          id: true,
          schedule_id: true,
          schedule: {
            select: {
              startDateTime: true,
              endDateTime: true,
            },
          },
          isBooked: true,
        },
      },
      appointments: {
        select: {
          id: true,
          patient_id: true,
          patient: {
            select: {
              name: true,
              email: true,
            },
          },
          schedule_id: true,
          schedule: {
            select: {
              startDateTime: true,
              endDateTime: true,
            },
          },
          videoCallingId: true,
          status: true,
          paymentStatus: true,
        },
      },
      prescriptions: {
        select: {
          appointment_id: true,
          patient_id: true,
          patient: {
            select: {
              name: true,
              email: true,
            },
          },
          instructions: true,
          followUpDate: true,
        },
      },
      reviews: {
        select: {
          id: true,
          patient_id: true,
          patient: {
            select: {
              name: true,
              email: true,
            },
          },
          comment: true,
          ratings: true,
        },
      },
    },
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Doctor_Not_Found");
  }

  return result;
};

const updateDoctor = async (id: string, payLoad: IUpdateDoctor) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor Not Found");
  }

  const { doctor, specialities } = payLoad;

  await prisma.$transaction(async (tx) => {
    if (doctor) {
      await tx.doctor.update({
        where: { id },
        data: { ...doctor },
      });
    }
    const { name, email, profilePhoto, ...rest } = doctor;

    if (name) {
      await tx.user.update({
        where: {
          id: isDoctorExist.user_id,
        },
        data: {
          name,
        },
      });
    }

    if (email) {
      await tx.user.update({
        where: {
          id: isDoctorExist.user_id,
        },
        data: {
          email,
        },
      });
    }

    if (profilePhoto) {
      await tx.user.update({
        where: {
          id: isDoctorExist.user_id,
        },
        data: {
          image: profilePhoto,
        },
      });
    }

    if (specialities && specialities.length > 0) {
      for (const speciality of specialities) {
        const { speciality_id, shouldDelete } = speciality;

        if (shouldDelete) {
          await tx.doctorSpeciality.delete({
            where: {
              doctor_id_speciality_id: {
                doctor_id: id,
                speciality_id: speciality_id,
              },
            },
          });
        } else {
          await tx.doctorSpeciality.create({
            data: {
              doctor_id: id,
              speciality_id: speciality_id,
            },
          });
        }
      }
    }
  });

  const result = await getDoctorById(id);

  return result;
};

const deleteDoctor = async (id: string) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor Not Found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: { id: isDoctorExist.user_id },
      data: {
        status: UserStatus.DELETED,
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.doctorSpeciality.deleteMany({
      where: {
        doctor_id: id,
      },
    });

    await tx.doctorSchedule.deleteMany({
      where: { doctor_id: id },
    });

    await tx.session.deleteMany({
      where: { userId: isDoctorExist.user_id },
    });
  });
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
