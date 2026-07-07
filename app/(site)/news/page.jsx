import Link from 'next/link';
import { Container, EmptyState } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import { POST_CATEGORY } from '@/lib/posts';
import PageBanner from '../../../components/site/PageBanner';

export const dynamic = 'force-dynamic';
export const metadata = { title: '소식 · CHM Group' };

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

export default async function NewsPage() {
  const posts = await prisma.post.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' } });

  return (
    <>
      <PageBanner eyebrow="News" title="소식" description="모집 공고, 행사 안내, 활동 소식을 전합니다." />
      <section className="bg-surface">
        <Container size="xl" className="py-16">
          {posts.length === 0 ? (
            <EmptyState title="등록된 소식이 없습니다" description="곧 새로운 소식으로 찾아뵙겠습니다." />
          ) : (
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
          )}
        </Container>
      </section>
    </>
  );
}
