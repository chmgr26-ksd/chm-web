import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import MailSettingsForm from './MailSettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return (
      <>
        <PageHeader title="설정" />
        <EmptyState title="관리자 전용" description="설정은 관리자만 접근할 수 있습니다." />
      </>
    );
  }
  return (
    <>
      <PageHeader
        title="알림 설정"
        description="문의가 접수되면 발송할 이메일 알림(발신 계정·수신자)을 관리합니다."
      />
      <MailSettingsForm />
    </>
  );
}
