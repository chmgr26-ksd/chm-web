import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container, Button } from '@chm/design-system';
import { prisma } from '@/lib/prisma';
import { POST_CATEGORY, POST_GROUPS, groupOfCategory } from '@/lib/posts';
import { getContact } from '@/lib/siteContent';
import { htmlToText } from '@/lib/sanitizeHtml';
import RichText from '@/components/site/RichText';

export const revalidate = 120;

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

export async function generateMetadata(props) {
  const params = await props.params;
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post || !post.published) return { title: '소식' };
  const desc = htmlToText(post.body).slice(0, 150);
  return {
    title: post.title,
    description: desc,
    alternates: { canonical: `/news/${post.id}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: desc,
      url: `/news/${post.id}`,
      publishedTime: new Date(post.createdAt).toISOString(),
    },
  };
}

export default async function NewsDetailPage(props) {
  const params = await props.params;
  const item = await prisma.post.findUnique({ where: { id: params.id } });
  if (!item || !item.published) notFound();
  const c = await getContact();
  const cat = POST_CATEGORY[item.category] || { label: item.category, value: 'trust' };
  const backHref = POST_GROUPS[groupOfCategory(item.category)].publicPath;

  return (
    <section className="bg-surface">
      <Container size="md" className="py-16">
        <Link href={backHref} className="mb-8 inline-block text-body-sm font-bold text-primary hover:underline">← 목록으로</Link>

        <span className={`inline-block rounded-chm-full bg-${cat.value}-500 px-3 py-1 text-caption font-bold text-white`}>{cat.label}</span>
        <h1 className="mt-4 text-h1 font-bold leading-tight tracking-tight text-ink-850">{item.title}</h1>
        <div className="mt-3 text-body-sm text-ink-500">{fmtDate(item.createdAt)} · {item.authorName || 'CHM Group'}</div>

        <div className="my-8 h-px bg-border" />

        <RichText html={item.body} className="text-body-lg leading-relaxed text-ink-700" />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button as={Link} href="/apply" tone="cta" size="lg">참여 신청하기</Button>
          <a href={c.phoneHref} className="text-body-sm font-semibold text-ink-600 hover:text-primary">전화 문의 {c.phone}</a>
        </div>
      </Container>
    </section>
  );
}
