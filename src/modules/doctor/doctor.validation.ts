import * as z from "zod";

export const updateDoctorSchema = z.object({
  doctor: z
    .object({
      name: z
        .string()
        .min(8, "Password Must Be At Least 8 Characters")
        .optional(),
      email: z.email().optional(),
      profilePhoto: z.string().optional(),
      contactNumber: z
        .string()
        .min(11, "Contact Number At Least  11 Characters")
        .max(14, "Contact Number At Most  14 Characters")
        .optional(),
      address: z.string().optional(),
      registrationNumber: z.string().optional(),
      experience: z.int().nonnegative().optional(),
      gender: z.enum(["MALE", "FEMALE"]).optional(),
      appointmentFee: z.number().positive().optional(),
      currentWorkingPlace: z.string().optional(),
      qualification: z.string().optional(),
      designation: z.string().optional(),
      deletedAt: z.date().optional(),
    })
    .optional(),
  specialities: z
    .array(
      z.object({
        speciality_id: z.uuid(),
        shouldDelete: z.boolean(),
      }),
    )
    .optional(),
});
