import type { Metadata } from 'next';
import { Cormorant_Garamond, Source_Serif_4 } from 'next/font/google';
import { SiteShell } from '@/components/SiteShell';
import { getSettings } from '@/lib/data';
import './globals.css';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700']
});

const bodyFont = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600']
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Time with God',
  description: 'A peaceful Christian web app for Bible reading, reflection, prayer journaling, and reading progress.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png'
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" className={`${display.variable} ${bodyFont.variable}`}>
      <body>
        <SiteShell settings={settings}>{children}</SiteShell>
      </body>
    </html>
  );
}
