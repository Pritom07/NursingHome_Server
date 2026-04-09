import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payLoad: Speciality) => {
  const res = await prisma.speciality.create({
    data: payLoad,
  });
  return res;
};

export const specialityService = { createSpeciality };
