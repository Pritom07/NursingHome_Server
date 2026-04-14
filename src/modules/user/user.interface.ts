import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctor {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    appointmentFee: number;
    gender: Gender;
    qualification: string;
    designation?: string;
    currentWorkingPlace?: string;
    deletedAt?: Date;
  };
  specialities: string[];
}
