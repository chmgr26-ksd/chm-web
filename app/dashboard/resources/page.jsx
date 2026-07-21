import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import ResourceManager from './ResourceManager';

export const dynamic = 'force-dynamic';

export default async function ResourceAdminPage() {
  const session = await auth();
  if (!can(session?.user, 'resources:manage')) {
    return (<><PageHeader title="자료실 관리" /><EmptyState title="권한 없음" description="자료실 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const resources = await prisma.resource.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, description: true, filename: true, ext: true, size: true, published: true, createdAt: true },
  });
  return (
    <>
      <PageHeader title="자료실 관리" description="PDF·HWP(X)·Office 문서를 업로드하고 설명을 추가합니다. 공개 자료는 자료실 페이지에서 내려받을 수 있습니다." />
      <ResourceManager resources={resources} />
    </>
  );
}
