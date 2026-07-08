const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forestgreen-sheep-120944.hostingersite.com';

// /robots.txt — 공개 페이지는 크롤 허용, 관리·인증·API는 차단.
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/account', '/api/', '/login', '/signup'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
