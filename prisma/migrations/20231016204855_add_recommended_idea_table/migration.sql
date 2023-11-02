-- CreateTable
CREATE TABLE "RecommendedIdea" (
    "ideaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecommendedIdea_pkey" PRIMARY KEY ("ideaId")
);

-- AddForeignKey
ALTER TABLE "RecommendedIdea" ADD CONSTRAINT "RecommendedIdea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
