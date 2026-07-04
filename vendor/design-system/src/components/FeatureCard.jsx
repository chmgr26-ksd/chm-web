import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * FeatureCard — 사업·서비스 소개 카드 (기획서: 사업·활동 소개, 서비스 상세).
 * @param {'trust'|'selfreliance'|'cooperation'|'community'|'innovation'|'sustainability'} [value='trust']
 * @param {React.ReactNode} [icon]
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} [action]
 */
const THEME = {
  trust: 'bg-trust-50 text-trust-600', selfreliance: 'bg-selfreliance-50 text-selfreliance-600',
  cooperation: 'bg-cooperation-50 text-cooperation-600', community: 'bg-community-50 text-community-700',
  innovation: 'bg-innovation-50 text-innovation-600', sustainability: 'bg-sustainability-50 text-sustainability-600',
};

export function FeatureCard({ value = 'trust', icon, title, description, action, className, ...props }) {
  return (
    <div className={cn('flex flex-col gap-3 rounded-chm-lg border border-border bg-surface p-6 transition-shadow duration-chm ease-chm hover:shadow-chm-md', className)} {...props}>
      <span className={cn('grid h-12 w-12 place-items-center rounded-chm-md', THEME[value])}>
        {icon || (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 10l8-6 8 6v9a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        )}
      </span>
      <h3 className="text-h4 font-semibold text-ink-800">{title}</h3>
      <p className="flex-1 text-body-sm leading-relaxed text-ink-600">{description}</p>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

export default FeatureCard;
