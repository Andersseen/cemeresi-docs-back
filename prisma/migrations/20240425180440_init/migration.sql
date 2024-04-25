-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "firstLastName" TEXT NOT NULL,
    "secondLastName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "birthday" TEXT,
    "notes" TEXT,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

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
