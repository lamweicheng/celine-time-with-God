import type { AppSettings, AppUser, Bookmark, ChapterNote, PrayerJournalEntry, ReadingProgress } from '@prisma/client';
import { DevotionPlan, PreferredLandingPage, ReadingTheme, ScriptureDisplayMode } from '@prisma/client';
import {
  BIBLE_BOOKS,
  NEW_TESTAMENT_BOOKS,
  NEW_TESTAMENT_CHAPTERS,
  OLD_TESTAMENT_BOOKS,
  OLD_TESTAMENT_CHAPTERS,
  TOTAL_BIBLE_CHAPTERS,
  getBookBySlug,
  getChapterKey,
  getReferenceLabel,
  type ChapterReference
} from '@/lib/bible';
import { DEFAULT_AMBIENCE_VOLUME, DEFAULT_AMBIENCE_YOUTUBE_URL } from '@/lib/ambience';
import { isSharedUser } from '@/lib/app-users';
import { getCurrentUser } from '@/lib/current-user';
import { getDateKey } from '@/lib/date-utils';
import { isDatabaseConfigured, isMissingTableError, isUniqueConstraintError, prisma } from '@/lib/prisma';
import { getTodaysDevotion } from '@/lib/reading-plans';
import { getRequestTimeZone } from '@/lib/request-timezone';

export type ResolvedAppSettings = AppSettings & {
  activeUser: AppUser;
};

const defaultSettings = {
  readingTheme: ReadingTheme.WARM,
  fontScale: 100,
  scriptureFontScale: 100,
  ambienceEnabled: false,
  ambienceYoutubeUrl: DEFAULT_AMBIENCE_YOUTUBE_URL,
  ambienceVolume: DEFAULT_AMBIENCE_VOLUME,
  preferredLandingPage: PreferredLandingPage.DASHBOARD,
  dailyDevotionPlan: DevotionPlan.FOUNDATIONS,
  scriptureDisplayMode: ScriptureDisplayMode.BOTH
} satisfies Pick<
  AppSettings,
  'readingTheme' | 'fontScale' | 'scriptureFontScale' | 'ambienceEnabled' | 'ambienceYoutubeUrl' | 'ambienceVolume' | 'preferredLandingPage' | 'dailyDevotionPlan' | 'scriptureDisplayMode'
>;

export async function getSettings() {
  const currentUser = getCurrentUser();

  if (!isDatabaseConfigured()) {
    return buildResolvedSettings(buildDefaultSettingsRecord(currentUser), currentUser);
  }

  const settings = await withDatabaseFallback(() => getOrCreateSettings(currentUser), () => buildDefaultSettingsRecord(currentUser));

  return buildResolvedSettings(settings, currentUser);
}

export async function getDashboardData() {
  const currentUser = getCurrentUser();
  const isSharedProfile = isSharedUser(currentUser);
  const timeZone = getRequestTimeZone();

  if (!isDatabaseConfigured()) {
    const settings = buildResolvedSettings(buildDefaultSettingsRecord(currentUser), currentUser);
    return {
      settings,
      devotion: getTodaysDevotion(settings.dailyDevotionPlan, new Date(), timeZone),
      progressSnapshot: buildProgressSnapshot([], timeZone),
      lastRead: null,
      recentNote: null,
      recentJournalEntry: null,
      recentJournalEntries: [],
      bookmarks: []
    };
  }

  const [settings, progress, notes, bookmarks, recentJournalEntries] = await withDatabaseFallback(
    () =>
      Promise.all([
        getSettings(),
        prisma.readingProgress.findMany({ where: { user: currentUser }, orderBy: { lastReadAt: 'desc' } }),
        isSharedProfile ? Promise.resolve([] as ChapterNote[]) : prisma.chapterNote.findMany({ where: { user: currentUser }, orderBy: { updatedAt: 'desc' }, take: 5 }),
        isSharedProfile ? Promise.resolve([] as Bookmark[]) : prisma.bookmark.findMany({ where: { user: currentUser }, orderBy: { updatedAt: 'desc' } }),
        isSharedProfile ? Promise.resolve([] as PrayerJournalEntry[]) : prisma.prayerJournalEntry.findMany({ where: { user: currentUser }, orderBy: { entryDate: 'desc' }, take: 3 })
      ]),
    () => [
      buildResolvedSettings(buildDefaultSettingsRecord(currentUser), currentUser),
      [] as ReadingProgress[],
      [] as ChapterNote[],
      [] as Bookmark[],
      [] as PrayerJournalEntry[]
    ]
  );

  const progressSnapshot = buildProgressSnapshot(progress, timeZone);
  const lastRead = isSharedProfile ? getLastRead(progress, [], []) : getLastRead(progress, notes, bookmarks);
  const devotion = getTodaysDevotion(settings.dailyDevotionPlan, new Date(), timeZone);

  return {
    settings,
    devotion,
    progressSnapshot,
    lastRead,
    recentNote: notes[0] ?? null,
    recentJournalEntry: recentJournalEntries[0] ?? null,
    recentJournalEntries,
    bookmarks: bookmarks.slice(0, 5)
  };
}

export async function getBibleOverview() {
  const currentUser = getCurrentUser();
  const isSharedProfile = isSharedUser(currentUser);

  if (!isDatabaseConfigured()) {
    const completedSet = new Set<string>();
    const bookmarkSet = new Set<string>();

    return {
      oldTestament: OLD_TESTAMENT_BOOKS.map((book) => buildBookOverview(book.slug, completedSet, bookmarkSet)),
      newTestament: NEW_TESTAMENT_BOOKS.map((book) => buildBookOverview(book.slug, completedSet, bookmarkSet))
    };
  }

  const [progress, bookmarks] = await withDatabaseFallback(
    () => Promise.all([
      prisma.readingProgress.findMany({ where: { user: currentUser } }),
      isSharedProfile ? Promise.resolve([] as Bookmark[]) : prisma.bookmark.findMany({ where: { user: currentUser } })
    ]),
    () => [[] as ReadingProgress[], [] as Bookmark[]]
  );

  const completedSet = new Set(progress.map((entry) => getChapterKey(entry)));
  const bookmarkSet = new Set(bookmarks.map((entry) => getChapterKey(entry)));

  return {
    oldTestament: OLD_TESTAMENT_BOOKS.map((book) => buildBookOverview(book.slug, completedSet, bookmarkSet)),
    newTestament: NEW_TESTAMENT_BOOKS.map((book) => buildBookOverview(book.slug, completedSet, bookmarkSet))
  };
}

export async function getBookPageData(bookSlug: string) {
  const currentUser = getCurrentUser();
  const isSharedProfile = isSharedUser(currentUser);
  const book = getBookBySlug(bookSlug);

  if (!book) {
    return null;
  }

  if (!isDatabaseConfigured()) {
    return {
      book,
      chapters: Array.from({ length: book.chapters }, (_, index) => ({
        chapter: index + 1,
        isCompleted: false,
        isBookmarked: false,
        hasNote: false
      })),
      completedCount: 0
    };
  }

  const [progress, bookmarks, notes] = await withDatabaseFallback(
    () =>
      Promise.all([
        prisma.readingProgress.findMany({ where: { user: currentUser, bookSlug } }),
        isSharedProfile ? Promise.resolve([] as Bookmark[]) : prisma.bookmark.findMany({ where: { user: currentUser, bookSlug } }),
        isSharedProfile ? Promise.resolve([] as ChapterNote[]) : prisma.chapterNote.findMany({ where: { user: currentUser, bookSlug } })
      ]),
    () => [[] as ReadingProgress[], [] as Bookmark[], [] as ChapterNote[]]
  );

  const completedSet = new Set(progress.map((entry) => entry.chapter));
  const bookmarkSet = new Set(bookmarks.map((entry) => entry.chapter));
  const noteSet = new Set(notes.filter((entry) => entry.content.trim()).map((entry) => entry.chapter));

  return {
    book,
    chapters: Array.from({ length: book.chapters }, (_, index) => {
      const chapter = index + 1;
      return {
        chapter,
        isCompleted: completedSet.has(chapter),
        isBookmarked: bookmarkSet.has(chapter),
        hasNote: noteSet.has(chapter)
      };
    }),
    completedCount: completedSet.size
  };
}

export async function getChapterPageData(reference: ChapterReference) {
  const currentUser = getCurrentUser();
  const isSharedProfile = isSharedUser(currentUser);
  const book = getBookBySlug(reference.bookSlug);

  if (!book) {
    return null;
  }

  if (!isDatabaseConfigured()) {
    return {
      book,
      reference,
      note: null,
      bookmark: null,
      progress: null,
      label: getReferenceLabel(reference.bookSlug, reference.chapter)
    };
  }

  const [note, bookmark, progress] = await withDatabaseFallback(
    () =>
      Promise.all([
        isSharedProfile ? Promise.resolve(null) : prisma.chapterNote.findUnique({ where: { user_bookSlug_chapter: { user: currentUser, ...reference } } }),
        isSharedProfile ? Promise.resolve(null) : prisma.bookmark.findUnique({ where: { user_bookSlug_chapter: { user: currentUser, ...reference } } }),
        prisma.readingProgress.findUnique({ where: { user_bookSlug_chapter: { user: currentUser, ...reference } } })
      ]),
    () => [null, null, null] as const
  );

  return {
    book,
    reference,
    note,
    bookmark,
    progress,
    label: getReferenceLabel(reference.bookSlug, reference.chapter)
  };
}

export async function getJournalEntries() {
  const currentUser = getCurrentUser();

  if (!isDatabaseConfigured() || isSharedUser(currentUser)) {
    return [];
  }

  return withDatabaseFallback(
    () =>
      prisma.prayerJournalEntry.findMany({
        where: { user: currentUser },
        orderBy: [{ entryDate: 'desc' }, { updatedAt: 'desc' }]
      }),
    () => []
  );
}

export async function getProgressPageData() {
  const currentUser = getCurrentUser();
  const isSharedProfile = isSharedUser(currentUser);
  const timeZone = getRequestTimeZone();

  if (!isDatabaseConfigured()) {
    return {
      progressSnapshot: buildProgressSnapshot([], timeZone),
      recentActivity: [],
      recentNotes: [],
      recentBookmarks: [],
      completedBooks: []
    };
  }

  const [progress, notes, bookmarks] = await withDatabaseFallback(
    () =>
      Promise.all([
        prisma.readingProgress.findMany({ where: { user: currentUser }, orderBy: { lastReadAt: 'desc' } }),
        isSharedProfile ? Promise.resolve([] as ChapterNote[]) : prisma.chapterNote.findMany({ where: { user: currentUser }, orderBy: { updatedAt: 'desc' }, take: 5 }),
        isSharedProfile ? Promise.resolve([] as Bookmark[]) : prisma.bookmark.findMany({ where: { user: currentUser }, orderBy: { updatedAt: 'desc' }, take: 5 })
      ]),
    () => [[] as ReadingProgress[], [] as ChapterNote[], [] as Bookmark[]]
  );

  return {
    progressSnapshot: buildProgressSnapshot(progress, timeZone),
    recentActivity: progress.slice(0, 8),
    recentNotes: notes,
    recentBookmarks: bookmarks,
    completedBooks: BIBLE_BOOKS.filter((book) =>
      progress.filter((entry) => entry.bookSlug === book.slug).length === book.chapters
    )
  };
}

export async function getSettingsPageData() {
  return getSettings();
}

function buildDefaultSettingsRecord(user: AppUser): AppSettings {
  const now = new Date();
  return {
    id: `${user.toLowerCase()}-settings`,
    user,
    ...defaultSettings,
    createdAt: now,
    updatedAt: now
  };
}

function buildSettingsSeed(user: AppUser) {
  return {
    user,
    ...defaultSettings
  } satisfies Omit<AppSettings, 'id' | 'createdAt' | 'updatedAt'>;
}

function buildBookOverview(bookSlug: string, completedSet: Set<string>, bookmarkSet: Set<string>) {
  const book = getBookBySlug(bookSlug);

  if (!book) {
    return null;
  }

  let completedChapters = 0;
  let bookmarkedChapters = 0;

  for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
    const key = getChapterKey({ bookSlug, chapter });
    if (completedSet.has(key)) {
      completedChapters += 1;
    }

    if (bookmarkSet.has(key)) {
      bookmarkedChapters += 1;
    }
  }

  return {
    ...book,
    completedChapters,
    bookmarkedChapters,
    isCompleted: completedChapters === book.chapters
  };
}

function buildProgressSnapshot(progress: ReadingProgress[], timeZone: string) {
  const uniqueDays = new Set(progress.map((entry) => getDateKey(entry.lastReadAt, timeZone)));
  const completedSet = new Set(progress.map((entry) => getChapterKey(entry)));
  const oldCompleted = progress.filter((entry) => getBookBySlug(entry.bookSlug)?.testament === 'OLD').length;
  const newCompleted = progress.filter((entry) => getBookBySlug(entry.bookSlug)?.testament === 'NEW').length;
  const completedBooks = BIBLE_BOOKS.filter((book) =>
    progress.filter((entry) => entry.bookSlug === book.slug).length === book.chapters
  );

  return {
    totalCompletedChapters: progress.length,
    totalCompletionPercent: Math.round((progress.length / TOTAL_BIBLE_CHAPTERS) * 100),
    booksCompleted: completedBooks.length,
    currentStreak: calculateStreak(uniqueDays, timeZone),
    oldTestamentCompleted: oldCompleted,
    oldTestamentPercent: Math.round((oldCompleted / OLD_TESTAMENT_CHAPTERS) * 100),
    newTestamentCompleted: newCompleted,
    newTestamentPercent: Math.round((newCompleted / NEW_TESTAMENT_CHAPTERS) * 100),
    completedSet,
    completedBooks
  };
}

function calculateStreak(uniqueDays: Set<string>, timeZone: string) {
  let streak = 0;
  const today = new Date();

  for (;;) {
    const key = getDateKey(today, timeZone);
    if (!uniqueDays.has(key)) {
      break;
    }

    streak += 1;
    today.setDate(today.getDate() - 1);
  }

  return streak;
}

function getLastRead(progress: ReadingProgress[], notes: ChapterNote[], bookmarks: Bookmark[]) {
  const candidates = [
    ...progress.map((entry) => ({ bookSlug: entry.bookSlug, chapter: entry.chapter, at: entry.lastReadAt })),
    ...notes.map((entry) => ({ bookSlug: entry.bookSlug, chapter: entry.chapter, at: entry.updatedAt })),
    ...bookmarks.map((entry) => ({ bookSlug: entry.bookSlug, chapter: entry.chapter, at: entry.updatedAt }))
  ].sort((left, right) => right.at.getTime() - left.at.getTime());

  return candidates[0] ?? null;
}

export function getLandingPath(value: PreferredLandingPage) {
  switch (value) {
    case 'DEVOTION':
      return '/devotion';
    case 'BIBLE':
      return '/bible';
    case 'JOURNAL':
      return '/journal';
    case 'PROGRESS':
      return '/progress';
    case 'DASHBOARD':
    default:
      return '/dashboard';
  }
}

export type JournalEntryRecord = PrayerJournalEntry;

function buildResolvedSettings(settings: AppSettings, activeUser: AppUser) {
  return {
    ...settings,
    activeUser
  } satisfies ResolvedAppSettings;
}

async function getOrCreateSettings(user: AppUser) {
  const existingSettings = await prisma.appSettings.findUnique({ where: { user } });

  if (existingSettings) {
    return existingSettings;
  }

  try {
    return await prisma.appSettings.create({ data: buildSettingsSeed(user) });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const concurrentSettings = await prisma.appSettings.findUnique({ where: { user } });

    if (concurrentSettings) {
      return concurrentSettings;
    }

    throw error;
  }
}

async function withDatabaseFallback<T>(run: () => Promise<T>, buildFallback: () => T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (isMissingTableError(error)) {
      return buildFallback();
    }

    throw error;
  }
}