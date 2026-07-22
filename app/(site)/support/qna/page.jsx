import Link from 'next/link';
import { Container, Button } from '@chm/design-system';
import PageBanner from '@/components/site/PageBanner';
import RichText from '@/components/site/RichText';
import QnaForm from '@/components/site/QnaForm';
import { prisma } from '@/lib/prisma';

export const metadata = { title: 'QNA', description: '궁금한 점을 남겨주세요. 확인 후 답변드립니다.' };
export const dynamic = 'force-dynamic';

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}
// 작성자 이름 마스킹 — 첫 글자만 노출(홍길동 → 홍**).
function maskName(name) {
  const s = (name || '').trim();
  if (s.length <= 1) return s || '익명';
  return s[0] + '*'.repeat(Math.min(s.length - 1, 3));
}

export default async function QnaPage() {
  // 공개(isPublic)로 표시된, 답변 완료 문의만 게시판에 노출.
  const posts = await prisma.qnaPost.findMany({
    where: { isPublic: true, answered: true },
    orderBy: { createdAt: 'desc' },
    take: 30,
    select: { id: true, authorName: true, title: true, body: true, answer: true, createdAt: true },
  });

  return (
    <>
      <PageBanner eyebrow="Q&A" title="QNA" description="궁금한 점을 남겨주세요. 확인 후 답변드립니다." />
      <section className="bg-surface">
        <Container size="md" className="py-16">
          {/* 문의하기 폼 */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-h3 font-bold tracking-tight text-ink-850">문의하기</h2>
            <Button as={Link} href="/support/faq" variant="soft" tone="ink" size="sm">FAQ 먼저 보기</Button>
          </div>
          <QnaForm />

          {/* 공개 답변 게시판 */}
          <div className="mt-16">
            <h2 className="mb-4 text-h3 font-bold tracking-tight text-ink-850">답변 완료된 문의</h2>
            {posts.length === 0 ? (
              <div className="rounded-chm-lg border border-border bg-surface-muted p-8 text-center text-body-sm text-ink-500">
                공개된 문의·답변이 아직 없습니다. 위에서 궁금한 점을 남겨주세요.
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {posts.map((p) => (
                  <li key={p.id} className="rounded-chm-lg border border-border bg-surface p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-body-lg font-bold text-ink-850">{p.title}</h3>
                      <span className="text-caption text-ink-500">{maskName(p.authorName)} · {fmtDate(p.createdAt)}</span>
                    </div>
                    <RichText html={p.body} className="mt-3 text-body-sm text-ink-700" />
                    {p.answer && (
                      <div className="mt-4 rounded-chm-md border border-trust-100 bg-surface-cool p-4">
                        <div className="mb-1.5 text-caption font-bold text-primary">답변</div>
                        <RichText html={p.answer} className="text-body-sm text-ink-700" />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
