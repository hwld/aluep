/*
  Warnings:

  - You are about to drop the column `memo` on the `development_memos` table. All the data in the column will be lost.
  - You are about to drop the column `comment` on the `idea_comments` table. All the data in the column will be lost.
  - Added the required column `text` to the `development_memos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `idea_comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "development_memos" DROP COLUMN "memo",
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "idea_comments" DROP COLUMN "comment",
ADD COLUMN     "text" TEXT NOT NULL;
