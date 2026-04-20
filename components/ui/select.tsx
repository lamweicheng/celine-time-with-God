"use client";
import { SelectHTMLAttributes, forwardRef } from 'react';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function SelectImpl(props, ref) {
    return (
      <select
        ref={ref}
        {...props}
        className={
          'w-full rounded-[20px] border border-[color:rgb(var(--border-soft))] bg-[color:rgb(var(--panel))] px-4 py-3 text-sm text-[color:rgb(var(--foreground))] shadow-[0_12px_30px_rgba(32,43,29,0.08)] outline-none transition focus:border-[color:rgb(var(--accent))] focus:ring-2 focus:ring-[color:rgba(var(--accent-rgb),0.18)] ' +
          (props.className ?? '')
        }
      />
    );
  }
);
