import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { CONTACT as DEFAULTS } from '@/components/site/constants';

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

// 이미지 캐시 버스터 — SiteImage.updatedAt(ms). 없으면 'd'(기본 파일).
async function readImageVersions() {
  let rows = [];
  try {
    rows = await prisma.siteImage.findMany({ select: { key: true, updatedAt: true } });
  } catch {
    rows = [];
  }
  const map = {};
  for (const k of Object.keys(SITE_IMAGE_SLOTS)) map[k] = 'd';
  for (const r of rows) map[r.key] = String(new Date(r.updatedAt).getTime());
  return map;
}

export const getSiteImageVersions = unstable_cache(readImageVersions, ['site-images'], { tags: ['site-images'] });

// 이미지 URL — 편집 시 ?v= 버전이 바뀌어 CDN 캐시를 우회.
export function siteImageUrl(key, versions) {
  const v = (versions && versions[key]) || 'd';
  return `/api/site-image/${key}?v=${v}`;
}

// 구글맵 임베드 URL — 저장된 주소로 생성(주소 변경 시 지도 자동 반영).
export function mapEmbedUrl(address) {
  const q = encodeURIComponent(address || DEFAULTS.address);
  return `https://maps.google.com/maps?q=${q}&z=15&hl=ko&output=embed`;
}
