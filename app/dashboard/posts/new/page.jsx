import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import { POST_GROUPS } from '@/lib/posts';
import PostForm from '../PostForm';

export const dynamic = 'force-dynamic';

export default async function NewPostPage(props) {
  const searchParams = await props.searchParams;
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return (<><PageHeader title="소식 작성" /><EmptyState title="권한 없음" description="직원·관리자만 작성할 수 있습니다." /></>);
  }
  const group = POST_GROUPS[searchParams?.group] ? searchParams.group : 'notices';
  const label = POST_GROUPS[group].label;
  return (
    <>
      <PageHeader title={`새 ${label} 작성`} description={`공개 '${label}' 페이지에 노출할 글을 작성합니다.`} />
      <PostForm group={group} />
    </>
  );
}
