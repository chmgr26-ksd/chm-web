import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import GalleryManager from './GalleryManager';
import Pager from '../Pager';

export const dynamic = 'force-dynamic';
const PAGE_SIZE = 24;

export default async function GalleryAdminPage({ searchParams }) {
  const session = await auth();
  if (!can(session?.user, 'gallery:manage')) {
    return (<><PageHeader title="갤러리 관리" /><EmptyState title="권한 없음" description="갤러리 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);
  const [total, images] = await Promise.all([
    prisma.galleryImage.count(),
    prisma.galleryImage.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  return (
    <>
      <PageHeader title="갤러리 관리" description="사이트 갤러리에 노출할 사진을 업로드·삭제합니다." />
      <GalleryManager images={images} />
      <Pager page={page} pageCount={pageCount} basePath="/dashboard/gallery" />
    </>
  );
}
