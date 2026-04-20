'use client';

import { useRef } from 'react';
import { updateScriptureFontScale } from '@/app/actions';
import { Select } from '@/components/ui/select';

const SCALE_OPTIONS = [70, 80, 90, 100, 115, 130, 150] as const;

export function ScriptureFontScaleControl({ currentValue, returnPath }: { currentValue: number; returnPath: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateScriptureFontScale} className="rounded-[24px] border border-[color:rgba(var(--accent-rgb),0.14)] bg-white/45 p-4 sm:p-5">
      <input type="hidden" name="returnPath" value={returnPath} />
      <div className="flex flex-col gap-2">
        <label htmlFor="scripture-font-scale" className="eyebrow">
          Scripture Size
        </label>
        <div className="flex items-center gap-3">
          <Select
            id="scripture-font-scale"
            name="scriptureFontScale"
            defaultValue={String(currentValue)}
            onChange={() => formRef.current?.requestSubmit()}
            className="rounded-full bg-white/80 py-2.5 text-base shadow-none"
          >
            {SCALE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </Select>
          <span className="shrink-0 text-sm font-semibold text-[color:rgb(var(--muted-strong))]">Current: {currentValue}%</span>
        </div>
      </div>
    </form>
  );
}