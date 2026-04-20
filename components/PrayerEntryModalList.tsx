'use client';

import { useEffect, useState } from 'react';
import { deletePrayerEntry, savePrayerEntry } from '@/app/actions';
import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn, formatDateLabel, toDateInputValue } from '@/lib/utils';

const journalTypes = [
  { value: 'PRAYER_REQUEST', label: 'Prayer Request' },
  { value: 'GRATITUDE', label: 'Gratitude' },
  { value: 'ANSWERED_PRAYER', label: 'Answered Prayer' },
  { value: 'REFLECTION', label: 'Reflection' }
] as const;

type PrayerEntryListItem = {
  id: string;
  type: 'PRAYER_REQUEST' | 'GRATITUDE' | 'ANSWERED_PRAYER' | 'REFLECTION';
  title: string | null;
  content: string;
  entryDate: string;
};

export function PrayerEntryModalList({ entries }: { entries: PrayerEntryListItem[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedEntry = entries.find((entry) => entry.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedEntry) {
      return;
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setSelectedId(null);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedEntry]);

  if (entries.length === 0) {
    return (
      <div className="stat-card text-base leading-8 text-[color:rgb(var(--muted-strong))]">
        No prayer journal entries yet. Your dated entries will appear here once you begin writing.
      </div>
    );
  }

  return (
    <>
      <div className="section-grid">
        {entries.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setSelectedId(entry.id)}
            className={cn(
              'stat-card w-full text-left transition hover:translate-y-[-2px] hover:shadow-[0_24px_55px_rgba(26,31,25,0.12)]',
              selectedId === entry.id && 'ring-2 ring-[color:rgba(var(--accent-rgb),0.24)]'
            )}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="eyebrow">{entry.type.split('_').join(' ')}</p>
                <h2 className="mt-2 text-xl font-semibold text-[color:rgb(var(--foreground-strong))]">{entry.title || 'Untitled entry'}</h2>
                <p className="mt-2 text-sm text-[color:rgb(var(--muted))]">{formatDateLabel(entry.entryDate)}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedEntry ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(26,31,25,0.42)] px-4 py-8 backdrop-blur-md" role="dialog" aria-modal="true">
          <div className="modal-shell relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[36px] px-6 py-7 sm:px-8">
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              className="soft-button absolute right-5 top-5 px-4 py-2 text-xs uppercase tracking-[0.18em]"
            >
              Close
            </button>

            <div className="pr-24">
              <p className="eyebrow">{selectedEntry.type.split('_').join(' ')}</p>
              <h2 className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{selectedEntry.title || 'Untitled entry'}</h2>
              <p className="mt-2 text-sm text-[color:rgb(var(--muted))]">{formatDateLabel(selectedEntry.entryDate)}</p>
            </div>

            <p className="mt-5 rounded-[24px] bg-white/45 p-4 text-base leading-8 text-[color:rgb(var(--foreground))]">{selectedEntry.content}</p>

            <form action={savePrayerEntry} className="mt-6 space-y-4 border-t border-[color:rgb(var(--border-soft))] pt-5">
              <input type="hidden" name="id" value={selectedEntry.id} />
              <input type="hidden" name="returnPath" value="/journal" />
              <Select name="type" defaultValue={selectedEntry.type}>
                {journalTypes.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </Select>
              <Input name="title" defaultValue={selectedEntry.title ?? ''} placeholder="Optional title" />
              <Input name="entryDate" type="date" defaultValue={toDateInputValue(selectedEntry.entryDate)} required />
              <Textarea name="content" required defaultValue={selectedEntry.content} className="min-h-[220px] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(248,243,232,0.9))]" />
              <div className="flex flex-wrap gap-3">
                <SubmitButton pendingLabel="Updating..." variant="secondary">Update entry</SubmitButton>
              </div>
            </form>

            <form action={deletePrayerEntry} className="mt-3">
              <input type="hidden" name="id" value={selectedEntry.id} />
              <input type="hidden" name="returnPath" value="/journal" />
              <SubmitButton pendingLabel="Deleting..." variant="danger">Delete entry</SubmitButton>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}