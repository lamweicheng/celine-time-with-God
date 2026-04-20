import { unstable_noStore as noStore } from 'next/cache';
import { GuidedTimeMode } from '@/components/GuidedTimeMode';
import { isSharedUser } from '@/lib/app-users';
import { getPassageQuery, getReferenceLabel } from '@/lib/bible';
import { getChapterPageData, getSettings } from '@/lib/data';
import { getRequestTimeZone } from '@/lib/request-timezone';
import { fetchScripturePassages } from '@/lib/scripture';
import { getTodaysDevotion } from '@/lib/reading-plans';

export default async function GuidedPage() {
  noStore();

  const settings = await getSettings();
  const timeZone = getRequestTimeZone();

  if (isSharedUser(settings.activeUser)) {
    return <div className="stat-card text-base leading-8 text-[color:rgb(var(--muted-strong))]">Shared reading mode is focused on reading progress only. Use Daily Devotion or Read the Bible to mark chapters read together.</div>;
  }

  const devotion = getTodaysDevotion(settings.dailyDevotionPlan, new Date(), timeZone);
  const reference = devotion.references[0];

  if (!reference) {
    return <div className="stat-card">No guided reading is available today.</div>;
  }

  const chapterData = await getChapterPageData(reference);
  const passages = await fetchScripturePassages(settings.scriptureDisplayMode, getPassageQuery(reference.bookSlug, reference.chapter));

  if (!chapterData) {
    return <div className="stat-card">Unable to load today&apos;s guided reading.</div>;
  }

  return (
    <GuidedTimeMode
      label={getReferenceLabel(reference.bookSlug, reference.chapter)}
      passages={passages}
      noteContent={chapterData.note?.content ?? ''}
      bookSlug={reference.bookSlug}
      chapter={reference.chapter}
      returnPath="/guided"
    />
  );
}