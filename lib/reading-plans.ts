import type { DevotionPlan } from '@prisma/client';
import { getDayOfYearInTimeZone } from '@/lib/date-utils';
import { expandBooks, getReferenceLabel, listAllChapters, type ChapterReference } from '@/lib/bible';

export const DEVOTION_PLAN_OPTIONS: Array<{ value: DevotionPlan; label: string; description: string }> = [
  {
    value: 'FOUNDATIONS',
    label: 'Foundations',
    description: 'A steady path through core gospel, wisdom, and discipleship passages.'
  },
  {
    value: 'GOSPELS_AND_PSALMS',
    label: 'Gospels and Psalms',
    description: 'A devotional rhythm of Christ-centered reading paired with prayerful psalms.'
  },
  {
    value: 'WHOLE_BIBLE_YEAR',
    label: 'Whole Bible Year',
    description: 'A steady one-chapter rhythm through the full Bible in canonical order.'
  }
];

function groupReferences(references: ChapterReference[], groupSize: number) {
  const groups: ChapterReference[][] = [];

  for (let index = 0; index < references.length; index += groupSize) {
    groups.push(references.slice(index, index + groupSize));
  }

  return groups;
}

function interleave(primary: ChapterReference[], secondary: ChapterReference[]) {
  const result: ChapterReference[] = [];
  const maxLength = Math.max(primary.length, secondary.length);

  for (let index = 0; index < maxLength; index += 1) {
    if (primary[index]) {
      result.push(primary[index]);
    }

    if (secondary[index]) {
      result.push(secondary[index]);
    }
  }

  return result;
}

const planMap: Record<DevotionPlan, ChapterReference[][]> = {
  FOUNDATIONS: groupReferences(
    expandBooks(['john', 'mark', 'luke', 'acts', 'romans', 'james', 'psalms', 'proverbs']),
    1
  ),
  GOSPELS_AND_PSALMS: groupReferences(
    interleave(expandBooks(['matthew', 'mark', 'luke', 'john']), expandBooks(['psalms'])),
    1
  ),
  WHOLE_BIBLE_YEAR: groupReferences(listAllChapters(), 1)
};

export function getDayOfYear(value = new Date(), timeZone?: string | null) {
  return getDayOfYearInTimeZone(value, timeZone);
}

export function getTodaysDevotion(plan: DevotionPlan, date = new Date(), timeZone?: string | null) {
  const references = planMap[plan];
  const index = (getDayOfYear(date, timeZone) - 1 + references.length) % references.length;
  const todaysReading = references[index] ?? references[0] ?? [];

  return {
    plan,
    references: todaysReading,
    title: DEVOTION_PLAN_OPTIONS.find((option) => option.value === plan)?.label ?? 'Daily Devotion',
    description:
      DEVOTION_PLAN_OPTIONS.find((option) => option.value === plan)?.description ?? 'Today\'s assigned reading.',
    labels: todaysReading.map((reference) => getReferenceLabel(reference.bookSlug, reference.chapter))
  };
}