import { auth } from '@/auth';
import DashboardShell from './DashboardShell';

export const dynamic = 'force-dynamic';

// 대시보드 공용 셸(사이드바·상단바). 미들웨어가 STAFF/ADMIN 접근을 보장.
// 셸은 DB를 조회하지 않고 즉시 렌더 → 응답 첫 바이트를 빠르게 flush(타임아웃/잘림 방지).
// 각 페이지의 DB 조회는 loading.jsx(Suspense)가 처리.
export default async function DashboardLayout({ children }) {
  const session = await auth();
  const user = session?.user;
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
