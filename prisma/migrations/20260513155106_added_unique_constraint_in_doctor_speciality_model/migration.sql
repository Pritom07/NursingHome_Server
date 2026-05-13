/*
  Warnings:

  - A unique constraint covering the columns `[doctor_id,speciality_id]` on the table `doctorSpeciality` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "doctorSpeciality_doctor_id_speciality_id_key" ON "doctorSpeciality"("doctor_id", "speciality_id");
