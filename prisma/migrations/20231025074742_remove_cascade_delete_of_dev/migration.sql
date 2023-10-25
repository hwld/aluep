-- DropForeignKey
ALTER TABLE "developments" DROP CONSTRAINT "developments_ideaId_fkey";

-- AlterTable
ALTER TABLE "developments" ALTER COLUMN "ideaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "developments" ADD CONSTRAINT "developments_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "ideas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
