import { unstable_noStore as noStore } from 'next/cache';
import { savePrayerEntry } from '@/app/actions';
import { PrayerEntryModalList } from '@/components/PrayerEntryModalList';
import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { isSharedUser } from '@/lib/app-users';
import { getJournalEntries, getSettings } from '@/lib/data';
import { getRequestTimeZone } from '@/lib/request-timezone';
import { toDateInputValue } from '@/lib/utils';

const journalTypes = [
  { value: 'PRAYER_REQUEST', label: 'Prayer Request' },
  { value: 'GRATITUDE', label: 'Gratitude' },
  { value: 'ANSWERED_PRAYER', label: 'Answered Prayer' },
  { value: 'REFLECTION', label: 'Reflection' }
] as const;

export default async function JournalPage() {
  noStore();
  const [entries, settings] = await Promise.all([getJournalEntries(), getSettings()]);
  const timeZone = getRequestTimeZone();

  if (isSharedUser(settings.activeUser)) {
    return <div className="stat-card text-base leading-8 text-[color:rgb(var(--muted-strong))]">Andy & Kelly mode does not include prayer tracking or note keeping. Use Progress to see how many chapters and books you have read together.</div>;
  }

  const prayerRequestCount = entries.filter((entry) => entry.type === 'PRAYER_REQUEST').length;
  const answeredCount = entries.filter((entry) => entry.type === 'ANSWERED_PRAYER').length;
  const totalEntries = entries.length;
  const serializedEntries = entries.map((entry) => ({
    id: entry.id,
    type: entry.type,
    title: entry.title,
    content: entry.content,
    entryDate: toDateInputValue(entry.entryDate, timeZone)
  }));

  return (
    <div className="section-grid">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="stat-card">
          <p className="eyebrow">Prayer Requests</p>
          <p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{prayerRequestCount}</p>
          <p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">requests you have written down to revisit in prayer</p>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Answered Prayers</p>
          <p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{answeredCount}</p>
          <p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">testimonies you can revisit with gratitude</p>
        </div>
        <div className="stat-card">
          <p className="eyebrow">Entries</p>
          <p className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{totalEntries}</p>
          <p className="mt-2 text-sm text-[color:rgb(var(--muted-strong))]">saved prayers, gratitudes, answers, and reflections</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
          <p className="eyebrow">Prayer Tracker</p>
          <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))]">Bring everything to God, and remember His answers.</h1>
          <p className="mt-4 text-base leading-8 text-[color:rgb(var(--muted-strong))]">
            Keep track of requests, gratitude, answers, reminders, and personal reflections with dated entries you can revisit over time.
          </p>

          <form action={savePrayerEntry} className="mt-6 space-y-4">
            <input type="hidden" name="returnPath" value="/journal" />
            <Select name="type" defaultValue="PRAYER_REQUEST">
              {journalTypes.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </Select>
            <Input name="title" placeholder="Optional title" />
            <Input name="entryDate" type="date" defaultValue={toDateInputValue(new Date(), timeZone)} required />
            <Textarea name="content" required placeholder="Write your prayer, reflection, gratitude, or testimony here." className="min-h-[240px] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(248,243,232,0.9))]" />
            <SubmitButton pendingLabel="Saving entry...">Save entry</SubmitButton>
          </form>
        </div>

        <div className="self-start xl:max-h-[calc(100vh-12rem)] xl:overflow-y-auto xl:pr-2">
          <PrayerEntryModalList entries={serializedEntries} />
        </div>
      </section>
    </div>
  );
}