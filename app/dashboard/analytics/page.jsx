import { prisma } from '@/lib/prisma';
import {
  PageHeader, Stat, BarChart, EmptyState,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start7 = new Date(startToday);
  start7.setDate(start7.getDate() - 6);

  const [total, todayCount, topPages, views7] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: startToday } } }),
    prisma.pageView.groupBy({
      by: ['path'],
      _count: { _all: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    prisma.pageView.findMany({ where: { createdAt: { gte: start7 } }, select: { createdAt: true } }),
  ]);

  // 최근 7일 일별 집계(서버 로컬 기준으로 버킷팅 → 타임존 불일치 방지)
  const buckets = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(start7);
    d.setDate(d.getDate() + i);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    buckets[key] = { label: `${d.getMonth() + 1}/${d.getDate()}`, value: 0 };
  }
  for (const v of views7) {
    const d = new Date(v.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (buckets[key]) buckets[key].value += 1;
  }
  const chart = Object.values(buckets);
  const week = chart.reduce((s, c) => s + c.value, 0);

  return (
    <>
      <PageHeader title="방문자 통계" description="공개 사이트의 페이지뷰 현황입니다." />

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Stat label="전체 조회수" value={total.toLocaleString()} unit="회" accent="trust" />
        <Stat label="오늘" value={todayCount.toLocaleString()} unit="회" accent="selfreliance" />
        <Stat label="최근 7일" value={week.toLocaleString()} unit="회" accent="cooperation" />
      </div>

      <div className="mt-8 rounded-chm-lg border border-border p-6">
        <h2 className="mb-4 text-h4 font-bold text-ink-800">최근 7일 추이</h2>
        {week === 0 ? (
          <p className="text-body-sm text-ink-500">아직 집계된 방문 기록이 없습니다.</p>
        ) : (
          <BarChart data={chart} tone="trust" height={200} />
        )}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-h4 font-bold text-ink-800">인기 페이지 (상위 10)</h2>
        {topPages.length === 0 ? (
          <EmptyState title="데이터가 없습니다" description="방문 기록이 쌓이면 인기 페이지가 표시됩니다." />
        ) : (
          <div className="overflow-x-auto rounded-chm-lg border border-border">
            <Table>
              <THead>
                <TR><TH>경로</TH><TH align="right">조회수</TH></TR>
              </THead>
              <TBody>
                {topPages.map((p) => (
                  <TR key={p.path}>
                    <TD className="font-medium text-ink-800">{p.path}</TD>
                    <TD align="right">{p._count._all.toLocaleString()}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
