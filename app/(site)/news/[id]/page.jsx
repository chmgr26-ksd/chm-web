import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Button } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import { POST_CATEGORY } from '@/lib/posts';
import { CONTACT } from '../../../../components/site/constants';

export const dynamic = 'force-dynamic';

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

export async function generateMetadata({ params }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  return { title: post ? `${post.title} · CHM Group` : '소식 · CHM Group' };
}

export default async function NewsDetailPage({ params }) {
  const item = await prisma.post.findUnique({ where: { id: params.id } });
  if (!item || !item.published) notFound();
  const cat = POST_CATEGORY[item.category] || { label: item.category, value: 'trust' };

  return (
    <section className="bg-surface">
      <Container size="md" className="py-16">
        <Link href="/news" className="mb-8 inline-block text-body-sm font-bold text-primary hover:underline">← 목록으로</Link>

        <span className={`inline-block rounded-chm-full bg-${cat.value}-500 px-3 py-1 text-caption font-bold text-white`}>{cat.label}</span>
        <h1 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-ink-850">{item.title}</h1>
        <div className="mt-3 text-body-sm text-ink-500">{fmtDate(item.createdAt)} · {item.authorName || 'CHM Group'}</div>

        <div className="my-8 h-px bg-border" />

        <p className="whitespace-pre-line text-body-lg leading-relaxed text-ink-700">{item.body}</p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button as={Link} href="/apply" tone="cta" size="lg">참여 신청하기</Button>
          <a href={CONTACT.phoneHref} className="text-body-sm font-semibold text-ink-600 hover:text-primary">전화 문의 {CONTACT.phone}</a>
        </div>
      </Container>
    </section>
  );
}
