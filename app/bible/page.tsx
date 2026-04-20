import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { getSettings } from '@/lib/data';
import { getBibleOverview } from '@/lib/data';
import { isSharedUser } from '@/lib/app-users';

export default async function BiblePage() {
  noStore();
  const [overview, settings] = await Promise.all([getBibleOverview(), getSettings()]);
  const isSharedProfile = isSharedUser(settings.activeUser);

  return (
    <div className="section-grid">
      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <p className="eyebrow">Read the Bible</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))] sm:text-6xl">
          Move through Scripture in canonical order.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[color:rgb(var(--muted-strong))]">
          {isSharedProfile
            ? 'Choose a book, open a chapter, and keep track of how many chapters and books you have read together.'
            : 'Choose a book, open a chapter, mark your progress, and keep chapter notes close at hand as you read.'}
        </p>
      </section>

      {[{ label: 'Old Testament', books: overview.oldTestament }, { label: 'New Testament', books: overview.newTestament }].map((section) => (
        <section key={section.label} className="section-grid">
          <div>
            <p className="eyebrow">{section.label}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.books.filter(Boolean).map((book) => (
              <Link key={book!.slug} href={`/bible/${book!.slug}`} className="stat-card transition hover:translate-y-[-2px]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-[color:rgb(var(--foreground-strong))]">{book!.name}</h2>
                    <p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">{book!.chapters} chapters</p>
                  </div>
                  <div className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:rgb(var(--accent))]">
                    {book!.isCompleted ? 'Completed' : `${book!.completedChapters}/${book!.chapters}`}
                  </div>
                </div>
                <div className="progress-track mt-5 h-3">
                  <div className="progress-fill h-full" style={{ width: `${Math.round((book!.completedChapters / book!.chapters) * 100)}%` }} />
                </div>
                <p className="mt-3 text-sm leading-7 text-[color:rgb(var(--muted-strong))]">
                  {isSharedProfile
                    ? `${book!.completedChapters} chapter${book!.completedChapters === 1 ? '' : 's'} read together.`
                    : book!.bookmarkedChapters > 0
                      ? `${book!.bookmarkedChapters} bookmarked chapter${book!.bookmarkedChapters === 1 ? '' : 's'}.`
                      : 'No bookmarks yet.'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}