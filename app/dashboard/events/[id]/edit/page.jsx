import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import { toLocalInput } from '@/lib/datetime';
import EventForm from '../../EventForm';

export const dynamic = 'force-dynamic';

export default async function EditEventPage(props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'events:manage')) {
    return (
      <>
        <PageHeader title="행사 수정" />
        <EmptyState title="권한 없음" description="행사 수정은 직원·관리자만 접근할 수 있습니다." />
      </>
    );
  }

  const ev = await prisma.event.findUnique({ where: { id: params.id } });
  if (!ev) notFound();

  const initial = {
    id: ev.id,
    title: ev.title,
    location: ev.location || '',
    description: ev.description,
    published: ev.published,
    startAt: toLocalInput(ev.startAt),
    endAt: toLocalInput(ev.endAt),
  };

  return (
    <>
      <PageHeader title="행사 수정" description="행사 안내를 수정합니다." />
      <EventForm event={initial} />
    </>
  );
}
