-- CreateEnum
CREATE TYPE "TranslationStatus" AS ENUM ('none', 'ai_draft', 'approved');

-- AlterEnum
ALTER TYPE "ApplyMethodType" ADD VALUE 'platform';

-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "descriptionTr" TEXT,
ADD COLUMN     "originalLang" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "requirementsTr" TEXT,
ADD COLUMN     "summaryTr" TEXT,
ADD COLUMN     "titleTr" TEXT,
ADD COLUMN     "translationStatus" "TranslationStatus" NOT NULL DEFAULT 'none';

