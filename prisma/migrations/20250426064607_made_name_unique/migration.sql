/*
  Warnings:

  - A unique constraint covering the columns `[service]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_service_key" ON "Service"("service");
