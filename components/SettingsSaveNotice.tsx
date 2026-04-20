'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function isSettingsStatus(value: string | null): value is 'saved' | 'unavailable' {
  return value === 'saved' || value === 'unavailable';
}

export function SettingsSaveNotice() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const settingsStatus = searchParams.get('settingsStatus');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isSettingsStatus(settingsStatus)) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const timeout = window.setTimeout(() => {
      setIsVisible(false);

      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete('settingsStatus');
      const nextPath = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
      router.replace(nextPath, { scroll: false });
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, settingsStatus]);

  if (!isVisible || !isSettingsStatus(settingsStatus)) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[80] max-w-sm px-4">
      <div
        className={
          'rounded-[22px] border px-5 py-3 text-sm shadow-[0_24px_60px_rgba(26,31,25,0.16)] backdrop-blur-md ' +
          (settingsStatus === 'saved'
            ? 'border-white/45 bg-[color:rgba(248,243,232,0.96)] text-[color:rgb(var(--foreground-strong))]'
            : 'border-[rgba(137,67,55,0.24)] bg-[rgba(255,244,241,0.96)] text-[rgb(137,67,55)]')
        }
      >
        {settingsStatus === 'saved'
          ? 'Settings saved successfully.'
          : 'Settings could not be saved. Check your deployed database configuration and migrations.'}
      </div>
    </div>
  );
}