import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * Avatar — 사용자/주민 프로필 이미지 또는 이니셜.
 * @param {string} [src] [alt] [name]
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [size='md']
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'} [value='trust']  이니셜 배경
 */
const SIZE = { xs: 'h-6 w-6 text-overline', sm: 'h-8 w-8 text-caption', md: 'h-10 w-10 text-body-sm', lg: 'h-12 w-12 text-body', xl: 'h-16 w-16 text-h4' };
const BG = {
  trust: 'bg-trust-100 text-trust-700', selfreliance: 'bg-selfreliance-100 text-selfreliance-700',
  cooperation: 'bg-cooperation-100 text-cooperation-700', community: 'bg-community-100 text-community-800',
  innovation: 'bg-innovation-100 text-innovation-700', sustainability: 'bg-sustainability-100 text-sustainability-700',
};

function initials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2);
  return (parts[0][0] || '') + (parts[parts.length - 1][0] || '');
}

export function Avatar({ src, alt, name = '', size = 'md', value = 'trust', className, ...props }) {
  return (
    <span
      className={cn('inline-grid place-items-center overflow-hidden rounded-full font-semibold select-none', SIZE[size], !src && BG[value], className)}
      title={name || alt}
      {...props}
    >
      {src ? <img src={src} alt={alt || name} className="h-full w-full object-cover" /> : initials(name).toUpperCase()}
    </span>
  );
}

/** AvatarGroup — 겹쳐 표시. */
export function AvatarGroup({ max = 4, className, children, ...props }) {
  const items = React.Children.toArray(children);
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  return (
    <div className={cn('flex items-center', className)} {...props}>
      {shown.map((child, i) => (
        <span key={i} className="rounded-full ring-2 ring-surface -ml-2 first:ml-0">{child}</span>
      ))}
      {extra > 0 && (
        <span className="-ml-2 grid h-10 w-10 place-items-center rounded-full bg-ink-100 text-body-sm font-semibold text-ink-600 ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  );
}

export default Avatar;
