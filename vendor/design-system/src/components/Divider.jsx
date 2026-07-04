import React from 'react';
import { cn } from '../lib/cn.js';

/** Divider — 구분선. label 제공 시 가운데 텍스트. */
export function Divider({ orientation = 'horizontal', label, className, ...props }) {
  if (orientation === 'vertical') {
    return <span role="separator" aria-orientation="vertical" className={cn('inline-block w-px self-stretch bg-border', className)} {...props} />;
  }
  if (label) {
    return (
      <div className={cn('flex items-center gap-3', className)} {...props}>
        <span className="h-px flex-1 bg-border" />
        <span className="text-caption font-medium text-ink-500">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }
  return <hr className={cn('border-0 border-t border-border', className)} {...props} />;
}

export default Divider;
