-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('scam_or_payment', 'unsafe', 'misleading', 'discriminatory', 'spam', 'other');

-- CreateTable
CREATE TABLE "ListingReport" (
    "id" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "reporterUserId" TEXT NOT NULL,
    "reporterName" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "ListingReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingReport_opportunityId_createdAt_idx" ON "ListingReport"("opportunityId", "createdAt");

-- CreateIndex
CREATE INDEX "ListingReport_reporterUserId_createdAt_idx" ON "ListingReport"("reporterUserId", "createdAt");

-- CreateIndex
CREATE INDEX "ListingReport_resolvedAt_idx" ON "ListingReport"("resolvedAt");

-- AddForeignKey
ALTER TABLE "ListingReport" ADD CONSTRAINT "ListingReport_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

