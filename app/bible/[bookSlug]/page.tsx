import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { getSettings } from '@/lib/data';
import { getBookPageData } from '@/lib/data';
import { isSharedUser } from '@/lib/app-users';

export default async function BookPage({ params }: { params: { bookSlug: string } }) {
  noStore();
  const [data, settings] = await Promise.all([getBookPageData(params.bookSlug), getSettings()]);

  if (!data) {
    notFound();
  }

  const isSharedProfile = isSharedUser(settings.activeUser);

  return (
    <div className="section-grid">
      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <p className="eyebrow">Book Overview</p>
        <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))]">{data.book.name}</h1>
        <p className="mt-4 text-base leading-8 text-[color:rgb(var(--muted-strong))]">
          {data.completedCount} of {data.book.chapters} chapters completed.
        </p>
        <div className="progress-track mt-5 h-3">
          <div className="progress-fill h-full" style={{ width: `${Math.round((data.completedCount / data.book.chapters) * 100)}%` }} />
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {data.chapters.map((chapter) => (
          <Link key={chapter.chapter} href={`/bible/${data.book.slug}/${chapter.chapter}`} className="stat-card transition hover:translate-y-[-2px]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-display text-3xl text-[color:rgb(var(--foreground-strong))]">{chapter.chapter}</span>
              <span className="text-lg text-[color:rgb(var(--accent))]">{chapter.isCompleted ? '✓' : ''}</span>
            </div>
            <p className="mt-3 text-sm text-[color:rgb(var(--muted-strong))]">
              {isSharedProfile
                ? chapter.isCompleted
                  ? 'Completed together'
                  : 'Open chapter'
                : [chapter.isBookmarked ? 'Bookmarked' : null, chapter.hasNote ? 'Has note' : null].filter(Boolean).join(' • ') || 'Open chapter'}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}