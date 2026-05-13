import * as z from "zod";

export const createDoctorSchema = z.object({
  password: z
    .string("Password Required")
    .min(8, "Password Must Be At Least 8 Characters"),
  doctor: z.object({
    name: z.string("Name Required").min(2, "Name Must be Atleast 2 Characters"),
    email: z.email(),
    profilePhoto: z.string().optional(),
    contactNumber: z
      .string()
      .min(11, "Contact Number At Least  11 Characters")
      .max(14, "Contact Number At Most  14 Characters"),
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

export const createAdminSchema = z.object({
  password: z
    .string("Password Required")
    .min(8, "Password Must Be At Least 8 Characters"),
  admin: z.object({
    name: z.string("Name Required").min(2, "Name Must be Atleast 2 Characters"),
    email: z.email(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().min(11).max(14).optional(),
    address: z.string(),
    gender: z.enum(["MALE", "FEMALE"], "Gender Required"),
    deletedAt: z.date().optional(),
  }),
  role: z.enum(["ADMIN", "SUPER_ADMIN"], "Role Must Be Required"),
});
