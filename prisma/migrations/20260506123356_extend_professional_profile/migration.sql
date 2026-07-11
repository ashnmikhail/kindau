-- AlterTable
ALTER TABLE "Professional" ADD COLUMN     "abn" TEXT,
ADD COLUMN     "businessName" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "profileImage" TEXT;
