-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('ONGOING', 'ANSWERED');

-- AlterTable
ALTER TABLE "PrayerJournalEntry" ADD COLUMN     "answeredDate" TIMESTAMP(3),
ADD COLUMN     "prayerStatus" "PrayerStatus",
ADD COLUMN     "reminderDate" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "PrayerJournalEntry_prayerStatus_idx" ON "PrayerJournalEntry"("prayerStatus");

-- CreateIndex
CREATE INDEX "PrayerJournalEntry_reminderDate_idx" ON "PrayerJournalEntry"("reminderDate");
