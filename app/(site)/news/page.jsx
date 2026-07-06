import Link from 'next/link';
import { Container } from '@chm/design-system';
import PageBanner from '../../../components/site/PageBanner';
import { NEWS } from '../../../components/site/constants';

export const metadata = { title: '소식 · CHM Group' };

export default function NewsPage() {
  return (
    <>
      <PageBanner
        eyebrow="News"
        title="소식"
        description="모집 공고, 행사 안내, 활동 소식을 전합니다."
      />
      <section className="bg-surface">
        <Container size="xl" className="py-16">
          <div className="flex flex-col gap-4">
            {NEWS.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-chm-lg border border-border p-6 transition-all hover:border-ink-300 hover:shadow-chm-md"
              >
                <span className={`rounded-chm-full bg-${n.value}-500 px-2.5 py-1 text-caption font-bold text-white`}>{n.cat}</span>
                <span className="flex-1 text-body-lg font-bold text-ink-850">{n.title}</span>
                <span className="text-body-sm text-ink-500">{n.date}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
