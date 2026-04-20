"use client";
import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  autoResize?: boolean;
  autoResizeMaxHeight?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function TextareaImpl({ autoResize = false, autoResizeMaxHeight, className, onInput, style, ...props }, ref) {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    function assignRef(node: HTMLTextAreaElement | null) {
      innerRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    function resizeTextarea() {
      const node = innerRef.current;

      if (!node || !autoResize) {
        return;
      }

      node.style.height = 'auto';
      node.style.height = `${node.scrollHeight}px`;
    }

    useEffect(() => {
      resizeTextarea();
    });

    return (
      <textarea
        ref={assignRef}
        {...props}
        onInput={(event) => {
          resizeTextarea();
          onInput?.(event);
        }}
        style={
          autoResize
            ? {
                ...style,
                ...(autoResizeMaxHeight ? { maxHeight: autoResizeMaxHeight } : {}),
                overflowY: 'auto'
              }
            : style
        }
        className={
          'w-full min-h-[140px] rounded-[24px] border border-[color:rgb(var(--border-soft))] bg-[color:rgb(var(--panel))] px-4 py-4 text-sm leading-7 text-[color:rgb(var(--foreground))] shadow-[0_18px_40px_rgba(32,43,29,0.08)] outline-none transition placeholder:text-[color:rgb(var(--muted))] focus:border-[color:rgb(var(--accent))] focus:ring-2 focus:ring-[color:rgba(var(--accent-rgb),0.18)] ' +
          (autoResize ? 'resize-none ' : '') +
          (className ?? '')
        }
      />
    );
  }
);
