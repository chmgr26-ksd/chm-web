import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import QnaManager from './QnaManager';

export const dynamic = 'force-dynamic';

export default async function QnaAdminPage() {
  const session = await auth();
  if (!can(session?.user, 'qna:manage')) {
    return (<><PageHeader title="QNA 관리" /><EmptyState title="권한 없음" description="QNA 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const posts = await prisma.qnaPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, authorName: true, contact: true, title: true, body: true, answer: true, answered: true, isPublic: true, createdAt: true },
  });
  return (
    <>
      <PageHeader title="QNA 관리" description="방문자가 남긴 문의에 답변하고, 답변을 공개 게시판에 노출할지 설정합니다." />
      <QnaManager posts={posts} />
    </>
  );
}
