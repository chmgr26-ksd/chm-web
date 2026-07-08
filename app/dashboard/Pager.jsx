import Link from 'next/link';
import { Button } from '@chm/design-system';

// 관리 목록 공용 페이저 — ?page= 기반. pageCount<=1이면 렌더 안 함.
export default function Pager({ page, pageCount, basePath }) {
  if (pageCount <= 1) return null;
  const href = (p) => `${basePath}?page=${p}`;
  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      <Button as={Link} href={href(page - 1)} variant="soft" tone="ink" size="sm" disabled={page <= 1}>← 이전</Button>
      <span className="text-body-sm text-ink-600">{page} / {pageCount}</span>
      <Button as={Link} href={href(page + 1)} variant="soft" tone="ink" size="sm" disabled={page >= pageCount}>다음 →</Button>
    </div>
  );
}
