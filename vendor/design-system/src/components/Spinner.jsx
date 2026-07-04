import React from 'react';
import { cn } from '../lib/cn.js';

/** Spinner — 로딩 인디케이터. */
export function Spinner({ size = 'md', className, label = '로딩 중', ...props }) {
  const s = { sm: 'h-4 w-4 border-2', md: 'h-6 w-6 border-2', lg: 'h-9 w-9 border-[3px]' }[size];
  return (
    <span role="status" aria-label={label} className={cn('inline-block animate-spin rounded-full border-trust-500 border-t-transparent', s, className)} {...props} />
  );
}

export default Spinner;
