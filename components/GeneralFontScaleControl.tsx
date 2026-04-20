'use client';

import { useRef } from 'react';
import { updateGeneralFontScale } from '@/app/actions';
import { Select } from '@/components/ui/select';

const SCALE_OPTIONS = [70, 80, 90, 100, 110, 120, 130, 140] as const;

export function GeneralFontScaleControl({ currentValue, returnPath }: { currentValue: number; returnPath: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={updateGeneralFontScale} className="rounded-[24px] border border-[color:rgba(var(--accent-rgb),0.14)] bg-white/45 p-4 sm:p-5">
      <input type="hidden" name="returnPath" value={returnPath} />
      <div className="flex flex-col gap-2">
        <label htmlFor="general-font-scale" className="eyebrow">
          General Font Size
        </label>
        <div className="flex items-center gap-3">
          <Select
            id="general-font-scale"
            name="fontScale"
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