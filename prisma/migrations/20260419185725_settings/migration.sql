-- CreateEnum
CREATE TYPE "ReadingTheme" AS ENUM ('LIGHT', 'DARK', 'WARM');

-- CreateEnum
CREATE TYPE "PreferredLandingPage" AS ENUM ('DASHBOARD', 'DEVOTION', 'BIBLE', 'JOURNAL', 'PROGRESS');

-- CreateEnum
CREATE TYPE "DevotionPlan" AS ENUM ('FOUNDATIONS', 'GOSPELS_AND_PSALMS', 'WHOLE_BIBLE_YEAR');

-- CreateEnum
CREATE TYPE "JournalEntryType" AS ENUM ('PRAYER_REQUEST', 'GRATITUDE', 'ANSWERED_PRAYER', 'REFLECTION');

-- CreateTable
CREATE TABLE "AppSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "readingTheme" "ReadingTheme" NOT NULL DEFAULT 'WARM',
    "fontScale" INTEGER NOT NULL DEFAULT 100,
    "ambienceEnabled" BOOLEAN NOT NULL DEFAULT false,
    "preferredLandingPage" "PreferredLandingPage" NOT NULL DEFAULT 'DASHBOARD',
    "dailyDevotionPlan" "DevotionPlan" NOT NULL DEFAULT 'FOUNDATIONS',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChapterNote" (
    "id" TEXT NOT NULL,
    "bookSlug" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingProgress" (
    "id" TEXT NOT NULL,
    "bookSlug" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "bookSlug" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrayerJournalEntry" (
    "id" TEXT NOT NULL,
    "type" "JournalEntryType" NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrayerJournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChapterNote_updatedAt_idx" ON "ChapterNote"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ChapterNote_bookSlug_chapter_key" ON "ChapterNote"("bookSlug", "chapter");

-- CreateIndex
CREATE INDEX "ReadingProgress_lastReadAt_idx" ON "ReadingProgress"("lastReadAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProgress_bookSlug_chapter_key" ON "ReadingProgress"("bookSlug", "chapter");

-- CreateIndex
CREATE INDEX "Bookmark_updatedAt_idx" ON "Bookmark"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_bookSlug_chapter_key" ON "Bookmark"("bookSlug", "chapter");

-- CreateIndex
CREATE INDEX "PrayerJournalEntry_entryDate_idx" ON "PrayerJournalEntry"("entryDate");
