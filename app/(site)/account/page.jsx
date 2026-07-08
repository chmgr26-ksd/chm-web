import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { Container, Badge, EmptyState, Button } from '@chm/design-system';
import { can, ROLE_LABEL } from '@/lib/rbac';
import PageBanner from '../../../components/site/PageBanner';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: '마이페이지 · CHM Group' };

const TYPE_LABEL = { REPAIR: '집수리 서비스', EDU: '집수리 교실', VOL: '자원봉사·협력' };
const TYPE_VALUE = { REPAIR: 'selfreliance', EDU: 'trust', VOL: 'community' };
const STATUS_LABEL = { NEW: '접수', CONTACTED: '확인 연락', SCHEDULED: '일정 조율', DONE: '완료', CANCELED: '취소' };
const STATUS_VALUE = { NEW: 'trust', CONTACTED: 'community', SCHEDULED: 'selfreliance', DONE: 'cooperation', CANCELED: 'innovation' };

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login'); // 미들웨어 우회/엣지케이스 방어(500 방지)
  const [dbUser, inquiries] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id } }),
    prisma.inquiry.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: 'desc' } }),
  ]);
  if (!dbUser) redirect('/login'); // 계정이 삭제된 stale 세션 → 오래된 정보 노출 방지
  const user = dbUser;

  return (
    <>
      <PageBanner
        eyebrow="My page"
        title="마이페이지"
        description="내 정보와 신청 내역을 확인할 수 있습니다."
      />
      <section className="bg-surface">
        <Container size="xl" className="flex flex-col gap-10 py-14">
          <div className="grid gap-8 md:grid-cols-[0.9fr_1.6fr] md:items-start">
          {/* 내 정보 */}
          <div className="rounded-chm-lg border border-border p-6">
            <h2 className="mb-4 text-h4 font-bold text-ink-850">내 정보</h2>
            <dl className="flex flex-col gap-3 text-body-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">이름</dt>
                <dd className="font-semibold text-ink-800">{user.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">이메일</dt>
                <dd className="text-ink-800">{user.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">구분</dt>
                <dd><Badge value="trust">{ROLE_LABEL[user.role] || '회원'}</Badge></dd>
              </div>
            </dl>
            {can(user, 'dashboard:access') && (
              <div className="mt-5 border-t border-border pt-5">
                <Button as={Link} href="/dashboard" variant="soft" tone="primary" size="sm" block>업무 대시보드로</Button>
              </div>
            )}
          </div>

          {/* 내 신청 내역 */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-h4 font-bold text-ink-850">내 신청 내역</h2>
              <Button as={Link} href="/apply" tone="cta" size="sm">새 신청</Button>
            </div>

            {inquiries.length === 0 ? (
              <EmptyState
                title="아직 신청 내역이 없습니다"
                description="로그인 상태로 참여 신청을 하시면 이곳에서 진행 상황을 확인할 수 있습니다."
                action={<Button as={Link} href="/apply" tone="cta" size="sm">참여 신청하기</Button>}
              />
            ) : (
              <ul className="flex flex-col gap-3">
                {inquiries.map((q) => (
                  <li key={q.id} className="rounded-chm-lg border border-border p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge value={TYPE_VALUE[q.type]}>{TYPE_LABEL[q.type]}</Badge>
                      <Badge value={STATUS_VALUE[q.status]} dot>{STATUS_LABEL[q.status]}</Badge>
                      <span className="ml-auto text-caption text-ink-500">{fmtDate(q.createdAt)}</span>
                    </div>
                    {q.area && <div className="text-body-sm text-ink-600">지역: {q.area}</div>}
                    {q.message && <p className="mt-1 whitespace-pre-line text-body-sm leading-normal text-ink-700">{q.message}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          </div>

          {/* 내 정보 수정 · 비밀번호 변경 */}
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-chm-lg border border-border p-6">
              <h2 className="mb-4 text-h4 font-bold text-ink-850">내 정보 수정</h2>
              <ProfileForm initialName={user.name} initialPhone={user.phone || ''} />
            </div>
            <div className="rounded-chm-lg border border-border p-6">
              <h2 className="mb-4 text-h4 font-bold text-ink-850">비밀번호 변경</h2>
              <PasswordForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
