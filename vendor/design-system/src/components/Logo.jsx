import React from 'react';
import { cn } from '../lib/cn.js';

/**
 * CHM Group 로고.
 * 6대 핵심가치를 상징하는 6색 육각형 엠블럼 + 중앙의 집(house) 심볼.
 *
 * @param {'full'|'emblem'|'wordmark'} [variant='full']  표시 형태
 * @param {number} [size=40]  엠블럼 높이(px)
 * @param {boolean} [inverse=false]  어두운 배경용(워드마크 흰색)
 */
export function Logo({ variant = 'full', size = 40, inverse = false, className, ...props }) {
  const wordColor = inverse ? 'var(--chm-ink-0)' : 'var(--chm-ink-800)';
  const tagColor = inverse ? 'var(--chm-ink-300)' : 'var(--chm-ink-600)';

  const emblem = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="CHM Group 엠블럼"
      style={{ display: 'block', flexShrink: 0 }}
    >
      {/* 6색 육각 링 — 자립·신뢰·상생·지속가능성·혁신·공동체 순 회전 */}
      <g>
        <path d="M50 6 L83 25 L83 30 L50 12 Z" fill="var(--chm-trust-500)" />
        <path d="M83 25 L94 44 L88 50 L83 30 Z" fill="var(--chm-cooperation-500)" />
        <path d="M94 44 L94 63 L88 63 L88 50 Z" fill="var(--chm-sustainability-500)" />
        <path d="M94 63 L61 82 L58 76 L88 58 Z" fill="var(--chm-sustainability-600)" />
        <path d="M61 82 L39 82 L39 76 L61 76 Z" fill="var(--chm-innovation-500)" />
        <path d="M39 82 L6 63 L12 58 L42 76 Z" fill="var(--chm-selfreliance-500)" />
        <path d="M6 63 L6 44 L12 50 L12 58 Z" fill="var(--chm-selfreliance-600)" />
        <path d="M6 44 L17 25 L23 30 L12 50 Z" fill="var(--chm-selfreliance-400)" />
        <path d="M17 25 L50 6 L50 12 L23 30 Z" fill="var(--chm-community-500)" />
      </g>
      {/* 중앙 집(house) */}
      <g>
        <path
          d="M50 30 L70 46 L70 68 L30 68 L30 46 Z"
          fill="var(--chm-ink-0)"
          stroke="var(--chm-ink-100)"
          strokeWidth="1"
        />
        {/* 창문 격자 */}
        <rect x="43" y="47" width="14" height="16" rx="1.5" fill="var(--chm-ink-800)" />
        <line x1="50" y1="47" x2="50" y2="63" stroke="var(--chm-ink-0)" strokeWidth="1.4" />
        <line x1="43" y1="55" x2="57" y2="55" stroke="var(--chm-ink-0)" strokeWidth="1.4" />
      </g>
    </svg>
  );

  if (variant === 'emblem') {
    return (
      <span className={cn('chm-logo', className)} {...props}>
        {emblem}
      </span>
    );
  }

  const words = (
    <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.05 }}>
      <span
        style={{
          fontFamily: 'var(--chm-font-sans)',
          fontWeight: 800,
          letterSpacing: '0.02em',
          fontSize: size * 0.52,
          color: wordColor,
        }}
      >
        CHM GROUP
      </span>
      <span
        style={{
          fontFamily: 'var(--chm-font-sans)',
          fontWeight: 600,
          fontSize: size * 0.24,
          color: tagColor,
          marginTop: size * 0.06,
        }}
      >
        Community Housing Management
      </span>
    </span>
  );

  if (variant === 'wordmark') {
    return (
      <span className={cn('chm-logo', className)} {...props}>
        {words}
      </span>
    );
  }

  return (
    <span
      className={cn('chm-logo', className)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: size * 0.3 }}
      {...props}
    >
      {emblem}
      {words}
    </span>
  );
}

export default Logo;
