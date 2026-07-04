import React from 'react';
import { cn } from '../lib/cn.js';

/** Radio — 라벨 포함 라디오 버튼. name 을 공유해 그룹을 만듭니다. */
export const Radio = React.forwardRef(function Radio(
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
          type="radio"
          disabled={disabled}
          className="peer h-[18px] w-[18px] appearance-none rounded-full border border-ink-300 bg-surface
            transition-colors duration-chm checked:border-trust-500
            focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-300"
          {...props}
        />
        <span className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-trust-500 opacity-0 peer-checked:opacity-100" aria-hidden />
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

export default Radio;
