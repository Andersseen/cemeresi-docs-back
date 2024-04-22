/*
  Warnings:

  - You are about to drop the column `lastName` on the `Patient` table. All the data in the column will be lost.
  - You are about to drop the column `sex` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `firstLastName` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Patient" DROP COLUMN "lastName",
DROP COLUMN "sex",
ADD COLUMN     "firstLastName" TEXT NOT NULL,
ADD COLUMN     "secondLastName" TEXT;

-- CreateTable
CREATE TABLE "Historical" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "history" TEXT NOT NULL,

    CONSTRAINT "Historical_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Historical_patientId_key" ON "Historical"("patientId");

-- AddForeignKey
ALTER TABLE "Historical" ADD CONSTRAINT "Historical_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
