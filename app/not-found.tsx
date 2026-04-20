import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="panel-shell mx-auto flex max-w-2xl flex-col items-center rounded-[36px] px-8 py-14 text-center">
      <p className="eyebrow">Not Found</p>
      <h1 className="mt-4 font-display text-5xl text-[color:rgb(var(--foreground-strong))]">This page is not here.</h1>
      <p className="mt-4 max-w-lg text-base leading-8 text-[color:rgb(var(--muted-strong))]">
        The page you were looking for could not be found. Return to your reading space and continue where you left off.
      </p>
      <Link href="/dashboard" className="soft-button mt-8 bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))]">
        Go to dashboard
      </Link>
    </div>
  );
}
