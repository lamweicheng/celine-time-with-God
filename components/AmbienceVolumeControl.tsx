'use client';

import { useState } from 'react';

export function AmbienceVolumeControl({ currentValue }: { currentValue: number }) {
  const [value, setValue] = useState(currentValue);

  return (
    <label className="space-y-3 md:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <span className="eyebrow">Ambience Volume</span>
        <span className="text-sm font-semibold text-[color:rgb(var(--muted-strong))]">{value}%</span>
      </div>
      <input
        name="ambienceVolume"
        type="range"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(event) => setValue(Number(event.currentTarget.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[rgba(var(--accent-rgb),0.16)] accent-[rgb(var(--accent))]"
      />
      <p className="text-sm leading-7 text-[color:rgb(var(--muted))]">
        This sets the starting volume whenever you play the ambient music.
      </p>
    </label>
  );
}