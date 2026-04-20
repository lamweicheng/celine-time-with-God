import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';
import { isSharedUser } from '@/lib/app-users';
import { getLandingPath, getSettings } from '@/lib/data';

export default async function Page() {
  noStore();
  const settings = await getSettings();

  if (isSharedUser(settings.activeUser)) {
    redirect('/bible');
  }

  redirect(getLandingPath(settings.preferredLandingPage));
}