import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import PostsGroupSection from '../PostsGroupSection';

export const dynamic = 'force-dynamic';

export default async function EducationAdminPage(props) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return (<><PageHeader title="교육 활동 소식 관리" /><EmptyState title="권한 없음" description="소식 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  return <PostsGroupSection groupKey="education" page={page} />;
}
