'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CURRENT_USER_COOKIE } from '@/lib/current-user';
import { isSharedUser } from '@/lib/app-users';
import { isDatabaseConfigured, isMissingTableError, isUniqueConstraintError, prisma } from '@/lib/prisma';
import { fromDateInputValue } from '@/lib/utils';
import { appUserSchema, chapterNoteSchema, chapterReferenceSchema, deleteEntrySchema, generalFontScaleSchema, journalEntrySchema, scriptureFontScaleSchema, settingsSchema } from '@/lib/validation';
import { getCurrentUser } from '@/lib/current-user';

type SettingsSaveStatus = 'saved' | 'unavailable';

export async function saveChapterNote(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = chapterNoteSchema.parse({
    bookSlug: formData.get('bookSlug'),
    chapter: formData.get('chapter'),
    content: formData.get('content'),
    returnPath: formData.get('returnPath')
  });

  const content = parsed.content.trim();

  if (isSharedUser(currentUser)) {
    redirect(parsed.returnPath);
  }

  if (!content) {
    await prisma.chapterNote.deleteMany({
      where: {
        user: currentUser,
        bookSlug: parsed.bookSlug,
        chapter: parsed.chapter
      }
    });
  } else {
    await prisma.chapterNote.upsert({
      where: { user_bookSlug_chapter: { user: currentUser, bookSlug: parsed.bookSlug, chapter: parsed.chapter } },
      update: { content },
      create: {
        user: currentUser,
        bookSlug: parsed.bookSlug,
        chapter: parsed.chapter,
        content
      }
    });
  }

  revalidateReadingPaths(parsed.returnPath, parsed.bookSlug);
  redirect(parsed.returnPath);
}

export async function toggleBookmark(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = chapterReferenceSchema.parse({
    bookSlug: formData.get('bookSlug'),
    chapter: formData.get('chapter'),
    returnPath: formData.get('returnPath')
  });

  if (isSharedUser(currentUser)) {
    redirect(parsed.returnPath);
  }

  const existing = await prisma.bookmark.findUnique({
    where: { user_bookSlug_chapter: { user: currentUser, bookSlug: parsed.bookSlug, chapter: parsed.chapter } }
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({
      data: {
        user: currentUser,
        bookSlug: parsed.bookSlug,
        chapter: parsed.chapter
      }
    });
  }

  revalidateReadingPaths(parsed.returnPath, parsed.bookSlug);
  redirect(parsed.returnPath);
}

export async function markChapterRead(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = chapterReferenceSchema.parse({
    bookSlug: formData.get('bookSlug'),
    chapter: formData.get('chapter'),
    returnPath: formData.get('returnPath')
  });

  await prisma.readingProgress.upsert({
    where: { user_bookSlug_chapter: { user: currentUser, bookSlug: parsed.bookSlug, chapter: parsed.chapter } },
    update: { lastReadAt: new Date() },
    create: {
      user: currentUser,
      bookSlug: parsed.bookSlug,
      chapter: parsed.chapter
    }
  });

  revalidateReadingPaths(parsed.returnPath, parsed.bookSlug);
  redirect(parsed.returnPath);
}

export async function markChapterUnread(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = chapterReferenceSchema.parse({
    bookSlug: formData.get('bookSlug'),
    chapter: formData.get('chapter'),
    returnPath: formData.get('returnPath')
  });

  await prisma.readingProgress.deleteMany({
    where: {
      user: currentUser,
      bookSlug: parsed.bookSlug,
      chapter: parsed.chapter
    }
  });

  revalidateReadingPaths(parsed.returnPath, parsed.bookSlug);
  redirect(parsed.returnPath);
}

export async function savePrayerEntry(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = journalEntrySchema.parse({
    id: formData.get('id') || undefined,
    type: formData.get('type'),
    title: (formData.get('title') || '').toString() || undefined,
    content: formData.get('content'),
    reminderDate: (formData.get('reminderDate') || '').toString() || undefined,
    answeredDate: (formData.get('answeredDate') || '').toString() || undefined,
    entryDate: formData.get('entryDate'),
    returnPath: formData.get('returnPath')
  });

  if (isSharedUser(currentUser)) {
    redirect(parsed.returnPath);
  }

  const data = {
    user: currentUser,
    type: parsed.type,
    title: parsed.title,
    content: parsed.content.trim(),
    prayerStatus: null,
    reminderDate: parsed.reminderDate ? fromDateInputValue(parsed.reminderDate) : null,
    answeredDate: parsed.type === 'ANSWERED_PRAYER' ? fromDateInputValue(parsed.answeredDate ?? parsed.entryDate) : null,
    entryDate: fromDateInputValue(parsed.entryDate)
  };

  if (parsed.id) {
    await prisma.prayerJournalEntry.update({
      where: { id: parsed.id },
      data
    });
  } else {
    await prisma.prayerJournalEntry.create({ data });
  }

  revalidatePath('/journal');
  revalidatePath('/dashboard');
  redirect(parsed.returnPath);
}

export async function deletePrayerEntry(formData: FormData) {
  const parsed = deleteEntrySchema.parse({
    id: formData.get('id'),
    returnPath: formData.get('returnPath')
  });

  if (isSharedUser(getCurrentUser())) {
    redirect(parsed.returnPath);
  }

  await prisma.prayerJournalEntry.deleteMany({ where: { id: parsed.id, user: getCurrentUser() } });
  revalidatePath('/journal');
  revalidatePath('/dashboard');
  redirect(parsed.returnPath);
}

export async function saveSettings(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = settingsSchema.parse({
    readingTheme: formData.get('readingTheme'),
    fontScale: formData.get('fontScale'),
    scriptureFontScale: formData.get('scriptureFontScale'),
    ambienceEnabled: formData.get('ambienceEnabled'),
    ambienceYoutubeUrl: formData.get('ambienceYoutubeUrl'),
    ambienceVolume: formData.get('ambienceVolume'),
    preferredLandingPage: formData.get('preferredLandingPage'),
    dailyDevotionPlan: formData.get('dailyDevotionPlan'),
    scriptureDisplayMode: formData.get('scriptureDisplayMode')
  });

  let status: SettingsSaveStatus = 'saved';

  if (isDatabaseConfigured()) {
    try {
      await prisma.appSettings.upsert({
        where: { user: currentUser },
        update: {
          readingTheme: parsed.readingTheme,
          fontScale: parsed.fontScale,
          scriptureFontScale: parsed.scriptureFontScale,
          ambienceEnabled: parsed.ambienceEnabled,
          ambienceYoutubeUrl: parsed.ambienceYoutubeUrl,
          ambienceVolume: parsed.ambienceVolume,
          preferredLandingPage: parsed.preferredLandingPage,
          dailyDevotionPlan: parsed.dailyDevotionPlan,
          scriptureDisplayMode: parsed.scriptureDisplayMode
        },
        create: {
          user: currentUser,
          readingTheme: parsed.readingTheme,
          fontScale: parsed.fontScale,
          scriptureFontScale: parsed.scriptureFontScale,
          ambienceEnabled: parsed.ambienceEnabled,
          ambienceYoutubeUrl: parsed.ambienceYoutubeUrl,
          ambienceVolume: parsed.ambienceVolume,
          preferredLandingPage: parsed.preferredLandingPage,
          dailyDevotionPlan: parsed.dailyDevotionPlan,
          scriptureDisplayMode: parsed.scriptureDisplayMode
        }
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        await prisma.appSettings.update({
          where: { user: currentUser },
          data: {
            readingTheme: parsed.readingTheme,
            fontScale: parsed.fontScale,
            scriptureFontScale: parsed.scriptureFontScale,
            ambienceEnabled: parsed.ambienceEnabled,
            ambienceYoutubeUrl: parsed.ambienceYoutubeUrl,
            ambienceVolume: parsed.ambienceVolume,
            preferredLandingPage: parsed.preferredLandingPage,
            dailyDevotionPlan: parsed.dailyDevotionPlan,
            scriptureDisplayMode: parsed.scriptureDisplayMode
          }
        });
      } else if (isMissingTableError(error)) {
        status = 'unavailable';
      } else {
        throw error;
      }
    }
  } else {
    status = 'unavailable';
  }

  if (status === 'saved') {
    revalidatePath('/', 'layout');
  }

  redirectWithSettingsStatus('/settings', status);
}

export async function updateScriptureFontScale(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = scriptureFontScaleSchema.parse({
    scriptureFontScale: formData.get('scriptureFontScale'),
    returnPath: formData.get('returnPath')
  });

  let status: SettingsSaveStatus = 'saved';

  if (isDatabaseConfigured()) {
    try {
      await prisma.appSettings.upsert({
        where: { user: currentUser },
        update: {
          scriptureFontScale: parsed.scriptureFontScale
        },
        create: {
          user: currentUser,
          scriptureFontScale: parsed.scriptureFontScale
        }
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        await prisma.appSettings.update({
          where: { user: currentUser },
          data: {
            scriptureFontScale: parsed.scriptureFontScale
          }
        });
      } else if (isMissingTableError(error)) {
        status = 'unavailable';
      } else {
        throw error;
      }
    }
  } else {
    status = 'unavailable';
  }

  if (status === 'saved') {
    revalidatePath('/', 'layout');
    revalidatePath(parsed.returnPath);
  }

  redirectWithSettingsStatus(parsed.returnPath, status);
}

export async function updateGeneralFontScale(formData: FormData) {
  const currentUser = getCurrentUser();
  const parsed = generalFontScaleSchema.parse({
    fontScale: formData.get('fontScale'),
    returnPath: formData.get('returnPath')
  });

  let status: SettingsSaveStatus = 'saved';

  if (isDatabaseConfigured()) {
    try {
      await prisma.appSettings.upsert({
        where: { user: currentUser },
        update: {
          fontScale: parsed.fontScale
        },
        create: {
          user: currentUser,
          fontScale: parsed.fontScale
        }
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        await prisma.appSettings.update({
          where: { user: currentUser },
          data: {
            fontScale: parsed.fontScale
          }
        });
      } else if (isMissingTableError(error)) {
        status = 'unavailable';
      } else {
        throw error;
      }
    }
  } else {
    status = 'unavailable';
  }

  if (status === 'saved') {
    revalidatePath('/', 'layout');
    revalidatePath(parsed.returnPath);
  }

  redirectWithSettingsStatus(parsed.returnPath, status);
}

export async function setActiveUser(formData: FormData) {
  const user = appUserSchema.parse(formData.get('user'));
  const returnPath = formData.get('returnPath')?.toString() || '/dashboard';

  cookies().set(CURRENT_USER_COOKIE, user, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365
  });

  revalidatePath('/', 'layout');
  const nextUrl = new URL(returnPath, 'http://localhost');
  nextUrl.searchParams.set('switchedUser', user);
  redirect(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}

function revalidateReadingPaths(returnPath: string, bookSlug: string) {
  revalidatePath('/dashboard');
  revalidatePath('/devotion');
  revalidatePath('/guided');
  revalidatePath('/bible');
  revalidatePath(`/bible/${bookSlug}`);
  revalidatePath('/progress');
  revalidatePath(returnPath);
}

function redirectWithSettingsStatus(returnPath: string, status: SettingsSaveStatus) {
  const nextUrl = new URL(returnPath, 'http://localhost');
  nextUrl.searchParams.set('settingsStatus', status);
  redirect(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
}