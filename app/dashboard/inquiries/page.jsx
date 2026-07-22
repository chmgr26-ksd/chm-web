import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  PageHeader, Badge, EmptyState, Button,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';
import InquiryStatusSelect from '../InquiryStatusSelect';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 20;
const TYPE_LABEL = { REPAIR: '집수리 서비스', EDU: '집수리 교실', VOL: '자원봉사·협력' };
const TYPE_VALUE = { REPAIR: 'selfreliance', EDU: 'trust', VOL: 'community' };
const STATUS_LABEL = { NEW: '접수', CONTACTED: '확인 연락', SCHEDULED: '일정 조율', DONE: '완료', CANCELED: '취소' };
const STATUSES = ['NEW', 'CONTACTED', 'SCHEDULED', 'DONE', 'CANCELED'];
const TYPES = ['REPAIR', 'EDU', 'VOL'];

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

// 필터를 유지한 채 페이지만 바꾸는 쿼리스트링 생성.
function buildQs({ q, status, type, page }) {
  const s = new URLSearchParams();
  if (q) s.set('q', q);
  if (status) s.set('status', status);
  if (type) s.set('type', type);
  if (page) s.set('page', String(page));
  const str = s.toString();
  return str ? `/dashboard/inquiries?${str}` : '/dashboard/inquiries';
}

export default async function InquiriesPage(props) {
  const searchParams = await props.searchParams;
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const q = (searchParams?.q ?? '').toString().trim().slice(0, 100);
  const status = STATUSES.includes(searchParams?.status) ? searchParams.status : '';
  const type = TYPES.includes(searchParams?.type) ? searchParams.type : '';

  const where = {};
  if (status) where.status = status;
  if (type) where.type = type;
  if (q) where.OR = [{ name: { contains: q } }, { phone: { contains: q } }];

  const [total, rows] = await Promise.all([
    prisma.inquiry.count({ where }),
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { handler: { select: { name: true } } },
    }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilter = !!(q || status || type);

  const fieldCls =
    'h-10 rounded-chm-md border border-border bg-surface px-3 text-body-sm text-ink-800 focus:border-primary focus:outline-none';

  return (
    <>
      <PageHeader title="참여 신청 관리" description="집수리·교육·자원봉사 참여 신청을 검색·필터하고 처리 상태를 관리합니다." />

      {/* 필터 바 — 서버 GET 폼(클라이언트 JS 불필요) */}
      <form method="get" className="mb-5 flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-caption text-ink-500">검색(성함·연락처)</label>
          <input name="q" defaultValue={q} placeholder="예: 홍길동 / 010" className={`${fieldCls} w-56`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption text-ink-500">유형</label>
          <select name="type" defaultValue={type} className={fieldCls}>
            <option value="">전체</option>
            {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-caption text-ink-500">상태</label>
          <select name="status" defaultValue={status} className={fieldCls}>
            <option value="">전체</option>
            {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <Button type="submit" tone="primary" size="md">검색</Button>
        {hasFilter && (
          <Button as={Link} href="/dashboard/inquiries" variant="ghost" tone="ink" size="md">초기화</Button>
        )}
      </form>

      <div className="mb-3 flex items-center justify-between">
        <span className="text-body-sm text-ink-500">
          {hasFilter ? '검색 결과' : '전체'} {total}건 · {page}/{pageCount} 페이지
        </span>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={hasFilter || page > 1 ? '조건에 맞는 문의가 없습니다' : '아직 접수된 문의가 없습니다'}
          description={hasFilter ? '검색어나 필터를 변경해 보세요.' : '공개 사이트의 참여 신청 폼으로 문의가 접수되면 여기에 표시됩니다.'}
          action={hasFilter || page > 1 ? <Button as={Link} href="/dashboard/inquiries" variant="soft" tone="ink" size="sm">필터 초기화</Button> : undefined}
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
                  <TH>내용</TH>
                  <TH>접수일</TH>
                  <TH>담당자</TH>
                  <TH>상태</TH>
                </TR>
              </THead>
              <TBody>
                {rows.map((r) => (
                  <TR key={r.id}>
                    <TD><Badge value={TYPE_VALUE[r.type]}>{TYPE_LABEL[r.type]}</Badge></TD>
                    <TD className="font-medium text-ink-800">{r.name}</TD>
                    <TD>{r.phone}</TD>
                    <TD>{r.area || '—'}</TD>
                    <TD>
                      {r.message ? (
                        <span className="block max-w-[22ch] truncate text-ink-600" title={r.message}>{r.message}</span>
                      ) : '—'}
                    </TD>
                    <TD className="whitespace-nowrap text-ink-500">{fmtDate(r.createdAt)}</TD>
                    <TD className="text-ink-600">{r.handler?.name || '—'}</TD>
                    <TD><InquiryStatusSelect id={r.id} value={r.status} /></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>

          {pageCount > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button as={Link} href={buildQs({ q, status, type, page: page - 1 })} variant="soft" tone="ink" size="sm" disabled={page <= 1}>← 이전</Button>
              <span className="text-body-sm text-ink-600">{page} / {pageCount}</span>
              <Button as={Link} href={buildQs({ q, status, type, page: page + 1 })} variant="soft" tone="ink" size="sm" disabled={page >= pageCount}>다음 →</Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
