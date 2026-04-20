import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { getReferenceLabel } from '@/lib/bible';
import { getProgressPageData } from '@/lib/data';
import { getRequestTimeZone } from '@/lib/request-timezone';
import { formatLongDate } from '@/lib/utils';

export default async function ProgressPage() {
  noStore();
  const data = await getProgressPageData();
  const timeZone = getRequestTimeZone();
  const stats = data.progressSnapshot;

  return (
    <div className="section-grid">
      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <p className="eyebrow">Progress</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))]">See the shape of your reading.</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[color:rgb(var(--muted-strong))]">
          Track completed chapters, finished books, your current streak, and how your reading is unfolding across the Old and New Testaments.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="stat-card"><p className="eyebrow">Overall Completion</p><p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{stats.totalCompletionPercent}%</p><p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">{stats.totalCompletedChapters} chapters completed</p></div>
        <div className="stat-card"><p className="eyebrow">Books Completed</p><p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{stats.booksCompleted}</p><p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">fully completed books</p></div>
        <div className="stat-card"><p className="eyebrow">Current Streak</p><p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{stats.currentStreak}</p><p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">days in a row</p></div>
        <div className="stat-card"><p className="eyebrow">Recent Activity</p><p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{data.recentActivity.length}</p><p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">recent marked chapters</p></div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="stat-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Old Testament</p>
              <p className="mt-2 text-2xl font-semibold text-[color:rgb(var(--foreground-strong))]">{stats.oldTestamentCompleted} chapters</p>
            </div>
            <p className="text-3xl font-semibold text-[color:rgb(var(--accent))]">{stats.oldTestamentPercent}%</p>
          </div>
          <div className="progress-track mt-5 h-3"><div className="progress-fill h-full" style={{ width: `${stats.oldTestamentPercent}%` }} /></div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">New Testament</p>
              <p className="mt-2 text-2xl font-semibold text-[color:rgb(var(--foreground-strong))]">{stats.newTestamentCompleted} chapters</p>
            </div>
            <p className="text-3xl font-semibold text-[color:rgb(var(--accent))]">{stats.newTestamentPercent}%</p>
          </div>
          <div className="progress-track mt-5 h-3"><div className="progress-fill h-full" style={{ width: `${stats.newTestamentPercent}%` }} /></div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="stat-card">
          <p className="eyebrow">Completed Books</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.completedBooks.length ? data.completedBooks.map((book) => (
              <Link key={book.slug} href={`/bible/${book.slug}`} className="soft-button">{book.name}</Link>
            )) : <p className="text-sm text-[color:rgb(var(--muted-strong))]">No books completed yet.</p>}
          </div>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Recent Reading Activity</p>
          <div className="mt-4 space-y-3">
            {data.recentActivity.length ? data.recentActivity.map((entry) => (
              <Link key={`${entry.bookSlug}-${entry.chapter}`} href={`/bible/${entry.bookSlug}/${entry.chapter}`} className="flex items-center justify-between rounded-[22px] bg-white/40 px-4 py-3 transition hover:bg-white/60">
                <span>{getReferenceLabel(entry.bookSlug, entry.chapter)}</span>
                <span className="text-sm text-[color:rgb(var(--muted))]">{formatLongDate(entry.lastReadAt, timeZone)}</span>
              </Link>
            )) : <p className="text-sm text-[color:rgb(var(--muted-strong))]">Mark chapters as read to build a visible reading history.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}