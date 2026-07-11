/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Professional_stripeCustomerId_key" ON "Professional"("stripeCustomerId");
