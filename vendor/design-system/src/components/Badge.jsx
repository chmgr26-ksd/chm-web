import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Badge — 상태/카테고리 라벨.
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'|'ink'|'danger'} [value='trust']
 * @param {'soft'|'solid'|'outline'} [variant='soft']
 * @param {'sm'|'md'} [size='md']
 * @param {boolean} [dot]  앞에 상태 점 표시
 */
const VALUE = {
  trust: { soft: 'bg-trust-50 text-trust-700', solid: 'bg-trust-500 text-white', outline: 'border border-trust-300 text-trust-700', dot: 'bg-trust-500' },
  selfreliance: { soft: 'bg-selfreliance-50 text-selfreliance-700', solid: 'bg-selfreliance-500 text-white', outline: 'border border-selfreliance-300 text-selfreliance-700', dot: 'bg-selfreliance-500' },
  cooperation: { soft: 'bg-cooperation-50 text-cooperation-700', solid: 'bg-cooperation-500 text-white', outline: 'border border-cooperation-300 text-cooperation-700', dot: 'bg-cooperation-500' },
  community: { soft: 'bg-community-50 text-community-700', solid: 'bg-community-500 text-ink-900', outline: 'border border-community-400 text-community-700', dot: 'bg-community-500' },
  innovation: { soft: 'bg-innovation-50 text-innovation-700', solid: 'bg-innovation-500 text-white', outline: 'border border-innovation-300 text-innovation-700', dot: 'bg-innovation-500' },
  sustainability: { soft: 'bg-sustainability-50 text-sustainability-700', solid: 'bg-sustainability-500 text-white', outline: 'border border-sustainability-300 text-sustainability-700', dot: 'bg-sustainability-500' },
  ink: { soft: 'bg-ink-100 text-ink-700', solid: 'bg-ink-800 text-white', outline: 'border border-ink-300 text-ink-700', dot: 'bg-ink-500' },
  danger: { soft: 'bg-danger-soft text-danger', solid: 'bg-danger text-white', outline: 'border border-danger text-danger', dot: 'bg-danger' },
};

const SIZE = { sm: 'h-5 px-2 text-overline', md: 'h-6 px-2.5 text-caption' };

export function Badge({ value = 'trust', variant = 'soft', size = 'md', dot = false, className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-chm-sm font-semibold whitespace-nowrap',
        SIZE[size],
        VALUE[value][variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', VALUE[value].dot)} />}
      {children}
    </span>
  );
}

export default Badge;
