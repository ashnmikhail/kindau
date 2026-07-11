-- CreateTable
CREATE TABLE "ProfessionalPricing" (
    "id" TEXT NOT NULL,
    "professionalId" TEXT NOT NULL,
    "hourlyRate" DOUBLE PRECISION,
    "calloutFee" DOUBLE PRECISION,
    "minCharge" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "ProfessionalPricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalPricing_professionalId_key" ON "ProfessionalPricing"("professionalId");

-- AddForeignKey
ALTER TABLE "ProfessionalPricing" ADD CONSTRAINT "ProfessionalPricing_professionalId_fkey" FOREIGN KEY ("professionalId") REFERENCES "Professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
