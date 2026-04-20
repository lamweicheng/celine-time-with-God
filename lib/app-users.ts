import { type AppUser } from '@prisma/client';

export const DEFAULT_APP_USER: AppUser = 'CELINE';

export const APP_USERS: Array<{ value: AppUser; label: string }> = [
  { value: 'CELINE', label: 'Celine' }
];

export function getUserLabel(user: AppUser) {
  return APP_USERS.find((item) => item.value === user)?.label ?? user;
}

export function isSharedUser(user: AppUser) {
  void user;
  return false;
}