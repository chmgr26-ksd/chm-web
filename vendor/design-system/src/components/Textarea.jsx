import React from 'react';
import { cn } from '../lib/cn.js';

/** Textarea — 여러 줄 텍스트 입력. */
export const Textarea = React.forwardRef(function Textarea(
  { invalid = false, rows = 4, disabled, className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-chm-md border bg-surface px-3 py-2 text-body text-ink-800',
        'placeholder:text-ink-400 transition-colors duration-chm ease-chm resize-y',
        'focus:outline-none focus:ring-2 focus:ring-trust-300 focus:border-trust-500',
        invalid ? 'border-danger focus:ring-danger/30 focus:border-danger' : 'border-border',
        disabled && 'opacity-50 bg-surface-muted pointer-events-none',
        className
      )}
      {...props}
    />
  );
});

export default Textarea;
