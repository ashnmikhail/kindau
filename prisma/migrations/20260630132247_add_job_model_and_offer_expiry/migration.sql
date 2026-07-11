/*
  Warnings:

  - You are about to drop the column `customerId` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `RotationState` table. All the data in the column will be lost.
  - You are about to drop the column `tradieIds` on the `RotationState` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jobId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId,professionalId]` on the table `JobAssignment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId,professionalId]` on the table `JobOffer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[professionalId,categoryId,suburb]` on the table `RotationState` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Activity` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `JobOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `JobOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'PENDING';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobStatus" ADD VALUE 'MATCHING';
ALTER TYPE "JobStatus" ADD VALUE 'CONTACT_PENDING';
ALTER TYPE "JobStatus" ADD VALUE 'BOOKED';
ALTER TYPE "JobStatus" ADD VALUE 'EXPIRED';

-- AlterEnum
ALTER TYPE "OfferStatus" ADD VALUE 'TIMED_OUT';

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_customerId_fkey";

-- DropIndex
DROP INDEX "RotationState_key_key";

-- DropIndex
DROP INDEX "RotationState_professionalId_key";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "customerId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "JobOffer" ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "RotationState" DROP COLUMN "key",
DROP COLUMN "tradieIds";

-- CreateIndex
CREATE INDEX "Activity_jobId_idx" ON "Activity"("jobId");

-- CreateIndex
CREATE INDEX "Activity_createdAt_idx" ON "Activity"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_jobId_key" ON "Booking"("jobId");

-- CreateIndex
CREATE INDEX "Booking_professionalId_idx" ON "Booking"("professionalId");

-- CreateIndex
CREATE INDEX "Booking_customerId_idx" ON "Booking"("customerId");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "Booking"("status");

-- CreateIndex
CREATE INDEX "Job_userId_idx" ON "Job"("userId");

-- CreateIndex
CREATE INDEX "Job_subcategoryId_idx" ON "Job"("subcategoryId");

-- CreateIndex
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateIndex
CREATE UNIQUE INDEX "JobAssignment_jobId_professionalId_key" ON "JobAssignment"("jobId", "professionalId");

-- CreateIndex
CREATE INDEX "JobOffer_professionalId_idx" ON "JobOffer"("professionalId");

-- CreateIndex
CREATE INDEX "JobOffer_status_idx" ON "JobOffer"("status");

-- CreateIndex
CREATE INDEX "JobOffer_expiresAt_idx" ON "JobOffer"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobOffer_jobId_professionalId_key" ON "JobOffer"("jobId", "professionalId");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "RotationState_categoryId_suburb_idx" ON "RotationState"("categoryId", "suburb");

-- CreateIndex
CREATE INDEX "RotationState_professionalId_idx" ON "RotationState"("professionalId");

-- CreateIndex
CREATE UNIQUE INDEX "RotationState_professionalId_categoryId_suburb_key" ON "RotationState"("professionalId", "categoryId", "suburb");

-- CreateIndex
CREATE INDEX "ServiceArea_postcode_idx" ON "ServiceArea"("postcode");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
