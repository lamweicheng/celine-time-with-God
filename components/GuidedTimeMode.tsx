'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { markChapterRead, markChapterUnread, saveChapterNote, savePrayerEntry } from '@/app/actions';
import { ReflectionPrompts } from '@/components/ReflectionPrompts';
import { ScripturePassages } from '@/components/ScripturePassages';
import { SubmitButton } from '@/components/SubmitButton';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toDateInputValue } from '@/lib/utils';
import type { ScripturePassage } from '@/lib/scripture-types';

type GuidedTimeModeProps = {
  label: string;
  passages: ScripturePassage[];
  noteContent: string;
  bookSlug: string;
  chapter: number;
  returnPath: string;
};

const stages = [
  { key: 'still', title: 'Be still', summary: 'Take a minute to quiet your heart before you read.' },
  { key: 'scripture', title: 'Scripture reading', summary: 'Read the passage selected for today.' },
  { key: 'reflect', title: 'Reflection', summary: 'Notice what stands out and write it down.' },
  { key: 'pray', title: 'Prayer', summary: 'Bring what you read back to God in prayer.' },
  { key: 'close', title: 'Closing', summary: 'Finish with gratitude and one next step.' }
] as const;

export function GuidedTimeMode(props: GuidedTimeModeProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning || currentStage !== 0 || secondsLeft === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [currentStage, secondsLeft, timerRunning]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setTimerRunning(false);
    }
  }, [secondsLeft]);

  const stage = stages[currentStage];

  return (
    <div className="section-grid">
      <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(20rem,30rem)_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="eyebrow">Guided Time With God</p>
            <h1 className="mt-3 font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))]">{stage.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[color:rgb(var(--muted-strong))]">{stage.summary}</p>
          </div>
          <div className="overflow-x-auto lg:justify-self-end lg:self-start">
            <div className="flex min-w-max flex-nowrap gap-2 pb-1">
            {stages.map((item, index) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setCurrentStage(index)}
                className={index === currentStage ? 'soft-button shrink-0 bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]' : 'soft-button shrink-0'}
              >
                {index + 1}. {item.title}
              </button>
            ))}
            </div>
          </div>
        </div>
      </section>

      {currentStage === 0 ? (
        <section className="panel-shell rounded-[36px] px-6 py-7 text-center sm:px-8">
          <p className="eyebrow">Stillness</p>
          <h2 className="mt-3 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">Psalm 46:10</h2>
          <p className="mt-4 text-lg leading-8 text-[color:rgb(var(--foreground))]">“Be still, and know that I am God.”</p>
          <div className="mt-8 font-display text-6xl text-[color:rgb(var(--foreground-strong))]">{formatTimer(secondsLeft)}</div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setTimerRunning((value) => !value)} className="soft-button bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]">
              {timerRunning ? 'Pause timer' : 'Start timer'}
            </button>
            <button type="button" onClick={() => { setSecondsLeft(60); setTimerRunning(false); }} className="soft-button">
              Reset
            </button>
            <button type="button" onClick={() => setCurrentStage(1)} className="soft-button">
              Continue
            </button>
          </div>
        </section>
      ) : null}

      {currentStage === 1 ? (
        <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
          <p className="eyebrow">Today&apos;s reading</p>
          <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">{props.label}</h2>
          <ScripturePassages passages={props.passages} className="mt-6" />
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={() => setCurrentStage(2)} className="soft-button bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]">
              Move to reflection
            </button>
            <Link href={`/bible/${props.bookSlug}/${props.chapter}`} className="soft-button">
              Open full reading page
            </Link>
          </div>
        </section>
      ) : null}

      {currentStage === 2 ? (
        <section className="grid gap-4 xl:grid-cols-[0.7fr_1.3fr]">
          <div className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
            <ReflectionPrompts />
          </div>
          <div className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
            <p className="eyebrow">Write your reflection</p>
            <form action={saveChapterNote} className="mt-6 space-y-4">
              <input type="hidden" name="bookSlug" value={props.bookSlug} />
              <input type="hidden" name="chapter" value={props.chapter} />
              <input type="hidden" name="returnPath" value={props.returnPath} />
              <Textarea
                name="content"
                defaultValue={props.noteContent}
                placeholder="Write what stands out, what God is teaching you, and how you want to respond today."
                autoResize
                autoResizeMaxHeight="62vh"
                className="min-h-[260px] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(248,243,232,0.9))]"
              />
              <div className="flex flex-wrap gap-3">
                <SubmitButton pendingLabel="Saving note...">Save reflection</SubmitButton>
                <button type="button" onClick={() => setCurrentStage(3)} className="soft-button">
                  Continue to prayer
                </button>
              </div>
            </form>
          </div>
        </section>
      ) : null}

      {currentStage === 3 ? (
        <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
          <p className="eyebrow">Prayer</p>
          <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">Turn the passage into prayer</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[color:rgb(var(--muted-strong))]">Ask for help, confess sin, thank God, or write down an ongoing request with a reminder to revisit it.</p>
          <form action={savePrayerEntry} className="mt-6 space-y-4">
            <input type="hidden" name="returnPath" value={props.returnPath} />
            <input type="hidden" name="entryDate" value={toDateInputValue(new Date())} />
            <Select name="type" defaultValue="PRAYER_REQUEST">
              <option value="PRAYER_REQUEST">Prayer Request</option>
              <option value="GRATITUDE">Gratitude</option>
              <option value="ANSWERED_PRAYER">Answered Prayer</option>
              <option value="REFLECTION">Reflection</option>
            </Select>
            <Input name="title" defaultValue={props.label} placeholder="Optional title" />
            <Textarea name="content" placeholder="Lord, help me respond to Your Word today..." className="min-h-[220px] bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(248,243,232,0.9))]" />
            <div className="flex flex-wrap gap-3">
              <SubmitButton pendingLabel="Saving prayer...">Save prayer</SubmitButton>
              <button type="button" onClick={() => setCurrentStage(4)} className="soft-button">
                Continue to closing
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {currentStage === 4 ? (
        <section className="panel-shell rounded-[36px] px-6 py-7 sm:px-8">
          <p className="eyebrow">Closing</p>
          <h2 className="mt-2 font-display text-4xl text-[color:rgb(var(--foreground-strong))]">Finish with one clear response.</h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-[color:rgb(var(--muted-strong))]">
            Give thanks for what you saw in Scripture. Carry one verse or one act of obedience with you into the rest of the day.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <form action={markChapterRead}>
              <input type="hidden" name="bookSlug" value={props.bookSlug} />
              <input type="hidden" name="chapter" value={props.chapter} />
              <input type="hidden" name="returnPath" value={props.returnPath} />
              <SubmitButton pendingLabel="Saving...">Mark today&apos;s reading complete</SubmitButton>
            </form>
            <form action={markChapterUnread}>
              <input type="hidden" name="bookSlug" value={props.bookSlug} />
              <input type="hidden" name="chapter" value={props.chapter} />
              <input type="hidden" name="returnPath" value={props.returnPath} />
              <SubmitButton pendingLabel="Saving..." variant="secondary">Mark unread</SubmitButton>
            </form>
            <Link href="/journal" className="soft-button">Open prayer tracker</Link>
            <button type="button" onClick={() => setCurrentStage(0)} className="soft-button">Start again tomorrow</button>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}