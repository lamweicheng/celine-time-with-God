import Link from 'next/link';
import { unstable_noStore as noStore } from 'next/cache';
import { markChapterRead, markChapterUnread, saveChapterNote, toggleBookmark } from '@/app/actions';
import { ReflectionPrompts } from '@/components/ReflectionPrompts';
import { ScripturePassages } from '@/components/ScripturePassages';
import { SubmitButton } from '@/components/SubmitButton';
import { Textarea } from '@/components/ui/textarea';
import { isSharedUser } from '@/lib/app-users';
import { getAdjacentChapter, getPassageQuery, getReferenceLabel } from '@/lib/bible';
import { getChapterPageData, getSettings } from '@/lib/data';
import { getRequestTimeZone } from '@/lib/request-timezone';
import { fetchScripturePassages } from '@/lib/scripture';
import { getTodaysDevotion } from '@/lib/reading-plans';

export default async function DevotionPage({
  searchParams
}: {
  searchParams?: { reference?: string };
}) {
  noStore();
  const settings = await getSettings();
  const timeZone = getRequestTimeZone();
  const isSharedProfile = isSharedUser(settings.activeUser);
  const devotion = getTodaysDevotion(settings.dailyDevotionPlan, new Date(), timeZone);
  const activeReference = devotion.references.find(
    (item) => `${item.bookSlug}:${item.chapter}` === searchParams?.reference
  ) ?? devotion.references[0];

  const chapterData = activeReference ? await getChapterPageData(activeReference) : null;
  const passages = chapterData
    ? await fetchScripturePassages(settings.scriptureDisplayMode, getPassageQuery(chapterData.reference.bookSlug, chapterData.reference.chapter))
    : [];
  const previous = chapterData ? getAdjacentChapter(chapterData.reference.bookSlug, chapterData.reference.chapter, 'previous') : null;
  const next = chapterData ? getAdjacentChapter(chapterData.reference.bookSlug, chapterData.reference.chapter, 'next') : null;

  if (!chapterData) {
    return <div className="stat-card">No devotion reference is available for today.</div>;
  }

  const returnPath = `/devotion?reference=${chapterData.reference.bookSlug}:${chapterData.reference.chapter}`;

  return (
    <div className="section-grid">
      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Daily Devotion</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))]">{devotion.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[color:rgb(var(--muted-strong))]">{devotion.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {devotion.references.map((reference) => {
              const active = reference.bookSlug === chapterData.reference.bookSlug && reference.chapter === chapterData.reference.chapter;
              return (
                <Link
                  key={`${reference.bookSlug}-${reference.chapter}`}
                  href={`/devotion?reference=${reference.bookSlug}:${reference.chapter}`}
                  className={active ? 'soft-button bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]' : 'soft-button'}
                >
                  {getReferenceLabel(reference.bookSlug, reference.chapter)}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr] 2xl:grid-cols-[1.45fr_0.55fr]">
        <article className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Reading</p>
              <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{chapterData.label}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {previous ? <Link href={`/bible/${previous.bookSlug}/${previous.chapter}`} className="soft-button">Previous chapter</Link> : null}
              {next ? <Link href={`/bible/${next.bookSlug}/${next.chapter}`} className="soft-button">Next chapter</Link> : null}
            </div>
          </div>
          <ScripturePassages passages={passages} className="mt-6" />
        </article>

        <aside className="panel-shell flex h-full flex-col rounded-[36px] px-6 py-7 sm:px-8">
          {isSharedProfile ? (
            <>
              <p className="eyebrow">Read Together</p>
              <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">Track shared progress only</h2>
              <p className="mt-6 text-base leading-8 text-[color:rgb(var(--muted-strong))]">
                Shared reading mode keeps this space focused on the chapter and reading progress.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <form action={markChapterRead}>
                  <input type="hidden" name="bookSlug" value={chapterData.reference.bookSlug} />
                  <input type="hidden" name="chapter" value={chapterData.reference.chapter} />
                  <input type="hidden" name="returnPath" value={returnPath} />
                  <SubmitButton pendingLabel="Marking..." variant="secondary">
                    {chapterData.progress ? 'Read again today' : 'Mark as read'}
                  </SubmitButton>
                </form>
                {chapterData.progress ? (
                  <form action={markChapterUnread}>
                    <input type="hidden" name="bookSlug" value={chapterData.reference.bookSlug} />
                    <input type="hidden" name="chapter" value={chapterData.reference.chapter} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <SubmitButton pendingLabel="Updating..." variant="secondary">
                      Mark unread
                    </SubmitButton>
                  </form>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow">Journal Notes</p>
              <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">Reflect as you read</h2>
              <div className="mt-6">
                <ReflectionPrompts />
              </div>
              <form action={saveChapterNote} className="mt-6 flex flex-1 min-h-0 flex-col gap-4">
                <input type="hidden" name="bookSlug" value={chapterData.reference.bookSlug} />
                <input type="hidden" name="chapter" value={chapterData.reference.chapter} />
                <input type="hidden" name="returnPath" value={returnPath} />
                <Textarea
                  name="content"
                  defaultValue={chapterData.note?.content ?? ''}
                  placeholder="Write what stands out, what convicts you, and how you want to respond in prayer."
                  autoResize
                  className="min-h-[260px] flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(248,243,232,0.9))] xl:max-h-full"
                />
                <div className="flex flex-wrap gap-3">
                  <SubmitButton pendingLabel="Saving note...">Save notes</SubmitButton>
                </div>
              </form>
              <div className="mt-4 flex flex-wrap gap-3">
                <form action={markChapterRead}>
                  <input type="hidden" name="bookSlug" value={chapterData.reference.bookSlug} />
                  <input type="hidden" name="chapter" value={chapterData.reference.chapter} />
                  <input type="hidden" name="returnPath" value={returnPath} />
                  <SubmitButton pendingLabel="Marking..." variant="secondary">
                    {chapterData.progress ? 'Read again today' : 'Mark as read'}
                  </SubmitButton>
                </form>
                {chapterData.progress ? (
                  <form action={markChapterUnread}>
                    <input type="hidden" name="bookSlug" value={chapterData.reference.bookSlug} />
                    <input type="hidden" name="chapter" value={chapterData.reference.chapter} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <SubmitButton pendingLabel="Updating..." variant="secondary">
                      Mark unread
                    </SubmitButton>
                  </form>
                ) : null}
                <form action={toggleBookmark}>
                  <input type="hidden" name="bookSlug" value={chapterData.reference.bookSlug} />
                  <input type="hidden" name="chapter" value={chapterData.reference.chapter} />
                  <input type="hidden" name="returnPath" value={returnPath} />
                  <SubmitButton pendingLabel="Updating..." variant="secondary">
                    {chapterData.bookmark ? 'Remove bookmark' : 'Bookmark chapter'}
                  </SubmitButton>
                </form>
              </div>
            </>
          )}
        </aside>
      </section>
    </div>
  );
}