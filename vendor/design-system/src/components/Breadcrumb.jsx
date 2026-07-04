import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Breadcrumb — 경로 네비게이션.
 * @param {{label:string, href?:string}[]} items
 */
export function Breadcrumb({ items = [], className, ...props }) {
  return (
    <nav aria-label="브레드크럼" className={cn('flex items-center gap-1.5 text-body-sm', className)} {...props}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <React.Fragment key={i}>
            {last ? (
              <span aria-current="page" className="font-semibold text-ink-800">{item.label}</span>
            ) : (
              <a href={item.href || '#'} className="text-ink-500 transition-colors hover:text-trust-600">{item.label}</a>
            )}
            {!last && <span className="text-ink-300" aria-hidden>/</span>}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
