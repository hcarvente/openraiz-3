-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OpportunityType" ADD VALUE 'workshop';
ALTER TYPE "OpportunityType" ADD VALUE 'event';
ALTER TYPE "OpportunityType" ADD VALUE 'resource';

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "approvalStatus" "ApprovalStatus" NOT NULL DEFAULT 'pending',
ADD COLUMN     "category" TEXT,
ADD COLUMN     "commitment" TEXT,
ADD COLUMN     "eventDate" DATE,
ADD COLUMN     "ownerUserId" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "summary" TEXT;

-- CreateIndex
CREATE INDEX "Opportunity_approvalStatus_status_idx" ON "Opportunity"("approvalStatus", "status");

-- CreateIndex
CREATE INDEX "Opportunity_ownerUserId_idx" ON "Opportunity"("ownerUserId");

