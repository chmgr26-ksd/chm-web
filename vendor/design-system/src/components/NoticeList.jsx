import React from 'react';
import { cn } from '../lib/cn.js';
import { Badge } from './Badge.jsx';

/**
 * NoticeList / NoticeItem — 소식·공지 게시판 목록 (기획서: 소식·게시판 기능).
 *
 *   <NoticeList>
 *     <NoticeItem category="공지" title="…" date="2026.07.01" pinned />
 *   </NoticeList>
 */
export function NoticeList({ className, children, ...props }) {
  return (
    <ul className={cn('divide-y divide-border rounded-chm-lg border border-border bg-surface', className)} {...props}>
      {children}
    </ul>
  );
}

const CAT = {
  공지: 'trust', 소식: 'cooperation', 행사: 'community', 채용: 'selfreliance', 보도: 'innovation',
};

export function NoticeItem({ category, title, date, excerpt, pinned = false, href = '#', className, ...props }) {
  return (
    <li className={className} {...props}>
      <a href={href} className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-ink-50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {pinned && <Badge value="danger" size="sm">고정</Badge>}
            {category && <Badge value={CAT[category] || 'ink'} size="sm">{category}</Badge>}
            <span className="truncate text-body font-semibold text-ink-800">{title}</span>
          </div>
          {excerpt && <p className="mt-1 line-clamp-1 text-body-sm text-ink-500">{excerpt}</p>}
        </div>
        {date && <time className="flex-shrink-0 text-caption tabular-nums text-ink-400">{date}</time>}
      </a>
    </li>
  );
}

export default NoticeList;
