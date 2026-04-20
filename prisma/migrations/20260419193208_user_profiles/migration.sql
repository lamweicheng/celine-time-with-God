/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `AppSettings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user,bookSlug,chapter]` on the table `Bookmark` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user,bookSlug,chapter]` on the table `ChapterNote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user,bookSlug,chapter]` on the table `ReadingProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "AppUser" AS ENUM ('ANDY', 'KELLY');

-- DropIndex
DROP INDEX "Bookmark_bookSlug_chapter_key";

-- DropIndex
DROP INDEX "Bookmark_updatedAt_idx";

-- DropIndex
DROP INDEX "ChapterNote_bookSlug_chapter_key";

-- DropIndex
DROP INDEX "ChapterNote_updatedAt_idx";

-- DropIndex
DROP INDEX "PrayerJournalEntry_entryDate_idx";

-- DropIndex
DROP INDEX "PrayerJournalEntry_prayerStatus_idx";

-- DropIndex
DROP INDEX "PrayerJournalEntry_reminderDate_idx";

-- DropIndex
DROP INDEX "ReadingProgress_bookSlug_chapter_key";

-- DropIndex
DROP INDEX "ReadingProgress_lastReadAt_idx";

-- AlterTable
ALTER TABLE "AppSettings" ADD COLUMN     "ambienceYoutubeUrl" TEXT NOT NULL DEFAULT 'https://www.youtube.com/watch?v=4U1xfZjvFTo&t=1384s',
ADD COLUMN     "user" "AppUser" NOT NULL DEFAULT 'ANDY',
ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Bookmark" ADD COLUMN     "user" "AppUser" NOT NULL DEFAULT 'ANDY';

-- AlterTable
ALTER TABLE "ChapterNote" ADD COLUMN     "user" "AppUser" NOT NULL DEFAULT 'ANDY';

-- AlterTable
ALTER TABLE "PrayerJournalEntry" ADD COLUMN     "user" "AppUser" NOT NULL DEFAULT 'ANDY';

-- AlterTable
ALTER TABLE "ReadingProgress" ADD COLUMN     "user" "AppUser" NOT NULL DEFAULT 'ANDY';

-- CreateIndex
CREATE UNIQUE INDEX "AppSettings_user_key" ON "AppSettings"("user");

-- CreateIndex
CREATE INDEX "Bookmark_user_updatedAt_idx" ON "Bookmark"("user", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_bookSlug_chapter_key" ON "Bookmark"("user", "bookSlug", "chapter");

-- CreateIndex
CREATE INDEX "ChapterNote_user_updatedAt_idx" ON "ChapterNote"("user", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterNote_user_bookSlug_chapter_key" ON "ChapterNote"("user", "bookSlug", "chapter");

-- CreateIndex
CREATE INDEX "PrayerJournalEntry_user_entryDate_idx" ON "PrayerJournalEntry"("user", "entryDate");

-- CreateIndex
CREATE INDEX "PrayerJournalEntry_user_prayerStatus_idx" ON "PrayerJournalEntry"("user", "prayerStatus");

-- CreateIndex
CREATE INDEX "PrayerJournalEntry_user_reminderDate_idx" ON "PrayerJournalEntry"("user", "reminderDate");

-- CreateIndex
CREATE INDEX "ReadingProgress_user_lastReadAt_idx" ON "ReadingProgress"("user", "lastReadAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProgress_user_bookSlug_chapter_key" ON "ReadingProgress"("user", "bookSlug", "chapter");
