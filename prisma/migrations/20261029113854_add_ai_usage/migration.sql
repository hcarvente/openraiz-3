-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "route" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiUsage_day_route_key" ON "AiUsage"("day", "route");

