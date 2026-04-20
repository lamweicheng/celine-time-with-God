import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { ScripturePassages } from '@/components/ScripturePassages';
import { isSharedUser } from '@/lib/app-users';
import { getReferenceLabel } from '@/lib/bible';
import { getDashboardData } from '@/lib/data';
import { getRequestTimeZone } from '@/lib/request-timezone';
import { fetchScripturePassages } from '@/lib/scripture';
import { formatLongDate, truncateText } from '@/lib/utils';
import { getVerseOfTheDay } from '@/lib/verse-of-the-day';

export default async function DashboardPage() {
  noStore();

  const data = await getDashboardData();
  const timeZone = getRequestTimeZone();
  const isSharedProfile = isSharedUser(data.settings.activeUser);

  if (isSharedProfile) {
    redirect('/bible');
  }

  const verseReference = getVerseOfTheDay(new Date(), timeZone);
  const passages = await fetchScripturePassages(data.settings.scriptureDisplayMode, verseReference);

  return (
    <div className="section-grid">
      <section className="panel-shell overflow-hidden rounded-[36px] px-6 py-7 sm:px-8 sm:py-9">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow">Verse Of The Day</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-[color:rgb(var(--foreground-strong))] sm:text-5xl">
              {verseReference}
            </h1>
            <ScripturePassages passages={passages} className="mt-6" />
            <div className="mt-6 flex flex-wrap gap-3">
              {!isSharedProfile ? (
                <Link href="/guided" className="soft-button bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]">
                  Start guided time with God
                </Link>
              ) : null}
              <Link href="/devotion" className="soft-button bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]">
                Open today&apos;s devotion
              </Link>
              <Link href="/bible" className="soft-button">
                Read the Bible
              </Link>
            </div>
          </div>

          <div className="grid gap-4 self-start sm:grid-cols-2 lg:grid-cols-1">
            <div className="stat-card">
              <p className="eyebrow">Today</p>
              <p className="mt-2 font-display text-3xl text-[color:rgb(var(--foreground-strong))]">{formatLongDate(new Date(), timeZone)}</p>
              <p className="mt-3 text-sm leading-7 text-[color:rgb(var(--muted-strong))]">{data.devotion.description}</p>
            </div>
            <div className="stat-card">
              <p className="eyebrow">Keep Going</p>
              <p className="mt-2 text-2xl font-semibold text-[color:rgb(var(--foreground-strong))]">
                {data.lastRead ? getReferenceLabel(data.lastRead.bookSlug, data.lastRead.chapter) : data.devotion.labels[0] ?? 'Start today'}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:rgb(var(--muted-strong))]">
                {data.lastRead
                  ? 'Pick up where you left off or revisit your notes before moving on.'
                  : 'Start with today\'s reading and let the rhythm build one chapter at a time.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ...(!isSharedProfile ? [{ href: '/guided', label: 'Guided Time With God', detail: 'Move through stillness, Scripture, reflection, prayer, and a closing encouragement.' }] : []),
          { href: '/devotion', label: 'Daily Devotion', detail: data.devotion.labels.join(' • ') },
          {
            href: data.lastRead ? `/bible/${data.lastRead.bookSlug}/${data.lastRead.chapter}` : '/bible',
            label: 'Continue Reading',
            detail: data.lastRead ? getReferenceLabel(data.lastRead.bookSlug, data.lastRead.chapter) : 'Begin with a Gospel or open today\'s devotion.'
          },
          ...(isSharedProfile ? [{ href: '/progress', label: 'Shared Progress', detail: 'Track the chapters and books you have read together.' }] : [{ href: '/journal', label: 'Prayer Tracker', detail: 'Track ongoing prayers, answered prayers, reminders, and dated reflections.' }])
        ].map((item) => (
          <Link key={item.label} href={item.href} className="stat-card transition hover:translate-y-[-2px]">
            <p className="text-lg font-semibold text-[color:rgb(var(--foreground-strong))]">{item.label}</p>
            <p className="mt-2 text-sm leading-7 text-[color:rgb(var(--muted-strong))]">{item.detail}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card">
          <p className="eyebrow">Current Streak</p>
          <p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{data.progressSnapshot.currentStreak}</p>
          <p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">consecutive days of reading</p>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Books Completed</p>
          <p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{data.progressSnapshot.booksCompleted}</p>
          <p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">whole books finished so far</p>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Chapters Completed</p>
          <p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{data.progressSnapshot.totalCompletedChapters}</p>
          <p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">of 1,189 total chapters</p>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Completion</p>
          <p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{data.progressSnapshot.totalCompletionPercent}%</p>
          <div className="progress-track mt-4 h-3">
            <div className="progress-fill h-full" style={{ width: `${data.progressSnapshot.totalCompletionPercent}%` }} />
          </div>
        </div>
      </section>

      {isSharedProfile ? (
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="stat-card">
            <p className="eyebrow">Reading Together</p>
            <p className="mt-3 text-xl font-semibold text-[color:rgb(var(--foreground-strong))]">
              {data.progressSnapshot.totalCompletedChapters} chapters completed together
            </p>
            <p className="mt-4 text-base leading-8 text-[color:rgb(var(--foreground))]">
              Shared mode focuses only on reading progress, so notes, bookmarks, and prayer tracking stay out of the way.
            </p>
          </div>
          <div className="stat-card">
            <p className="eyebrow">Latest Shared Reading</p>
            <p className="mt-3 text-xl font-semibold text-[color:rgb(var(--foreground-strong))]">
              {data.lastRead ? getReferenceLabel(data.lastRead.bookSlug, data.lastRead.chapter) : 'No chapters marked yet'}
            </p>
            <p className="mt-1 text-sm text-[color:rgb(var(--muted))]">
              {data.lastRead ? formatLongDate(data.lastRead.at, timeZone) : 'Mark chapters as read to see shared progress here.'}
            </p>
            <p className="mt-4 text-base leading-8 text-[color:rgb(var(--foreground))]">
              {data.progressSnapshot.booksCompleted} books completed together so far.
            </p>
          </div>
        </section>
      ) : (
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="stat-card">
            <p className="eyebrow">Recent Note</p>
            <p className="mt-3 text-xl font-semibold text-[color:rgb(var(--foreground-strong))]">
              {data.recentNote ? getReferenceLabel(data.recentNote.bookSlug, data.recentNote.chapter) : 'No chapter notes yet'}
            </p>
            <p className="mt-4 text-base leading-8 text-[color:rgb(var(--foreground))]">
              {data.recentNote ? truncateText(data.recentNote.content, 240) : 'Save reflections during your reading and they will appear here for easy review.'}
            </p>
          </div>
          <div className="stat-card">
            <p className="eyebrow">Recent Journal Entry</p>
            <p className="mt-3 text-xl font-semibold text-[color:rgb(var(--foreground-strong))]">
              {data.recentJournalEntry?.title || 'Prayer Journal is ready'}
            </p>
            <p className="mt-1 text-sm text-[color:rgb(var(--muted))]">
              {data.recentJournalEntry ? formatLongDate(data.recentJournalEntry.entryDate, timeZone) : 'Use the journal for requests, gratitude, answered prayers, and reflections.'}
            </p>
            <p className="mt-4 text-base leading-8 text-[color:rgb(var(--foreground))]">
              {data.recentJournalEntry
                ? truncateText(data.recentJournalEntry.content, 220)
                : 'Your most recent prayer entry preview will appear here once you begin writing.'}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
