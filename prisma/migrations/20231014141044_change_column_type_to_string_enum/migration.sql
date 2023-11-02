/*
  Warnings:

  - You are about to drop the column `statusId` on the `developments` table. All the data in the column will be lost.
  - You are about to drop the `development_statuses` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "DevelopmentStatus" AS ENUM ('IN_PROGRESS', 'ABORTED', 'COMPLETED');


-- DropForeignKey
ALTER TABLE "developments" DROP CONSTRAINT "developments_statusId_fkey";

-- status列を追加
ALTER TABLE "developments" ADD COLUMN "status" "DevelopmentStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- statusIdをstatusに変換
UPDATE "developments"
SET "status" =  CASE
                WHEN "statusId" = '1' THEN 'IN_PROGRESS'::"DevelopmentStatus"
                WHEN "statusId" = '2' THEN 'ABORTED'::"DevelopmentStatus"
                ELSE 'COMPLETED'::"DevelopmentStatus"
              END;
-- AlterTable
ALTER TABLE "developments" DROP COLUMN "statusId";

-- DropTable
DROP TABLE "development_statuses";
