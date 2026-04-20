DROP INDEX "AppSettings_user_key";
DROP INDEX "Bookmark_user_bookSlug_chapter_key";
DROP INDEX "ChapterNote_user_bookSlug_chapter_key";
DROP INDEX "ReadingProgress_user_bookSlug_chapter_key";

CREATE TYPE "AppUser_new" AS ENUM ('CELINE');

ALTER TABLE "AppSettings"
  ALTER COLUMN "user" DROP DEFAULT,
  ALTER COLUMN "user" TYPE "AppUser_new"
  USING ('CELINE'::"AppUser_new");

ALTER TABLE "ChapterNote"
  ALTER COLUMN "user" DROP DEFAULT,
  ALTER COLUMN "user" TYPE "AppUser_new"
  USING ('CELINE'::"AppUser_new");

ALTER TABLE "ReadingProgress"
  ALTER COLUMN "user" DROP DEFAULT,
  ALTER COLUMN "user" TYPE "AppUser_new"
  USING ('CELINE'::"AppUser_new");

ALTER TABLE "Bookmark"
  ALTER COLUMN "user" DROP DEFAULT,
  ALTER COLUMN "user" TYPE "AppUser_new"
  USING ('CELINE'::"AppUser_new");

ALTER TABLE "PrayerJournalEntry"
  ALTER COLUMN "user" DROP DEFAULT,
  ALTER COLUMN "user" TYPE "AppUser_new"
  USING ('CELINE'::"AppUser_new");

WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC) AS row_number
  FROM "AppSettings"
)
DELETE FROM "AppSettings"
WHERE "id" IN (
  SELECT "id"
  FROM ranked
  WHERE row_number > 1
);

WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "bookSlug", "chapter" ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC) AS row_number
  FROM "ChapterNote"
)
DELETE FROM "ChapterNote"
WHERE "id" IN (
  SELECT "id"
  FROM ranked
  WHERE row_number > 1
);

WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "bookSlug", "chapter" ORDER BY "lastReadAt" DESC, "completedAt" DESC, "id" DESC) AS row_number
  FROM "ReadingProgress"
)
DELETE FROM "ReadingProgress"
WHERE "id" IN (
  SELECT "id"
  FROM ranked
  WHERE row_number > 1
);

WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "bookSlug", "chapter" ORDER BY "updatedAt" DESC, "createdAt" DESC, "id" DESC) AS row_number
  FROM "Bookmark"
)
DELETE FROM "Bookmark"
WHERE "id" IN (
  SELECT "id"
  FROM ranked
  WHERE row_number > 1
);

DROP TYPE "AppUser";

ALTER TYPE "AppUser_new" RENAME TO "AppUser";

ALTER TABLE "AppSettings"
  ALTER COLUMN "user" SET DEFAULT 'CELINE';

ALTER TABLE "ChapterNote"
  ALTER COLUMN "user" SET DEFAULT 'CELINE';

ALTER TABLE "ReadingProgress"
  ALTER COLUMN "user" SET DEFAULT 'CELINE';

ALTER TABLE "Bookmark"
  ALTER COLUMN "user" SET DEFAULT 'CELINE';

ALTER TABLE "PrayerJournalEntry"
  ALTER COLUMN "user" SET DEFAULT 'CELINE';

CREATE UNIQUE INDEX "AppSettings_user_key" ON "AppSettings"("user");
CREATE UNIQUE INDEX "Bookmark_user_bookSlug_chapter_key" ON "Bookmark"("user", "bookSlug", "chapter");
CREATE UNIQUE INDEX "ChapterNote_user_bookSlug_chapter_key" ON "ChapterNote"("user", "bookSlug", "chapter");
CREATE UNIQUE INDEX "ReadingProgress_user_bookSlug_chapter_key" ON "ReadingProgress"("user", "bookSlug", "chapter");