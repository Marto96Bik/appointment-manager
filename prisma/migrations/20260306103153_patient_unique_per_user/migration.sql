/*
  Warnings:

  - A unique constraint covering the columns `[userId,documentId]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Patient_documentId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Patient_userId_documentId_key" ON "Patient"("userId", "documentId");
