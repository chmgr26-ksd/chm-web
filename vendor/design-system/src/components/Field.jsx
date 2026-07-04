import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Field — 폼 컨트롤 래퍼. 라벨/힌트/에러/필수 표시를 일관되게 제공합니다.
 *
 *   <Field label="이메일" required error="형식이 올바르지 않습니다">
 *     <Input type="email" invalid />
 *   </Field>
 */
export function Field({ label, hint, error, required, htmlFor, className, children, ...props }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label htmlFor={htmlFor} className="text-body-sm font-semibold text-ink-800">
          {label}
          {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-caption text-danger">{error}</p>
      ) : hint ? (
        <p className="text-caption text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default Field;
