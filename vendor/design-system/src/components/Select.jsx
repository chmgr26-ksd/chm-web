import React from 'react';
import { cn } from '../lib/cn.js';

/** Select — 네이티브 드롭다운. options: [{value,label}] 또는 children. */
export const Select = React.forwardRef(function Select(
  { size = 'md', invalid = false, options, disabled, className, children, ...props },
  ref
) {
  const height = { sm: 'h-8 text-body-sm rounded-chm-sm', md: 'h-10 text-body rounded-chm-md', lg: 'h-12 text-body-lg rounded-chm-lg' }[size];
  return (
    <div className={cn('relative inline-flex w-full', className)}>
      <select
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          'w-full appearance-none bg-surface border pl-3 pr-9 text-ink-800',
          'transition-colors duration-chm ease-chm focus:outline-none focus:ring-2 focus:ring-trust-300 focus:border-trust-500',
          height,
          invalid ? 'border-danger' : 'border-border',
          disabled && 'opacity-50 bg-surface-muted pointer-events-none'
        )}
        {...props}
      >
        {options ? options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>) : children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-500" aria-hidden>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
    </div>
  );
});

export default Select;
