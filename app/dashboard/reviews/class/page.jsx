import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import ReviewManager from '../ReviewManager';

export const dynamic = 'force-dynamic';

export default async function ClassReviewAdminPage() {
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return (<><PageHeader title="집수리 교실 후기" /><EmptyState title="권한 없음" description="후기 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const reviews = await prisma.review.findMany({
    where: { type: 'CLASS' },
    orderBy: { createdAt: 'desc' },
    include: { images: { select: { id: true, role: true, sortOrder: true }, orderBy: { sortOrder: 'asc' } } },
  });
  return (
    <>
      <PageHeader title="집수리 교실 후기" description="사진(1~6장)과 글로 구성된 교실 후기를 등록·관리합니다. 사진은 좌측에서 자동 롤링됩니다." />
      <ReviewManager type="CLASS" reviews={reviews} />
    </>
  );
}
