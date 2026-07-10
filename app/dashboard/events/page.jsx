import Link from 'next/link';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import {
  PageHeader, Badge, EmptyState, Button,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';
import { fmtEventRange } from '@/lib/datetime';
import EventActions from './EventActions';
import Pager from '../Pager';

export const dynamic = 'force-dynamic';
const PAGE_SIZE = 20;

export default async function EventsAdminPage(props) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!can(session?.user, 'events:manage')) {
    return (
      <>
        <PageHeader title="행사 관리" />
        <EmptyState title="권한 없음" description="행사 관리는 직원·관리자만 접근할 수 있습니다." />
      </>
    );
  }

  const now = new Date();
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const [total, events] = await Promise.all([
    prisma.event.count(),
    prisma.event.findMany({ orderBy: { startAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader title="행사 관리" description="일시·장소가 있는 행사 안내를 등록·수정합니다." />
      <div className="mb-4 flex justify-end">
        <Button as={Link} href="/dashboard/events/new" tone="primary" size="sm">+ 새 행사</Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          title={page > 1 ? '이 페이지에는 행사가 없습니다' : '등록된 행사가 없습니다'}
          description={page > 1 ? '이전 페이지를 확인해 주세요.' : '위 ‘새 행사’로 행사 안내를 등록해 주세요.'}
          action={page > 1 ? <Button as={Link} href="/dashboard/events" variant="soft" tone="ink" size="sm">처음으로</Button> : undefined}
        />
      ) : (
        <>
        <div className="overflow-x-auto rounded-chm-lg border border-border">
          <Table>
            <THead>
              <TR>
                <TH>일시</TH>
                <TH>행사명</TH>
                <TH>장소</TH>
                <TH>상태</TH>
                <TH align="right">관리</TH>
              </TR>
            </THead>
            <TBody>
              {events.map((ev) => (
                <TR key={ev.id}>
                  <TD className="whitespace-nowrap text-ink-700">
                    {fmtEventRange(ev.startAt, ev.endAt)}
                    {ev.startAt < now && <span className="ml-1 text-caption text-ink-400">(지남)</span>}
                  </TD>
                  <TD className="font-medium text-ink-800">{ev.title}</TD>
                  <TD>{ev.location || '—'}</TD>
                  <TD>{ev.published ? <Badge value="cooperation" dot>공개</Badge> : <Badge value="community" dot>비공개</Badge>}</TD>
                  <TD><EventActions id={ev.id} published={ev.published} /></TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
        <Pager page={page} pageCount={pageCount} basePath="/dashboard/events" />
        </>
      )}
    </>
  );
}
