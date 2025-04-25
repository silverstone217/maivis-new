-- CreateTable
CREATE TABLE "PersonnelInfo" (
    "id" TEXT NOT NULL,
    "personnelId" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "avenue" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "province" TEXT NOT NULL DEFAULT 'kinshasa',
    "codePostal" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'congo-kinshasa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonnelInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonnelInfo_personnelId_key" ON "PersonnelInfo"("personnelId");

-- AddForeignKey
ALTER TABLE "PersonnelInfo" ADD CONSTRAINT "PersonnelInfo_personnelId_fkey" FOREIGN KEY ("personnelId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
