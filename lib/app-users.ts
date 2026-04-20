import { type AppUser } from '@prisma/client';

export const DEFAULT_APP_USER: AppUser = 'ANDY';
export const SHARED_APP_USER: AppUser = 'ANDY_AND_KELLY';

export const APP_USERS: Array<{ value: AppUser; label: string }> = [
  { value: 'ANDY', label: 'Andy' },
  { value: 'KELLY', label: 'Kelly' },
  { value: 'ANDY_AND_KELLY', label: 'Andy & Kelly' }
];

export function getUserLabel(user: AppUser) {
  return APP_USERS.find((item) => item.value === user)?.label ?? user;
}

export function isSharedUser(user: AppUser) {
  return user === SHARED_APP_USER;
}