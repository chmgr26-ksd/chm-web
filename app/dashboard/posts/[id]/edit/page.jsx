import { notFound } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import PostForm from '../../PostForm';

export const dynamic = 'force-dynamic';

export default async function EditPostPage(props) {
  const params = await props.params;
  const session = await auth();
  if (!can(session?.user, 'posts:manage')) {
    return (<><PageHeader title="소식 수정" /><EmptyState title="권한 없음" description="직원·관리자만 수정할 수 있습니다." /></>);
  }
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <>
      <PageHeader title="소식 수정" />
      <PostForm post={post} />
    </>
  );
}
