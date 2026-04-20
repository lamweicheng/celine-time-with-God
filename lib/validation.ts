import { z } from 'zod';
import { APP_USERS } from '@/lib/app-users';
import { normalizeYoutubeUrl } from '@/lib/ambience';

const appUserValues = APP_USERS.map((item) => item.value) as [string, ...string[]];

export const chapterReferenceSchema = z.object({
  bookSlug: z.string().min(1),
  chapter: z.coerce.number().int().positive(),
  returnPath: z.string().min(1)
});

export const chapterNoteSchema = chapterReferenceSchema.extend({
  content: z.string().max(12000)
});

export const journalEntrySchema = z.object({
  id: z.string().optional(),
  type: z.enum(['PRAYER_REQUEST', 'GRATITUDE', 'ANSWERED_PRAYER', 'REFLECTION']),
  title: z.string().max(120).optional(),
  content: z.string().trim().min(1).max(12000),
  reminderDate: z.string().optional().transform((value) => value || undefined),
  answeredDate: z.string().optional().transform((value) => value || undefined),
  entryDate: z.string().min(1),
  returnPath: z.string().min(1)
});

export const deleteEntrySchema = z.object({
  id: z.string().min(1),
  returnPath: z.string().min(1)
});

export const settingsSchema = z.object({
  readingTheme: z.enum(['LIGHT', 'DARK', 'WARM']),
  fontScale: z.coerce.number().int().min(70).max(140),
  scriptureFontScale: z.coerce.number().int().min(70).max(150),
  ambienceEnabled: z.enum(['true', 'false']).transform((value) => value === 'true'),
  ambienceYoutubeUrl: z.string().trim().max(500).optional().transform((value) => normalizeYoutubeUrl(value)),
  ambienceVolume: z.coerce.number().int().min(0).max(100),
  preferredLandingPage: z.enum(['DASHBOARD', 'DEVOTION', 'BIBLE', 'JOURNAL', 'PROGRESS']),
  dailyDevotionPlan: z.enum(['FOUNDATIONS', 'GOSPELS_AND_PSALMS', 'WHOLE_BIBLE_YEAR']),
  scriptureDisplayMode: z.enum(['ESV', 'CUVS', 'BOTH'])
});

export const scriptureFontScaleSchema = z.object({
  scriptureFontScale: z.coerce.number().int().min(70).max(150),
  returnPath: z.string().min(1)
});

export const generalFontScaleSchema = z.object({
  fontScale: z.coerce.number().int().min(70).max(140),
  returnPath: z.string().min(1)
});

export const appUserSchema = z.enum(appUserValues);