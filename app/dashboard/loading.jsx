import { Spinner } from '@chm/design-system';

// 스트리밍 로딩 폴백 — 응답 첫 바이트를 즉시 보내 프록시 타임아웃/빈 화면 방지.
export default function DashboardLoading() {
  return (
    <div className="grid place-items-center py-24">
      <div className="flex flex-col items-center gap-3 text-ink-500">
        <Spinner size="lg" />
        <span className="text-body-sm">불러오는 중…</span>
      </div>
    </div>
  );
}
