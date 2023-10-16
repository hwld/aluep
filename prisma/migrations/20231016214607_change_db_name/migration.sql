/*
  Warnings:

  - You are about to drop the `RecommendedIdea` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RecommendedIdea" DROP CONSTRAINT "RecommendedIdea_ideaId_fkey";

-- DropTable
DROP TABLE "RecommendedIdea";

-- CreateTable
CREATE TABLE "recommended_ideas" (
    "ideaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recommended_ideas_pkey" PRIMARY KEY ("ideaId")
);

-- AddForeignKey
ALTER TABLE "recommended_ideas" ADD CONSTRAINT "recommended_ideas_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
