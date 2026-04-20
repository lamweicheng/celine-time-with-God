'use client';

import type { ScripturePassage } from '@/lib/scripture-types';
import { cn } from '@/lib/utils';

export function ScripturePassages({ passages, className }: { passages: ScripturePassage[]; className?: string }) {
  return (
    <div className={cn(passages.length > 1 ? 'grid gap-4 xl:grid-cols-2' : 'grid gap-4', className)}>
      {passages.map((passage) => (
        <section key={passage.id} className="flex h-full flex-col rounded-[28px] bg-white/45 p-5 sm:p-6">
          <p className="eyebrow">{passage.label}</p>
          <div className="scripture-text mt-4 whitespace-pre-line">
            {passage.text ?? passage.error ?? 'Unable to load this passage.'}
          </div>
          <div className="mt-auto pt-4 text-xs text-[color:rgb(var(--muted))]">
            <div className="flex items-center gap-3">
              <details>
                <summary className="cursor-pointer list-none underline decoration-[rgba(var(--accent-rgb),0.35)] underline-offset-4 transition hover:text-[color:rgb(var(--foreground))]">
                  Details
                </summary>
                <p className="mt-3 max-w-prose leading-6">{passage.attribution}</p>
              </details>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}