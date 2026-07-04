import React from 'react';
import { cn } from '../lib/cn.js';

/** Checkbox — 라벨 포함 체크박스. */
export const Checkbox = React.forwardRef(function Checkbox(
  { label, description, disabled, className, id, ...props },
  ref
) {
  const autoId = React.useId();
  const inputId = id || autoId;
  return (
    <label htmlFor={inputId} className={cn('flex items-start gap-2.5', disabled ? 'opacity-50' : 'cursor-pointer', className)}>
      <span className="relative flex h-5 items-center">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          disabled={disabled}
          className="peer h-[18px] w-[18px] appearance-none rounded-[5px] border border-ink-300 bg-surface
            transition-colors duration-chm checked:border-trust-500 checked:bg-trust-500
            focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-300"
          {...props}
        />
        <svg className="pointer-events-none absolute left-0.5 top-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2 7l3.5 3.5L12 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-body-sm font-medium text-ink-800">{label}</span>}
          {description && <span className="block text-caption text-ink-500">{description}</span>}
        </span>
      )}
    </label>
  );
});

export default Checkbox;
