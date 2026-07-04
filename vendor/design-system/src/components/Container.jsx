import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Container — 페이지 최대 폭 래퍼.
 * @param {'sm'|'md'|'lg'|'xl'|'full'} [size='lg']
 */
const SIZE = { sm: 'max-w-2xl', md: 'max-w-4xl', lg: 'max-w-6xl', xl: 'max-w-7xl', full: 'max-w-none' };

export function Container({ size = 'lg', className, children, ...props }) {
  return (
    <div className={cn('mx-auto w-full px-4 sm:px-6 lg:px-8', SIZE[size], className)} {...props}>
      {children}
    </div>
  );
}

export default Container;
