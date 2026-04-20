import 'server-only';

import { cookies } from 'next/headers';
import { DEFAULT_APP_USER } from '@/lib/app-users';

export const CURRENT_USER_COOKIE = 'twg-current-user';

export function getCurrentUser() {
  const stored = cookies().get(CURRENT_USER_COOKIE)?.value;
  if (stored === 'KELLY') {
    return 'KELLY';
  }

  if (stored === 'ANDY_AND_KELLY') {
    return 'ANDY_AND_KELLY';
  }

  return DEFAULT_APP_USER;
}