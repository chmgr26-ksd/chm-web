import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import ReviewManager from '../ReviewManager';

export const dynamic = 'force-dynamic';

export default async function ExperienceReviewAdminPage() {
  const session = await auth();
  if (!can(session?.user, 'reviews:manage')) {
    return (<><PageHeader title="집수리 체험 후기" /><EmptyState title="권한 없음" description="후기 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const reviews = await prisma.review.findMany({
    where: { type: 'EXPERIENCE' },
    orderBy: { createdAt: 'desc' },
    include: { images: { select: { id: true, role: true, sortOrder: true }, orderBy: { sortOrder: 'asc' } } },
  });
  return (
    <>
      <PageHeader title="집수리 체험 후기" description="Before/After 사진과 설명으로 구성된 체험 후기를 등록·관리합니다." />
      <ReviewManager type="EXPERIENCE" reviews={reviews} />
    </>
  );
}
