import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payLoad: Speciality) => {
  const res = await prisma.speciality.create({
    data: payLoad,
  });

  return res;
};

const getAllSpecialities = async () => {
  const res = await prisma.speciality.findMany();
  return res;
};

const deleteSpeciality = async (id: string) => {
  const res = await prisma.speciality.delete({
    where: { id },
  });

  return res;
};

const updateSpeciality = async (id: string, payLoad: Speciality) => {
  const res = await prisma.speciality.update({
    where: { id },
    data: payLoad,
  });

  return res;
};

export const specialityService = {
  createSpeciality,
  getAllSpecialities,
  deleteSpeciality,
  updateSpeciality,
};
