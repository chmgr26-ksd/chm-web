import Link from 'next/link';
import { Container, EmptyState, Button } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import { POST_CATEGORY } from '@/lib/posts';
import PageBanner from '../../../components/site/PageBanner';

export const metadata = { title: '소식', description: '모집 공고, 행사 안내, 활동 소식을 전합니다.' };

const PAGE_SIZE = 12;

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

export default async function NewsPage({ searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page ?? '1', 10) || 1);

  // 목록은 본문(TEXT) 없이 필요한 필드만 조회 + 페이지네이션(무제한 findMany 제거).
  const [total, posts] = await Promise.all([
    prisma.post.count({ where: { published: true } }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, category: true, title: true, createdAt: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageBanner eyebrow="News" title="소식" description="모집 공고, 행사 안내, 활동 소식을 전합니다." />
      <section className="bg-surface">
        <Container size="xl" className="py-16">
          {posts.length === 0 ? (
            <EmptyState
              title={page > 1 ? '이 페이지에는 소식이 없습니다' : '등록된 소식이 없습니다'}
              description={page > 1 ? '범위를 벗어난 페이지입니다.' : '곧 새로운 소식으로 찾아뵙겠습니다.'}
              action={page > 1 ? <Button as={Link} href="/news" variant="soft" tone="ink" size="sm">처음으로</Button> : undefined}
            />
          ) : (
            <>
              <div className="flex flex-col gap-4">
                {posts.map((n) => {
                  const cat = POST_CATEGORY[n.category] || { label: n.category, value: 'trust' };
                  return (
                    <Link
                      key={n.id}
                      href={`/news/${n.id}`}
                      className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-chm-lg border border-border p-6 transition-all hover:border-ink-300 hover:shadow-chm-md"
                    >
                      <span className={`rounded-chm-full bg-${cat.value}-500 px-2.5 py-1 text-caption font-bold text-white`}>{cat.label}</span>
                      <span className="flex-1 text-body-lg font-bold text-ink-850">{n.title}</span>
                      <span className="text-body-sm text-ink-500">{fmtDate(n.createdAt)}</span>
                    </Link>
                  );
                })}
              </div>

              {pageCount > 1 && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button as={Link} href={`/news?page=${page - 1}`} variant="soft" tone="ink" size="sm" disabled={page <= 1}>← 이전</Button>
                  <span className="text-body-sm text-ink-600">{page} / {pageCount}</span>
                  <Button as={Link} href={`/news?page=${page + 1}`} variant="soft" tone="ink" size="sm" disabled={page >= pageCount}>다음 →</Button>
                </div>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
