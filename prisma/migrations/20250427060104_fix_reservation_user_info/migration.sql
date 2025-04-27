/*
  Warnings:

  - You are about to drop the `UserInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_clientInfo_fkey";

-- DropForeignKey
ALTER TABLE "UserInfo" DROP CONSTRAINT "UserInfo_userId_fkey";

-- DropTable
DROP TABLE "UserInfo";

-- CreateTable
CREATE TABLE "BookingUserInfo" (
    "id" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avenue" TEXT NOT NULL,
    "commune" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "province" TEXT NOT NULL DEFAULT 'kinshasa',
    "codePostal" TEXT,
    "pays" TEXT NOT NULL DEFAULT 'congo-kinshasa',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "subscriptionId" TEXT NOT NULL,

    CONSTRAINT "BookingUserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookingUserInfo_subscriptionId_key" ON "BookingUserInfo"("subscriptionId");

-- AddForeignKey
ALTER TABLE "BookingUserInfo" ADD CONSTRAINT "BookingUserInfo_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
