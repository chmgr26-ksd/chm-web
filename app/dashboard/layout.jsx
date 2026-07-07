import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from './DashboardShell';

export const dynamic = 'force-dynamic';

// 대시보드 공용 셸(사이드바·상단바). 미들웨어가 STAFF/ADMIN 접근을 보장.
export default async function DashboardLayout({ children }) {
  const session = await auth();
  const user = session?.user;
  const newCount = await prisma.inquiry.count({ where: { status: 'NEW' } });
  return (
    <DashboardShell user={user} newCount={newCount}>
      {children}
    </DashboardShell>
  );
}
