-- CreateEnum
CREATE TYPE "ScriptureDisplayMode" AS ENUM ('ESV', 'CUVS', 'BOTH');

-- AlterTable
ALTER TABLE "AppSettings" ADD COLUMN     "scriptureDisplayMode" "ScriptureDisplayMode" NOT NULL DEFAULT 'ESV';
