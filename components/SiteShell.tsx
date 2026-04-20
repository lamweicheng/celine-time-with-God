'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import type { AppSettings } from '@prisma/client';
import { AmbiencePlayer, type AmbiencePlayerHandle } from '@/components/AmbiencePlayer';
import { ProfileSwitchNotice } from '@/components/ProfileSwitchNotice';
import { WelcomeOverlay } from '@/components/WelcomeOverlay';
import { UserProfileSwitcher } from '@/components/UserProfileSwitcher';
import { isSharedUser } from '@/lib/app-users';
import { getYoutubeVideoConfig } from '@/lib/ambience';
import { cn } from '@/lib/utils';

const navigation = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/devotion', label: 'Daily Devotion' },
  { href: '/bible', label: 'Read the Bible' },
  { href: '/journal', label: 'Prayer Journal' },
  { href: '/progress', label: 'Progress' },
  { href: '/settings', label: 'Settings' }
];

export function SiteShell({ children, settings }: { children: React.ReactNode; settings: AppSettings & { activeUser: 'ANDY' | 'KELLY' | 'ANDY_AND_KELLY' } }) {
  const pathname = usePathname();
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState(false);
  const ambiencePlayerRef = useRef<AmbiencePlayerHandle | null>(null);
  const visibleNavigation = isSharedUser(settings.activeUser)
    ? navigation.filter((item) => ['/bible', '/progress', '/settings'].includes(item.href))
    : navigation;

  const youtubeConfig = useMemo(() => getYoutubeVideoConfig(settings.ambienceYoutubeUrl), [settings.ambienceYoutubeUrl]);

  function toggleAmbience() {
    setIsAmbiencePlaying((current) => {
      const next = !current;

      if (next) {
        ambiencePlayerRef.current?.play();
      } else {
        ambiencePlayerRef.current?.pause();
      }

      return next;
    });
  }

  return (
    <div
      data-theme={settings.readingTheme.toLowerCase()}
      style={{
        ['--font-scale' as string]: `${settings.fontScale / 100}`,
        ['--type-small' as string]: `calc(0.95rem * ${settings.fontScale / 100})`,
        ['--type-medium' as string]: `calc(1.2rem * ${settings.fontScale / 100})`,
        ['--type-large-min' as string]: `calc(1.6rem * ${settings.fontScale / 100})`,
        ['--type-large-fluid' as string]: `calc(2.6vw * ${settings.fontScale / 100})`,
        ['--type-large-max' as string]: `calc(2.4rem * ${settings.fontScale / 100})`,
        ['--scripture-font-scale' as string]: `${settings.scriptureFontScale / 100}`
      }}
    >
      <ProfileSwitchNotice />
      <WelcomeOverlay
        onToggleAmbience={() => {
          void toggleAmbience();
        }}
        isAmbiencePlaying={isAmbiencePlaying}
        ambienceEnabled={settings.ambienceEnabled}
      />
      <div className="relative min-h-screen overflow-hidden bg-[color:rgb(var(--background))] text-[color:rgb(var(--foreground))]">
        {youtubeConfig ? (
          <AmbiencePlayer
            ref={ambiencePlayerRef}
            videoId={youtubeConfig.videoId}
            startSeconds={youtubeConfig.startSeconds}
            volume={settings.ambienceVolume}
            isPlaying={isAmbiencePlaying}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(var(--accent-rgb),0.14),transparent_30%),radial-gradient(circle_at_85%_0%,rgba(255,255,255,0.6),transparent_24%),linear-gradient(180deg,transparent,rgba(255,255,255,0.18))]" />
        <div className="relative mx-auto flex min-h-screen max-w-[110rem] flex-col px-3 pb-10 pt-4 sm:px-4 sm:pt-5 lg:px-5">
          <header className="panel-shell sticky top-3 z-30 mb-5 rounded-[28px] px-4 py-4 backdrop-blur-xl sm:top-4 sm:mb-6 sm:px-5">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-x-5">
              <div className="flex flex-col gap-3">
                <Link href="/dashboard" className="font-display text-2xl text-[color:rgb(var(--foreground-strong))] sm:text-3xl">
                  Time with God
                </Link>
                <p className="text-sm text-[color:rgb(var(--muted-strong))]">
                  Read Scripture, reflect slowly, pray honestly, and keep steady progress.
                </p>
                <nav className="flex flex-wrap gap-2">
                  {visibleNavigation.map((item) => {
                    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'rounded-full px-3 py-2 text-xs transition sm:px-4 sm:text-sm',
                          active
                            ? 'bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))] shadow-[0_16px_24px_rgba(var(--accent-rgb),0.24)]'
                            : 'bg-white/55 text-[color:rgb(var(--foreground))] hover:bg-white/80'
                        )}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="flex flex-col gap-2 sm:items-end sm:justify-start sm:gap-3">
                <UserProfileSwitcher currentUser={settings.activeUser} />
                <button type="button" onClick={() => void toggleAmbience()} className="soft-button w-full self-start text-[0.68rem] uppercase tracking-[0.18em] sm:w-auto sm:self-end sm:text-xs">
                  {isAmbiencePlaying ? 'Pause ambience' : 'Play ambience'}
                </button>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-8 px-2 text-center text-sm text-[color:rgb(var(--muted))]">
            Draw near to God, and He will draw near to you. James 4:8
          </footer>
        </div>
      </div>
    </div>
  );
}