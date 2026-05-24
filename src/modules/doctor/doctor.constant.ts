import { Prisma } from "../../../generated/prisma/client";

export const doctorSearchableFields: string[] = [
  "name",
  "email",
  "registrationNumber",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "specialities.speciality.title",
];

export const doctorFilterableFields: string[] = [
  "registrationNumber",
  "experience",
  "gender",
  "appointmentFee",
  "currentWorkingPlace",
  "designation",
  "qualification",
  "isDeleted",
  "specialities.speciality_id",
  "user.role",
];

export const doctorIncludeConfig: Partial<
  Record<
    keyof Prisma.DoctorInclude,
    Prisma.DoctorInclude[keyof Prisma.DoctorInclude]
  >
> = {
  user: true,
  specialities: {
    include: {
      speciality: true,
    },
  },
  doctorSchedules: {
    include: {
      schedule: true,
    },
  },
  appointments: {
    include: {
      doctor: true,
      patient: true,
    },
  },
  prescriptions: true,
  reviews: true,
};
