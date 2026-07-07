import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import DashboardShell from './DashboardShell';

export const dynamic = 'force-dynamic';

// 대시보드 공용 셸(사이드바·상단바). 미들웨어가 STAFF/ADMIN 접근을 보장.
export default async function DashboardLayout({ children }) {
  const session = await auth();
  const user = session?.user;
  // DB 조회 실패가 레이아웃 전체를 죽이지 않도록 방어(사이드바 배지용).
  let newCount = 0;
  try {
    newCount = await prisma.inquiry.count({ where: { status: 'NEW' } });
  } catch {
    newCount = 0;
  }
  return (
    <DashboardShell user={user} newCount={newCount}>
      {children}
    </DashboardShell>
  );
}
