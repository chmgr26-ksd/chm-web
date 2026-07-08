import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import DashboardShell from './DashboardShell';

export const dynamic = 'force-dynamic';

// 대시보드 공용 셸(사이드바·상단바).
// 셸은 무거운 DB 집계를 조회하지 않고 즉시 렌더 → 응답 첫 바이트를 빠르게 flush(스트림 잘림 방지).
// 미들웨어가 1차로 걸러내지만 stale 토큰을 참조할 수 있으므로, auth()의 최신 역할로
// dashboard:access를 서버측 재확인한다(강등된 계정의 셸 접근 즉시 차단).
export default async function DashboardLayout({ children }) {
  const session = await auth();
  const user = session?.user;
  if (!can(user, 'dashboard:access')) redirect('/');
  return <DashboardShell user={user}>{children}</DashboardShell>;
}
