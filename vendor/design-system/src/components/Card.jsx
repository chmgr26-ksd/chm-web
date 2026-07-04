import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Card — 콘텐츠 컨테이너.
 * @param {'elevated'|'outline'|'muted'} [variant='elevated']
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'} [accent]  상단 강조 바 색상
 * @param {boolean} [interactive]  hover 상호작용 스타일
 */
const VARIANT = {
  elevated: 'bg-surface shadow-chm-md',
  outline: 'bg-surface border border-border',
  muted: 'bg-surface-muted',
};

const ACCENT = {
  trust: 'before:bg-trust-500', selfreliance: 'before:bg-selfreliance-500',
  cooperation: 'before:bg-cooperation-500', community: 'before:bg-community-500',
  innovation: 'before:bg-innovation-500', sustainability: 'before:bg-sustainability-500',
};

export function Card({ variant = 'elevated', accent, interactive = false, className, children, ...props }) {
  return (
    <div
      className={cn(
        'relative rounded-chm-lg overflow-hidden',
        VARIANT[variant],
        accent && ['before:content-[""] before:absolute before:inset-x-0 before:top-0 before:h-1', ACCENT[accent]],
        interactive && 'transition-shadow duration-chm ease-chm hover:shadow-chm-lg cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return <div className={cn('px-6 pt-6 pb-3', className)} {...props}>{children}</div>;
}
export function CardTitle({ className, children, ...props }) {
  return <h3 className={cn('text-h4 font-semibold text-ink-800', className)} {...props}>{children}</h3>;
}
export function CardDescription({ className, children, ...props }) {
  return <p className={cn('mt-1 text-body-sm text-ink-600', className)} {...props}>{children}</p>;
}
export function CardBody({ className, children, ...props }) {
  return <div className={cn('px-6 py-4', className)} {...props}>{children}</div>;
}
export function CardFooter({ className, children, ...props }) {
  return <div className={cn('px-6 py-4 border-t border-border flex items-center gap-3', className)} {...props}>{children}</div>;
}

export default Card;
