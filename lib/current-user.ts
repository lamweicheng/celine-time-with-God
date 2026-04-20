import 'server-only';

import { DEFAULT_APP_USER } from '@/lib/app-users';

export const CURRENT_USER_COOKIE = 'twg-current-user';

export function getCurrentUser() {
  return DEFAULT_APP_USER;
}