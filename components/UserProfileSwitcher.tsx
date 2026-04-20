'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import type { AppUser } from '@prisma/client';
import { setActiveUser } from '@/app/actions';
import { APP_USERS } from '@/lib/app-users';

export function UserProfileSwitcher({ currentUser }: { currentUser: AppUser }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const returnPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  return (
    <form action={setActiveUser}>
      <input type="hidden" name="returnPath" value={returnPath} />
      <select
        aria-label="Choose active user"
        name="user"
        defaultValue={currentUser}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="w-full min-w-[8.5rem] rounded-[20px] border border-[color:rgb(var(--border-soft))] bg-[color:rgb(var(--panel))] px-3 py-3 text-sm text-[color:rgb(var(--foreground))] shadow-[0_12px_30px_rgba(32,43,29,0.08)] outline-none transition focus:border-[color:rgb(var(--accent))] focus:ring-2 focus:ring-[color:rgba(var(--accent-rgb),0.18)]"
      >
        {APP_USERS.map((user) => (
          <option key={user.value} value={user.value}>{user.label}</option>
        ))}
      </select>
    </form>
  );
}