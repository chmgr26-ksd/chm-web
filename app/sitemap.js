import { prisma } from '@/lib/prisma';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forestgreen-sheep-120944.hostingersite.com';

// /sitemap.xml — 정적 공개 페이지 + 발행된 소식 상세. 1시간마다 재생성.
export const revalidate = 3600;

export default async function sitemap() {
  const staticPaths = ['', '/about', '/business', '/news', '/events', '/gallery', '/faq', '/location', '/apply'];
  const staticRoutes = staticPaths.map((p) => ({
    url: `${SITE_URL}${p || '/'}`,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));

  let posts = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
  } catch {
    posts = [];
  }
  const postRoutes = posts.map((p) => ({
    url: `${SITE_URL}/news/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
