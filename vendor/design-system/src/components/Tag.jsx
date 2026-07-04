import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Tag / Chip — 제거 가능한 키워드 태그.
 * @param {function} [onRemove]  제공 시 X 버튼 표시
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'|'ink'} [value='ink']
 */
const DOT = {
  trust: 'bg-trust-500', selfreliance: 'bg-selfreliance-500', cooperation: 'bg-cooperation-500',
  community: 'bg-community-500', innovation: 'bg-innovation-500', sustainability: 'bg-sustainability-500',
  ink: 'bg-ink-400',
};

export function Tag({ value = 'ink', onRemove, className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 h-7 pl-2.5 pr-2 rounded-chm-full',
        'bg-surface border border-border text-body-sm text-ink-700',
        className
      )}
      {...props}
    >
      <span className={cn('h-2 w-2 rounded-full', DOT[value])} />
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="태그 제거"
          className="ml-0.5 grid h-4 w-4 place-items-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-800"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </span>
  );
}

export default Tag;
