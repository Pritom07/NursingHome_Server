import * as z from "zod";

export const updateAdminSchema = z.object({
  admin: z.object({
    name: z.string().min(2, "Name Must Be At Least 2 Characters").optional(),
    email: z.email().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().min(11).max(14).optional(),
    address: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE"]).optional(),
    deletedAt: z.date().optional(),
  }),
});
