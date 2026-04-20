'use client';

import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';

export function SubmitButton({
  children,
  className,
  pendingLabel = 'Saving...',
  variant = 'primary'
}: {
  children: React.ReactNode;
  className?: string;
  pendingLabel?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
        variant === 'primary' &&
          'bg-[color:rgb(var(--accent))] text-[color:rgb(var(--accent-foreground))] shadow-[0_16px_30px_rgba(var(--accent-rgb),0.28)] hover:translate-y-[-1px]',
        variant === 'secondary' &&
          'border border-[color:rgb(var(--border-soft))] bg-[color:rgb(var(--panel))] text-[color:rgb(var(--foreground))] hover:bg-[color:rgb(var(--panel-strong))]',
        variant === 'ghost' && 'text-[color:rgb(var(--foreground))] hover:bg-[color:rgba(var(--accent-rgb),0.08)]',
        variant === 'danger' && 'bg-[rgb(137,67,55)] text-white hover:bg-[rgb(120,55,44)]',
        className
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}