import { Container, Button, EmptyState } from '@chm/design-system';
import PageBanner from '@/components/site/PageBanner';
import BeforeAfter from '@/components/site/BeforeAfter';
import RichText from '@/components/site/RichText';
import { getContact } from '@/lib/siteContent';
import { prisma } from '@/lib/prisma';

export const metadata = { title: '집수리 체험 후기', description: '집수리 체험 전·후를 사진으로 확인하는 후기입니다.' };
export const dynamic = 'force-dynamic';

export default async function ExperienceReviewsPage() {
  const [reviews, { reviewFormUrl }] = await Promise.all([
    prisma.review.findMany({
      where: { type: 'EXPERIENCE', published: true },
      orderBy: { createdAt: 'desc' },
      include: { images: { where: { role: { in: ['BEFORE', 'AFTER'] } }, select: { id: true, role: true } } },
    }),
    getContact(),
  ]);

  return (
    <>
      <PageBanner eyebrow="Reviews" title="집수리 체험 후기" description="가운데 손잡이를 좌우로 밀어 수리 전·후를 비교해 보세요." />
      <section className="bg-surface">
        <Container size="xl" className="py-16">
          {reviews.length === 0 ? (
            <EmptyState title="등록된 후기가 없습니다" description="곧 집수리 전·후 사례로 찾아뵙겠습니다." />
          ) : (
            <div className="flex flex-col gap-14">
              {reviews.map((r) => {
                const beforeId = r.images.find((i) => i.role === 'BEFORE')?.id;
                const afterId = r.images.find((i) => i.role === 'AFTER')?.id;
                return (
                  <article key={r.id} className="grid items-center gap-8 md:grid-cols-2">
                    <BeforeAfter beforeId={beforeId} afterId={afterId} alt={r.title} />
                    <div>
                      <h2 className="text-h3 font-bold tracking-tight text-ink-850">{r.title}</h2>
                      {r.authorName && <p className="mt-1.5 text-body-sm font-semibold text-primary">{r.authorName}</p>}
                      <RichText html={r.body} className="mt-4 text-body leading-relaxed text-ink-700" />
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="mt-16 rounded-chm-xl border border-border bg-surface-warm p-8 text-center">
            <h2 className="text-h4 font-bold text-ink-850">집수리 체험에 참여하셨나요?</h2>
            <p className="mx-auto mt-3 max-w-xl text-body text-ink-600">소중한 후기를 남겨주시면 이 페이지에 소개됩니다.</p>
            <div className="mt-6">
              <Button as="a" href={reviewFormUrl} target="_blank" rel="noopener noreferrer" tone="cta">후기 남기기 (구글 폼) ↗</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
