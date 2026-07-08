import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import EventForm from '../EventForm';

export const dynamic = 'force-dynamic';

export default async function NewEventPage() {
  const session = await auth();
  if (!can(session?.user, 'events:manage')) {
    return (
      <>
        <PageHeader title="새 행사" />
        <EmptyState title="권한 없음" description="행사 등록은 직원·관리자만 접근할 수 있습니다." />
      </>
    );
  }
  return (
    <>
      <PageHeader title="새 행사" description="행사 안내를 등록합니다." />
      <EventForm />
    </>
  );
}
