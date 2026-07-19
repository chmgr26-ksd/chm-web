import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CONTACT as DEFAULTS } from '@/components/site/constants';
import { POST_CATEGORY } from '@/lib/posts';
import { normalizeNoticeHeroConfig } from '@/lib/noticeHero';

// 서버 전용 — 관리자 편집 가능한 사이트 콘텐츠(연락처 + 이미지) 접근 헬퍼.
// unstable_cache(태그)로 감싸 페이지는 정적/ISR로 유지하되, 저장 시 revalidateTag로 즉시 갱신.

// 관리자가 교체 가능한 이미지 슬롯 — key → 기본 public 파일 / 라벨 / 영향 페이지.
export const SITE_IMAGE_SLOTS = {
  'about-team':     { default: 'about/team.jpg',     label: '소개 · 단체 사진',     page: '/about' },
  'business-field': { default: 'business/field.jpg', label: '사업 안내 · 현장 사진', page: '/business' },
  'landing-hero':   { default: 'landing/hero.jpg',   label: '랜딩 · 히어로 이미지',  page: '/' },
  'main-field':     { default: 'main/field.jpg',     label: '메인 · 현장 사진',      page: '/main' },
};

// 연락처/기관 정보 — DB(AppSetting) 값 우선, 없으면 constants 기본값.
async function readContact() {
  let s = null;
  try {
    s = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
  } catch {
    s = null;
  }
  const phone = s?.contactPhone || DEFAULTS.phone;
  return {
    phone,
    phoneHref: `tel:${String(phone).replace(/[^0-9+]/g, '')}`,
    email: s?.contactEmail || DEFAULTS.email,
    address: s?.contactAddress || DEFAULTS.address,
    addressDetail: s?.contactAddressDetail || DEFAULTS.addressDetail,
    hours: s?.contactHours || DEFAULTS.hours,
    rep: s?.contactRep || DEFAULTS.rep,
    companyKo: s?.companyKo || DEFAULTS.companyKo,
    companyEn: s?.companyEn || DEFAULTS.companyEn,
  };
}

export const getContact = unstable_cache(readContact, ['site-contact'], { tags: ['site-contact'] });

// 기본(public) 이미지 버전 — 기본 파일을 교체(재생성)할 때 올려서 CDN 캐시를 우회.
const DEFAULT_VER = 'd3';

// 이미지 캐시 버스터 — SiteImage.updatedAt(ms). 없으면 DEFAULT_VER(기본 파일).
async function readImageVersions() {
  let rows = [];
  try {
    rows = await prisma.siteImage.findMany({ select: { key: true, updatedAt: true } });
  } catch {
    rows = [];
  }
  const map = {};
  for (const k of Object.keys(SITE_IMAGE_SLOTS)) map[k] = DEFAULT_VER;
  for (const r of rows) map[r.key] = String(new Date(r.updatedAt).getTime());
  return map;
}

export const getSiteImageVersions = unstable_cache(readImageVersions, ['site-images'], { tags: ['site-images'] });

// 이미지 URL — 편집 시 ?v= 버전이 바뀌어 CDN 캐시를 우회.
export function siteImageUrl(key, versions) {
  const v = (versions && versions[key]) || DEFAULT_VER;
  return `/api/site-image/${key}?v=${v}`;
}

// 랜딩 공지 롤러/히어로용 — 게시된 공지(Post) 최신 목록.
// unstable_cache(tag 'posts')로 홈을 정적 유지, 관리자 편집 시 revalidateTag('posts')로 즉시 갱신.
function fmtNoticeDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

// 본문(HTML/마크다운) → 평문 발췌. 표시 길이/말줄임은 컴포넌트에서 설정값으로 적용하므로
// 여기선 넉넉히(200자) 잘라 캐시를 설정과 무관하게 유지한다.
function excerpt(body, n = 200) {
  const plain = String(body || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.length > n ? plain.slice(0, n) : plain;
}

async function readRecentNotices() {
  let rows = [];
  try {
    rows = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, category: true, title: true, body: true, createdAt: true },
      take: 8,
    });
  } catch {
    rows = [];
  }
  return rows.map((p) => {
    const cat = POST_CATEGORY[p.category] || { label: p.category, value: 'trust' };
    return {
      id: p.id,
      label: cat.label,
      value: cat.value,
      title: p.title,
      date: fmtNoticeDate(p.createdAt),
      excerpt: excerpt(p.body),
    };
  });
}

export const getRecentNotices = unstable_cache(readRecentNotices, ['recent-notices'], {
  tags: ['posts'],
  revalidate: 300,
});

// 공지 배너(NoticeHero) 설정 — AppSetting 값 정규화(널·이상값은 기본값 폴백).
// 저장 시 revalidateTag('notice-hero')로 즉시 갱신.
async function readNoticeHeroConfig() {
  let s = null;
  try {
    s = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
  } catch {
    s = null;
  }
  return normalizeNoticeHeroConfig(s);
}

export const getNoticeHeroConfig = unstable_cache(readNoticeHeroConfig, ['notice-hero-config'], {
  tags: ['notice-hero'],
  revalidate: 300,
});

// 구글맵 임베드 URL — 저장된 주소로 생성(주소 변경 시 지도 자동 반영).
export function mapEmbedUrl(address) {
  // 도로명주소를 쿼리로 지오코딩 → 건물 단위 핀. z=17로 건물이 보이게 확대.
  const q = encodeURIComponent(address || DEFAULTS.address);
  return `https://maps.google.com/maps?q=${q}&z=17&hl=ko&output=embed`;
}
