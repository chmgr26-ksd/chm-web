'use client';
import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Accordion — 접이식 패널. AccordionItem 을 자식으로 사용.
 *
 *   <Accordion>
 *     <AccordionItem title="집수리 신청은 어떻게 하나요?">...</AccordionItem>
 *   </Accordion>
 */
export function Accordion({ className, children, ...props }) {
  return <div className={cn('divide-y divide-border rounded-chm-lg border border-border bg-surface', className)} {...props}>{children}</div>;
}

export function AccordionItem({ title, defaultOpen = false, className, children, ...props }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className={className} {...props}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-trust-300 rounded-chm-md"
      >
        <span className="text-body font-semibold text-ink-800">{title}</span>
        <span className={cn('flex-shrink-0 text-ink-400 transition-transform duration-chm ease-chm', open && 'rotate-180')} aria-hidden>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </button>
      {open && <div className="px-5 pb-5 -mt-1 text-body-sm leading-relaxed text-ink-600">{children}</div>}
    </div>
  );
}

export default Accordion;
