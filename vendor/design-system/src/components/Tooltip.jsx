import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Tooltip — CSS 기반 호버 툴팁 (경량, 의존성 없음).
 * @param {React.ReactNode} content
 * @param {'top'|'bottom'|'left'|'right'} [placement='top']
 */
const POS = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

export function Tooltip({ content, placement = 'top', className, children, ...props }) {
  return (
    <span className={cn('group relative inline-flex', className)} {...props}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-[1200] whitespace-nowrap rounded-chm-sm bg-ink-800 px-2.5 py-1.5 text-caption font-medium text-white',
          'opacity-0 scale-95 transition-all duration-chm ease-chm group-hover:opacity-100 group-hover:scale-100 shadow-chm-md',
          POS[placement]
        )}
      >
        {content}
      </span>
    </span>
  );
}

export default Tooltip;
