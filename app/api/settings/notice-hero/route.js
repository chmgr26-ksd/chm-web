import { NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { can } from '@/lib/rbac';
import {
  NOTICE_HERO_DEFAULTS,
  NOTICE_HERO_RANGES,
  NOTICE_GRADIENT_PRESETS,
  clampInt,
  normalizeNoticeHeroConfig,
} from '@/lib/noticeHero';

// 공지 배너(NoticeHero) 설정 — settings:manage(관리자) 전용.

export async function GET() {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const s = await prisma.appSetting.findUnique({ where: { id: 'singleton' } });
  const cfg = normalizeNoticeHeroConfig(s);
  return NextResponse.json({
    ...cfg,
    defaults: NOTICE_HERO_DEFAULTS,
    ranges: NOTICE_HERO_RANGES,
    gradients: Object.entries(NOTICE_GRADIENT_PRESETS).map(([value, p]) => ({ value, label: p.label })),
  });
}

export async function PATCH(req) {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));

  // 검증·정규화 — 범위 밖 정수는 경계로 보정, 잘못된 그라디언트 key는 거부.
  const data = {
    noticeHeroInterval: clampInt(body.heroInterval, NOTICE_HERO_RANGES.heroInterval, NOTICE_HERO_DEFAULTS.heroInterval),
    noticeRollInterval: clampInt(body.rollInterval, NOTICE_HERO_RANGES.rollInterval, NOTICE_HERO_DEFAULTS.rollInterval),
    noticeExcerptLen: clampInt(body.excerptLen, NOTICE_HERO_RANGES.excerptLen, NOTICE_HERO_DEFAULTS.excerptLen),
    noticeGradient: NOTICE_GRADIENT_PRESETS[body.gradient] ? body.gradient : NOTICE_HERO_DEFAULTS.gradient,
    noticeAutoplay: body.autoplay !== false,
    noticeShowRoller: body.showRoller !== false,
  };

  await prisma.appSetting.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data },
  });
  revalidateTag('notice-hero');
  revalidatePath('/');
  return NextResponse.json({ ok: true });
}
