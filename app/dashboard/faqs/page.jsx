import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import FaqManager from './FaqManager';

export const dynamic = 'force-dynamic';

export default async function FaqsAdminPage() {
  const session = await auth();
  if (!can(session?.user, 'faqs:manage')) {
    return (<><PageHeader title="FAQ 관리" /><EmptyState title="권한 없음" description="FAQ 관리는 직원·관리자만 접근할 수 있습니다." /></>);
  }
  const faqs = await prisma.faq.findMany({ orderBy: { createdAt: 'asc' } });
  return (
    <>
      <PageHeader title="FAQ 관리" description="자주 묻는 질문을 추가·수정·삭제합니다. 공개한 항목만 사이트에 노출됩니다." />
      <FaqManager initialFaqs={faqs} />
    </>
  );
}
