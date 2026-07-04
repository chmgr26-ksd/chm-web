import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Input — 텍스트 입력 필드.
 * @param {'sm'|'md'|'lg'} [size='md']
 * @param {boolean} [invalid]
 * @param {React.ReactNode} [prefix] [suffix]  좌/우 어피던스
 */
const SIZE = {
  sm: 'h-8 text-body-sm rounded-chm-sm',
  md: 'h-10 text-body rounded-chm-md',
  lg: 'h-12 text-body-lg rounded-chm-lg',
};

export const Input = React.forwardRef(function Input(
  { size = 'md', invalid = false, prefix, suffix, disabled, className, ...props },
  ref
) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 bg-surface border px-3 transition-colors duration-chm ease-chm',
        'focus-within:ring-2 focus-within:ring-trust-300 focus-within:border-trust-500',
        SIZE[size],
        invalid ? 'border-danger focus-within:ring-danger/30 focus-within:border-danger' : 'border-border',
        disabled && 'opacity-50 bg-surface-muted pointer-events-none',
        className
      )}
    >
      {prefix && <span className="flex-shrink-0 text-ink-500">{prefix}</span>}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className="min-w-0 flex-1 bg-transparent text-ink-800 placeholder:text-ink-400 focus:outline-none"
        {...props}
      />
      {suffix && <span className="flex-shrink-0 text-ink-500">{suffix}</span>}
    </div>
  );
});

export default Input;
