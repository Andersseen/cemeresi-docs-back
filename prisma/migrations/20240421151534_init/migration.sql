/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Client";

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "sex" TEXT,
    "birthday" TEXT,
    "email" TEXT,
    "registration" TEXT,
    "notes" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);
