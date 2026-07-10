import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  PageHeader, Stat, Badge, EmptyState, Button,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';
import InquiryStatusSelect from './InquiryStatusSelect';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;

const TYPE_LABEL = { REPAIR: '집수리 서비스', EDU: '집수리 교실', VOL: '자원봉사·협력' };
const TYPE_VALUE = { REPAIR: 'selfreliance', EDU: 'trust', VOL: 'community' };

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

export default async function DashboardPage(props) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);

  const [total, byStatus, byType, recent] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.inquiry.groupBy({ by: ['type'], _count: { _all: true } }),
    prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const statusCount = Object.fromEntries(byStatus.map((r) => [r.status, r._count._all]));
  const typeCount = Object.fromEntries(byType.map((r) => [r.type, r._count._all]));
  const inProgress = (statusCount.CONTACTED || 0) + (statusCount.SCHEDULED || 0);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader title="집수리 신청 현황" description="참여 신청·문의 접수 및 처리 현황입니다." />

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <Stat label="전체 신청" value={String(total)} unit="건" accent="trust" />
        <Stat label="신규 접수" value={String(statusCount.NEW || 0)} unit="건" accent="selfreliance" />
        <Stat label="처리 중" value={String(inProgress)} unit="건" accent="community" />
        <Stat label="완료" value={String(statusCount.DONE || 0)} unit="건" accent="cooperation" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['REPAIR', 'EDU', 'VOL'].map((t) => (
          <Badge key={t} value={TYPE_VALUE[t]} dot>
            {TYPE_LABEL[t]} {typeCount[t] || 0}
          </Badge>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-h4 font-bold text-ink-800">신청 목록</h2>
          <span className="text-body-sm text-ink-500">전체 {total}건 · {page}/{pageCount} 페이지</span>
        </div>
        {recent.length === 0 ? (
          <EmptyState
            title={page > 1 ? '이 페이지에는 신청이 없습니다' : '아직 접수된 신청이 없습니다'}
            description={page > 1 ? '범위를 벗어난 페이지입니다.' : '공개 사이트의 참여 신청 폼으로 문의가 접수되면 여기에 표시됩니다.'}
            action={page > 1 ? <Button as={Link} href="/dashboard" tone="ink" variant="soft" size="sm">첫 페이지로</Button> : undefined}
          />
        ) : (
          <>
            <div className="overflow-x-auto rounded-chm-lg border border-border">
              <Table>
                <THead>
                  <TR>
                    <TH>유형</TH>
                    <TH>성함</TH>
                    <TH>연락처</TH>
                    <TH>지역</TH>
                    <TH>접수일</TH>
                    <TH>상태</TH>
                  </TR>
                </THead>
                <TBody>
                  {recent.map((q) => (
                    <TR key={q.id}>
                      <TD><Badge value={TYPE_VALUE[q.type]}>{TYPE_LABEL[q.type]}</Badge></TD>
                      <TD>{q.name}</TD>
                      <TD>{q.phone}</TD>
                      <TD>{q.area || '—'}</TD>
                      <TD>{fmtDate(q.createdAt)}</TD>
                      <TD><InquiryStatusSelect id={q.id} value={q.status} /></TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
            {pageCount > 1 && (
              <div className="mt-4 flex items-center justify-center gap-3">
                <Button as={Link} href={`/dashboard?page=${page - 1}`} variant="soft" tone="ink" size="sm" disabled={page <= 1}>← 이전</Button>
                <span className="text-body-sm text-ink-600">{page} / {pageCount}</span>
                <Button as={Link} href={`/dashboard?page=${page + 1}`} variant="soft" tone="ink" size="sm" disabled={page >= pageCount}>다음 →</Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
