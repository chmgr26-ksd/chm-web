import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import GalleryManager from './GalleryManager';

export const dynamic = 'force-dynamic';

export default async function GalleryAdminPage() {
  const session = await auth();
  if (!can(session?.user, 'gallery:manage')) {
    return (<><PageHeader title="갤러리 관리" /><EmptyState title="권한 없음" description="갤러리 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const images = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true },
  });
  return (
    <>
      <PageHeader title="갤러리 관리" description="사이트 갤러리에 노출할 사진을 업로드·삭제합니다." />
      <GalleryManager images={images} />
    </>
  );
}
