import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  PageHeader, Stat, BarChart, EmptyState,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';

export const dynamic = 'force-dynamic';

const PERIODS = [
  { days: 7, label: '7일' },
  { days: 30, label: '30일' },
  { days: 90, label: '90일' },
];

export default async function AnalyticsPage({ searchParams }) {
  const days = PERIODS.some((p) => p.days === Number(searchParams?.days)) ? Number(searchParams.days) : 7;
  const weekly = days === 90; // 90일은 주 단위 버킷(막대 과밀 방지)
  const bucketDays = weekly ? 7 : 1;
  const nBuckets = Math.ceil(days / bucketDays);

  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 오래된→최신 순 버킷 경계(서버 TZ 기준).
  const buckets = [];
  for (let i = nBuckets - 1; i >= 0; i--) {
    const s = new Date(startToday);
    s.setDate(s.getDate() - i * bucketDays - (bucketDays - 1));
    const e = new Date(startToday);
    e.setDate(e.getDate() - i * bucketDays + 1); // 미포함 상한
    buckets.push({ label: `${s.getMonth() + 1}/${s.getDate()}`, start: s, end: e });
  }
  const periodStart = buckets[0].start;

  const [total, todayCount, periodTotal, directCount, topPages, topReferrers, ...bucketCounts] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: startToday } } }),
    prisma.pageView.count({ where: { createdAt: { gte: periodStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: periodStart }, referrer: null } }),
    prisma.pageView.groupBy({
      by: ['path'],
      where: { createdAt: { gte: periodStart } },
      _count: { _all: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ['referrer'],
      where: { createdAt: { gte: periodStart }, referrer: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { referrer: 'desc' } },
      take: 10,
    }),
    ...buckets.map((b) => prisma.pageView.count({ where: { createdAt: { gte: b.start, lt: b.end } } })),
  ]);

  const chart = buckets.map((b, i) => ({ label: b.label, value: bucketCounts[i] }));
  const avgPerDay = Math.round(periodTotal / days);

  const tabCls = (active) =>
    `rounded-chm-md px-3 py-1.5 text-body-sm font-semibold transition ${active ? 'bg-primary text-white' : 'text-ink-600 hover:bg-ink-100'}`;

  return (
    <>
      <PageHeader title="방문자 통계" description="공개 사이트의 페이지뷰 현황입니다." />

      {/* 기간 선택 */}
      <div className="mb-5 inline-flex gap-1 rounded-chm-lg border border-border p-1">
        {PERIODS.map((p) => (
          <Link key={p.days} href={`/dashboard/analytics?days=${p.days}`} className={tabCls(days === p.days)}>
            최근 {p.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        <Stat label="전체 조회수" value={total.toLocaleString()} unit="회" accent="trust" />
        <Stat label={`최근 ${days}일`} value={periodTotal.toLocaleString()} unit="회" accent="cooperation" />
        <Stat label="일평균" value={avgPerDay.toLocaleString()} unit="회" accent="community" />
        <Stat label="오늘" value={todayCount.toLocaleString()} unit="회" accent="selfreliance" />
      </div>

      <div className="mt-8 rounded-chm-lg border border-border p-6">
        <h2 className="mb-4 text-h4 font-bold text-ink-800">최근 {days}일 추이 {weekly && <span className="text-body-sm font-normal text-ink-500">(주 단위)</span>}</h2>
        {periodTotal === 0 ? (
          <p className="text-body-sm text-ink-500">이 기간에 집계된 방문 기록이 없습니다.</p>
        ) : (
          <BarChart data={chart} tone="trust" height={200} />
        )}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* 인기 페이지 */}
        <div>
          <h2 className="mb-3 text-h4 font-bold text-ink-800">인기 페이지 (상위 10)</h2>
          {topPages.length === 0 ? (
            <EmptyState title="데이터가 없습니다" description="방문 기록이 쌓이면 표시됩니다." />
          ) : (
            <div className="overflow-x-auto rounded-chm-lg border border-border">
              <Table>
                <THead><TR><TH>경로</TH><TH align="right">조회수</TH></TR></THead>
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

        {/* 유입 경로 */}
        <div>
          <h2 className="mb-3 text-h4 font-bold text-ink-800">유입 경로 (외부, 상위 10)</h2>
          <div className="overflow-x-auto rounded-chm-lg border border-border">
            <Table>
              <THead><TR><TH>출처</TH><TH align="right">유입수</TH></TR></THead>
              <TBody>
                {topReferrers.map((r) => (
                  <TR key={r.referrer}>
                    <TD className="font-medium text-ink-800">{r.referrer}</TD>
                    <TD align="right">{r._count._all.toLocaleString()}</TD>
                  </TR>
                ))}
                <TR>
                  <TD className="text-ink-500">직접 방문 · 사이트 내 이동</TD>
                  <TD align="right" className="text-ink-500">{directCount.toLocaleString()}</TD>
                </TR>
              </TBody>
            </Table>
          </div>
          {topReferrers.length === 0 && (
            <p className="mt-2 text-caption text-ink-500">외부 유입 기록은 이 기능 도입 이후부터 집계됩니다.</p>
          )}
        </div>
      </div>
    </>
  );
}
