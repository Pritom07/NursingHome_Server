-- CreateTable
CREATE TABLE "medicalReport" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicalReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicalReport_id_idx" ON "medicalReport"("id");

-- CreateIndex
CREATE INDEX "medicalReport_patient_id_idx" ON "medicalReport"("patient_id");

-- AddForeignKey
ALTER TABLE "medicalReport" ADD CONSTRAINT "medicalReport_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
