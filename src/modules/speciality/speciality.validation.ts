import * as z from "zod";

export const createSpecialitySchema = z.object({
  title: z.string("Speciality Title Required"),
  description: z.string().optional(),
});
