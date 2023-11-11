-- AlterTable
ALTER TABLE "developments" ADD COLUMN  IF NOT EXISTS   "title" TEXT NOT NULL DEFAULT '';
