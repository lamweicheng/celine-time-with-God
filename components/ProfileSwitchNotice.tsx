'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { AppUser } from '@prisma/client';
import { getUserLabel } from '@/lib/app-users';

function isAppUser(value: string | null): value is AppUser {
  return value === 'ANDY' || value === 'KELLY' || value === 'ANDY_AND_KELLY';
}

export function ProfileSwitchNotice() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const switchedUser = searchParams.get('switchedUser');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isAppUser(switchedUser)) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const timeout = window.setTimeout(() => {
      setIsVisible(false);

      const nextParams = new URLSearchParams(searchParams.toString());
      nextParams.delete('switchedUser');
      const nextPath = nextParams.toString() ? `${pathname}?${nextParams.toString()}` : pathname;
      router.replace(nextPath, { scroll: false });
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [pathname, router, searchParams, switchedUser]);

  if (!isVisible || !isAppUser(switchedUser)) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 px-4">
      <div className="rounded-full border border-white/45 bg-[color:rgba(248,243,232,0.96)] px-5 py-3 text-sm text-[color:rgb(var(--foreground-strong))] shadow-[0_24px_60px_rgba(26,31,25,0.16)] backdrop-blur-md">
        Changed to {getUserLabel(switchedUser)} successfully.
      </div>
    </div>
  );
}