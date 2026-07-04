import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * PageHero — 마케팅 페이지 히어로 (홈·단체소개 등).
 * 브랜드 6색 스펙트럼 라인을 시그니처로 사용합니다.
 *
 * @param {string} eyebrow
 * @param {React.ReactNode} title
 * @param {string} [description]
 * @param {React.ReactNode} [actions]
 * @param {React.ReactNode} [media]  우측 비주얼
 */
export function PageHero({ eyebrow, title, description, actions, media, className, ...props }) {
  return (
    <section className={cn('relative overflow-hidden bg-surface', className)} {...props}>
      <div className="flex h-1.5 w-full">
        <span className="flex-1 bg-selfreliance-500" />
        <span className="flex-1 bg-trust-500" />
        <span className="flex-1 bg-cooperation-500" />
        <span className="flex-1 bg-community-500" />
        <span className="flex-1 bg-innovation-500" />
        <span className="flex-1 bg-sustainability-500" />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="flex flex-col gap-5">
          {eyebrow && <span className="text-overline font-bold uppercase tracking-wide text-trust-600">{eyebrow}</span>}
          <h1 className="text-h1 font-bold leading-tight text-ink-800 lg:text-display">{title}</h1>
          {description && <p className="max-w-xl text-body-lg text-ink-600">{description}</p>}
          {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {media && <div className="flex justify-center lg:justify-end">{media}</div>}
      </div>
    </section>
  );
}

export default PageHero;
