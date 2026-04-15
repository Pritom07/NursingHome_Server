import * as z from "zod";

export const createDoctorSchema = z.object({
  password: z
    .string("Password Required")
    .min(8, "Password must be at least 8 characters"),
  doctor: z.object({
    name: z.string(),
    email: z.email(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().min(13).max(15),
    address: z.string().optional(),
    registrationNumber: z.string("Registration Number Required"),
    experience: z.int().nonnegative().optional(),
    appointmentFee: z.number().positive(),
    gender: z.enum(["MALE", "FEMALE"], "Gender Required"),
    qualification: z.string(),
    designation: z.string().optional(),
    currentWorkingPlace: z.string().optional(),
    deletedAt: z.date().optional(),
  }),
  specialities: z.array(z.string()),
});
