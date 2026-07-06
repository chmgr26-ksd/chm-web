'use client';
import React from 'react';
import { cn } from '../lib/cn.js';

/** Switch — 토글 스위치 (controlled/uncontrolled 모두 지원). */
export const Switch = React.forwardRef(function Switch(
  { label, disabled, className, id, ...props },
  ref
) {
  const autoId = React.useId();
  const inputId = id || autoId;
  return (
    <label htmlFor={inputId} className={cn('inline-flex items-center gap-2.5', disabled ? 'opacity-50' : 'cursor-pointer', className)}>
      <span className="relative inline-flex">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <span className="h-6 w-11 rounded-full bg-ink-300 transition-colors duration-chm peer-checked:bg-trust-500 peer-focus-visible:ring-2 peer-focus-visible:ring-trust-300 peer-focus-visible:ring-offset-1" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-chm-sm transition-transform duration-chm ease-chm peer-checked:translate-x-5" />
      </span>
      {label && <span className="text-body-sm font-medium text-ink-800">{label}</span>}
    </label>
  );
});

export default Switch;
