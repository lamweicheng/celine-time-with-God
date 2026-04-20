import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_noStore as noStore } from 'next/cache';
import { markChapterRead, markChapterUnread, saveChapterNote, toggleBookmark } from '@/app/actions';
import { ReflectionPrompts } from '@/components/ReflectionPrompts';
import { ScripturePassages } from '@/components/ScripturePassages';
import { SubmitButton } from '@/components/SubmitButton';
import { Textarea } from '@/components/ui/textarea';
import { isSharedUser } from '@/lib/app-users';
import { getAdjacentChapter, getPassageQuery, isValidChapter } from '@/lib/bible';
import { getChapterPageData, getSettings } from '@/lib/data';
import { fetchScripturePassages } from '@/lib/scripture';

export default async function ChapterPage({
  params
}: {
  params: { bookSlug: string; chapter: string };
}) {
  noStore();
  const chapter = Number(params.chapter);

  if (!Number.isInteger(chapter) || !isValidChapter(params.bookSlug, chapter)) {
    notFound();
  }

  const [data, settings] = await Promise.all([
    getChapterPageData({ bookSlug: params.bookSlug, chapter }),
    getSettings()
  ]);
  const isSharedProfile = isSharedUser(settings.activeUser);

  if (!data) {
    notFound();
  }

  const passages = await fetchScripturePassages(settings.scriptureDisplayMode, getPassageQuery(params.bookSlug, chapter));
  const previous = getAdjacentChapter(params.bookSlug, chapter, 'previous');
  const next = getAdjacentChapter(params.bookSlug, chapter, 'next');
  const returnPath = `/bible/${params.bookSlug}/${chapter}`;

  return (
    <div className="section-grid">
      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Reading</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))]">{data.label}</h1>
            <p className="mt-4 text-base leading-8 text-[color:rgb(var(--muted-strong))]">
              {isSharedProfile
                ? 'Read slowly and keep track of what you have finished together.'
                : 'Read slowly, save notes, and keep track of what you have finished.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/bible/${params.bookSlug}`} className="soft-button">All chapters</Link>
            {previous ? <Link href={`/bible/${previous.bookSlug}/${previous.chapter}`} className="soft-button">Previous chapter</Link> : null}
            {next ? <Link href={`/bible/${next.bookSlug}/${next.chapter}`} className="soft-button">Next chapter</Link> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr] 2xl:grid-cols-[1.45fr_0.55fr]">
        <article className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
          <ScripturePassages passages={passages} />
        </article>
        <aside className="panel-shell flex h-full flex-col rounded-[36px] px-6 py-7 sm:px-8">
          {isSharedProfile ? (
            <>
              <p className="eyebrow">Read Together</p>
              <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">Keep shared progress simple</h2>
              <p className="mt-6 text-base leading-8 text-[color:rgb(var(--muted-strong))]">
                This shared profile only tracks chapters and books completed together.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <form action={markChapterRead}>
                  <input type="hidden" name="bookSlug" value={params.bookSlug} />
                  <input type="hidden" name="chapter" value={chapter} />
                  <input type="hidden" name="returnPath" value={returnPath} />
                  <SubmitButton pendingLabel="Saving..." variant="secondary">
                    {data.progress ? 'Read again today' : 'Mark as read together'}
                  </SubmitButton>
                </form>
                {data.progress ? (
                  <form action={markChapterUnread}>
                    <input type="hidden" name="bookSlug" value={params.bookSlug} />
                    <input type="hidden" name="chapter" value={chapter} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <SubmitButton pendingLabel="Saving..." variant="secondary">
                      Mark unread
                    </SubmitButton>
                  </form>
                ) : null}
              </div>
            </>
          ) : (
            <>
              <p className="eyebrow">Chapter Note</p>
              <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">Write in the margin</h2>
              <div className="mt-6">
                <ReflectionPrompts />
              </div>
              <form action={saveChapterNote} className="mt-6 flex flex-1 min-h-0 flex-col gap-4">
                <input type="hidden" name="bookSlug" value={params.bookSlug} />
                <input type="hidden" name="chapter" value={chapter} />
                <input type="hidden" name="returnPath" value={returnPath} />
                <Textarea
                  name="content"
                  defaultValue={data.note?.content ?? ''}
                  placeholder="Record insights, observations, questions, or a short prayer in response to this chapter."
                  autoResize
                  className="min-h-[280px] flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(248,243,232,0.9))] xl:max-h-full"
                />
                <SubmitButton pendingLabel="Saving note...">Save note</SubmitButton>
              </form>
              <div className="mt-4 flex flex-wrap gap-3">
                <form action={markChapterRead}>
                  <input type="hidden" name="bookSlug" value={params.bookSlug} />
                  <input type="hidden" name="chapter" value={chapter} />
                  <input type="hidden" name="returnPath" value={returnPath} />
                  <SubmitButton pendingLabel="Saving..." variant="secondary">
                    {data.progress ? 'Read again today' : 'Mark as read'}
                  </SubmitButton>
                </form>
                {data.progress ? (
                  <form action={markChapterUnread}>
                    <input type="hidden" name="bookSlug" value={params.bookSlug} />
                    <input type="hidden" name="chapter" value={chapter} />
                    <input type="hidden" name="returnPath" value={returnPath} />
                    <SubmitButton pendingLabel="Saving..." variant="secondary">
                      Mark unread
                    </SubmitButton>
                  </form>
                ) : null}
                <form action={toggleBookmark}>
                  <input type="hidden" name="bookSlug" value={params.bookSlug} />
                  <input type="hidden" name="chapter" value={chapter} />
                  <input type="hidden" name="returnPath" value={returnPath} />
                  <SubmitButton pendingLabel="Saving..." variant="secondary">
                    {data.bookmark ? 'Remove bookmark' : 'Bookmark'}
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