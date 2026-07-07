import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import PostForm from '../PostForm';

export const dynamic = 'force-dynamic';

export default async function NewPostPage() {
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return (<><PageHeader title="소식 작성" /><EmptyState title="권한 없음" description="직원·관리자만 작성할 수 있습니다." /></>);
  }
  return (
    <>
      <PageHeader title="새 소식 작성" description="사이트 소식 페이지에 노출할 글을 작성합니다." />
      <PostForm />
    </>
  );
}
