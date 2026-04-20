'use client';

import { useState } from 'react';

export function WelcomeOverlay({
  onToggleAmbience,
  isAmbiencePlaying,
  ambienceEnabled
}: {
  onToggleAmbience: () => void;
  isAmbiencePlaying: boolean;
  ambienceEnabled: boolean;
}) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  const dismiss = () => {
    setIsVisible(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(26,31,25,0.58)] px-4 py-8 backdrop-blur-xl">
      <div className="panel-shell relative w-full max-w-3xl overflow-hidden rounded-[36px] border border-white/20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_44%),linear-gradient(180deg,rgba(252,248,239,0.96),rgba(245,239,227,0.92))] p-8 text-center shadow-[0_28px_90px_rgba(18,23,19,0.32)] sm:p-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <p className="eyebrow">Welcome</p>
          <h1 className="font-display text-5xl leading-none text-[color:rgb(var(--foreground-strong))] sm:text-7xl">
            Settle your heart before you read.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-8 text-[color:rgb(var(--muted-strong))] sm:text-lg">
            Take a slow breath. Lay down distractions. Ask the Lord for a willing mind, an attentive spirit,
            and grace to receive His Word with humility.
          </p>
          <div className="rounded-[28px] border border-white/40 bg-white/55 p-5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[color:rgb(var(--muted))]">Prayer Prompt</p>
            <p className="mt-3 text-base leading-8 text-[color:rgb(var(--foreground))]">
              Lord Jesus, quiet what is anxious in me. Open my eyes to behold wonderful things in Your Word,
              and form my heart to love what You love today.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button type="button" onClick={dismiss} className="soft-button min-w-[220px] bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]">
              Begin my time with God
            </button>
            <button type="button" onClick={dismiss} className="soft-button min-w-[180px]">
              Skip for now
            </button>
            <button type="button" onClick={onToggleAmbience} className="soft-button min-w-[220px]">
              {isAmbiencePlaying ? 'Pause ambience' : ambienceEnabled ? 'Play ambience' : 'Play calming sound'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}