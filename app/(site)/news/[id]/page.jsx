import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Button } from '@chm/design-system';
import { NEWS, CONTACT } from '../../../../components/site/constants';

export function generateStaticParams() {
  return NEWS.map((n) => ({ id: String(n.id) }));
}

export function generateMetadata({ params }) {
  const item = NEWS.find((n) => String(n.id) === params.id);
  return { title: item ? `${item.title} · CHM Group` : '소식 · CHM Group' };
}

export default function NewsDetailPage({ params }) {
  const item = NEWS.find((n) => String(n.id) === params.id);
  if (!item) notFound();

  return (
    <section className="bg-surface">
      <Container size="md" className="py-16">
        <Link href="/news" className="mb-8 inline-block text-body-sm font-bold text-primary hover:underline">← 목록으로</Link>

        <span className={`inline-block rounded-chm-full bg-${item.value}-500 px-3 py-1 text-caption font-bold text-white`}>{item.cat}</span>
        <h1 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-ink-850">{item.title}</h1>
        <div className="mt-3 text-body-sm text-ink-500">{item.date} · CHM Group</div>

        <div className="my-8 h-px bg-border" />

        <p className="whitespace-pre-line text-body-lg leading-relaxed text-ink-700">{item.body}</p>

        <div className="mt-10 flex aspect-[16/8] items-center justify-center rounded-chm-lg border border-dashed border-ink-300 bg-surface-warm">
          <span className="font-mono text-caption text-ink-500">관련 사진 · 포스터</span>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button as={Link} href="/apply" tone="cta" size="lg">참여 신청하기</Button>
          <a
            href={CONTACT.phoneHref}
            className="text-body-sm font-semibold text-ink-600 hover:text-primary"
          >
            전화 문의 {CONTACT.phone}
          </a>
        </div>
      </Container>
    </section>
  );
}
