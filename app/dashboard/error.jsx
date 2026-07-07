'use client';

import { Button } from '@chm/design-system';

// 대시보드 렌더 실패 시 조각 대신 깔끔한 재시도 화면.
export default function DashboardError({ error, reset }) {
  return (
    <div className="grid place-items-center py-24 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="text-h4 font-bold text-ink-800">화면을 불러오지 못했습니다</div>
        <p className="max-w-sm text-body-sm text-ink-500">일시적인 문제일 수 있습니다. 잠시 후 다시 시도해 주세요.</p>
        <div className="mt-1 flex gap-2">
          <Button tone="primary" size="sm" onClick={() => reset()}>다시 시도</Button>
          <Button as="a" href="/dashboard" variant="outline" tone="ink" size="sm">대시보드로</Button>
        </div>
      </div>
    </div>
  );
}
