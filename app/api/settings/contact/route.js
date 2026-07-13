import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import { CONTACT as DEFAULTS } from '@/components/site/constants';

// 연락처/기관 정보 설정 — settings:manage(관리자) 전용.
const FIELDS = [
  'contactPhone', 'contactEmail', 'contactAddress', 'contactAddressDetail',
  'contactHours', 'contactRep', 'companyKo', 'companyEn',
];

export async function GET() {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const s = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
  const out = {};
  for (const f of FIELDS) out[f] = s?.[f] ?? '';
  // 비워두면 표시될 기본값(플레이스홀더 용)
  out.defaults = {
    contactPhone: DEFAULTS.phone,
    contactEmail: DEFAULTS.email,
    contactAddress: DEFAULTS.address,
    contactAddressDetail: DEFAULTS.addressDetail,
    contactHours: DEFAULTS.hours,
    contactRep: DEFAULTS.rep,
    companyKo: DEFAULTS.companyKo,
    companyEn: DEFAULTS.companyEn,
  };
  return NextResponse.json(out);
}

export async function PATCH(req) {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data = {};
  for (const f of FIELDS) {
    if (f in body) {
      const v = (body[f] ?? '').toString().trim();
      data[f] = v === '' ? null : v.slice(0, 1000); // 빈 값 = 기본값으로 폴백
    }
  }
  await prisma.appSetting.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data },
  });
  revalidateTag('site-contact');
  // 연락처(특히 푸터)는 모든 페이지에 노출되므로 전체 레이아웃 재검증.
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true });
}
