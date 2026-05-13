import { Gender } from "../../../generated/prisma/enums";

interface IDoctorSpecialities {
  speciality_id: string;
  shouldDelete: boolean;
}

export interface IUpdateDoctor {
  doctor: {
    name?: string;
    email?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber?: string;
    experience?: number;
    gender?: Gender;
    appointmentFee?: number;
    currentWorkingPlace?: string;
    qualification?: string;
    designation?: string;
    deletedAt?: Date;
  };
  specialities?: IDoctorSpecialities[];
}
