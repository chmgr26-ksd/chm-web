'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NOTICE_HERO_DEFAULTS, slideGradient } from '@/lib/noticeHero';

// 알림마당 랜딩 상단 — 자동 순환 히어로 배너(좌) + 공지 롤러(우).
// design_handoff_notice_landing/NoticeLanding.dc.html의 Section 2를 이식하되,
// 색상은 기존 랜딩 웜 팔레트(앰버)로 맞추고, 콘텐츠는 실제 공지(Post)로 연동한다.
// 전환 간격·그라디언트 톤·발췌 길이·자동재생·롤러표시는 config(관리자 설정)로 제어.

const ROWH = 56; // 롤러 한 행 높이(px)
const VIS = 4;   // 롤러 동시 표시 행 수 (VIS*ROWH = 뷰포트 224px)

// 공지가 하나도 없을 때 배너 폴백(기관 소개 메시지).
const FALLBACK = [
  {
    id: null,
    label: '공지',
    value: 'trust',
    title: '지역과 함께 성장하는 생활환경 관리',
    excerpt: '집수리 서비스 · 집수리 교실 · 마을관리사업단으로 주민의 자립과 지역의 지속가능한 성장을 돕습니다.',
    date: '',
  },
];

function CatChip({ value, label }) {
  // trust/selfreliance/cooperation/innovation 브랜드 스케일(프리셋 safelist).
  return (
    <span
      className={`inline-flex flex-shrink-0 items-center rounded-md bg-${value}-50 px-2 text-[12px] font-extrabold leading-[22px] text-${value}-700`}
    >
      {label}
    </span>
  );
}

export default function NoticeHero({ notices = [], config }) {
  const cfg = config || NOTICE_HERO_DEFAULTS;
  const heroMs = cfg.heroInterval * 1000;
  const rollMs = cfg.rollInterval * 1000;

  const slides = notices.length ? notices.slice(0, 5) : FALLBACK;

  const [hero, setHero] = useState(0);
  const [playing, setPlaying] = useState(cfg.autoplay);

  // 배너 자동 전환 — hero/​playing 변경 시 타이머 리셋(수동 이동 후 간격 보장).
  useEffect(() => {
    if (!playing || slides.length <= 1) return undefined;
    const t = setInterval(() => setHero((h) => (h + 1) % slides.length), heroMs);
    return () => clearInterval(t);
  }, [playing, slides.length, hero, heroMs]);

  const go = (i) => setHero((i + slides.length) % slides.length);
  const cur = slides[hero];
  const curDesc =
    cur.excerpt && cur.excerpt.length > cfg.excerptLen
      ? `${cur.excerpt.slice(0, cfg.excerptLen)}…`
      : cur.excerpt;

  // ── 공지 롤러 ──
  // autoplay이고 표시행보다 많을 때만 자동 스크롤(+복제 구간). 아니면 정적 표시.
  const canRoll = cfg.autoplay && notices.length > VIS;
  const [roll, setRoll] = useState(0);
  const [rollTrans, setRollTrans] = useState(true);

  useEffect(() => {
    if (!canRoll) return undefined;
    const t = setInterval(() => {
      setRollTrans(true);
      setRoll((r) => r + 1);
    }, rollMs);
    return () => clearInterval(t);
  }, [canRoll, rollMs]);

  // 끝(복제 구간)에 도달하면 트랜지션 없이 0으로 리셋 → 무한 루프.
  useEffect(() => {
    if (!canRoll || roll < notices.length) return undefined;
    const to = setTimeout(() => {
      setRollTrans(false);
      setRoll(0);
    }, 520);
    return () => clearTimeout(to);
  }, [roll, canRoll, notices.length]);

  const rollerItems = canRoll ? notices.concat(notices.slice(0, VIS)) : notices;

  return (
    <section className="bg-chm-bg">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 pt-8 sm:px-6 lg:flex-row lg:items-stretch lg:px-8">
        {/* ── 2a. 히어로 배너(자동 순환) ── */}
        <div
          className="relative min-w-0 flex-1 overflow-hidden rounded-2xl shadow-xl"
          style={{ height: 440, minHeight: 360 }}
        >
          {/* 배경 슬라이드 스택(크로스페이드) */}
          <div className="absolute inset-0">
            {slides.map((s, i) => {
              return (
                <div
                  key={s.id ?? `f${i}`}
                  className="absolute inset-0 transition-opacity duration-700 ease-in-out"
                  style={{
                    opacity: i === hero ? 1 : 0,
                    background: slideGradient(cfg.gradient, s.value, i),
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: 0.14,
                      backgroundImage:
                        'repeating-linear-gradient(135deg, rgba(255,255,255,.7) 0 2px, transparent 2px 24px)',
                    }}
                  />
                </div>
              );
            })}
          </div>
          {/* 가독성 오버레이 */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, rgba(67,20,7,.6), rgba(67,20,7,.06) 60%)' }}
          />

          {/* 텍스트 오버레이 */}
          <div className="absolute inset-x-6 bottom-16 text-white sm:inset-x-11 sm:bottom-[70px]">
            <span
              className="inline-flex h-7 items-center rounded-full px-3 text-[13px] font-bold backdrop-blur-sm"
              style={{ background: 'rgba(255,255,255,.18)' }}
            >
              {cur.label}
            </span>
            <h2
              className="mb-2.5 mt-4 max-w-[640px] text-[26px] font-extrabold leading-[1.25] sm:text-[34px]"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,.25)' }}
            >
              {cur.title}
            </h2>
            {curDesc ? (
              <p className="m-0 hidden max-w-[560px] text-[15px] leading-[1.55] text-white/90 sm:block sm:text-[16px]">
                {curDesc}
              </p>
            ) : null}
            <Link
              href={cur.id ? `/news/${cur.id}` : '/news/notices'}
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-[10px] border-[1.5px] border-white/70 px-5 text-[15px] font-bold text-white transition-colors hover:bg-white/10"
            >
              자세히 보기 <span className="text-[18px]">→</span>
            </Link>
          </div>

          {/* 컨트롤 바 */}
          <div className="absolute inset-x-6 bottom-[26px] flex items-center gap-4 sm:inset-x-11">
            <button
              type="button"
              onClick={() => go(hero - 1)}
              aria-label="이전 공지"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/50 bg-white/10 text-[18px] leading-none text-white hover:bg-white/20"
            >
              ‹
            </button>
            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id ?? `d${i}`}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1}번째 공지`}
                  className="h-[9px] rounded-full transition-all duration-300"
                  style={{
                    width: i === hero ? 30 : 9,
                    background: i === hero ? '#fff' : 'rgba(255,255,255,.45)',
                  }}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(hero + 1)}
              aria-label="다음 공지"
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/50 bg-white/10 text-[18px] leading-none text-white hover:bg-white/20"
            >
              ›
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? '자동 전환 정지' : '자동 전환 재생'}
              className="flex h-[30px] items-center gap-[7px] rounded-full border border-white/50 bg-white/10 px-3 text-[12.5px] font-semibold text-white"
            >
              {playing ? (
                <span className="inline-flex gap-[3px]">
                  <span className="block h-[11px] w-[3px] rounded-[1px] bg-white" />
                  <span className="block h-[11px] w-[3px] rounded-[1px] bg-white" />
                </span>
              ) : (
                <span
                  className="block"
                  style={{
                    width: 0,
                    height: 0,
                    borderStyle: 'solid',
                    borderWidth: '6px 0 6px 10px',
                    borderColor: 'transparent transparent transparent #fff',
                  }}
                />
              )}
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>
                {hero + 1} / {slides.length}
              </span>
            </button>
          </div>

          {/* 진행바 — 슬라이드/재생상태 변경 시 remount로 애니메이션 리셋 */}
          <div
            key={`${hero}-${playing}`}
            className="absolute inset-x-0 bottom-0 h-1"
            style={{
              transformOrigin: 'left',
              transform: 'scaleX(0)',
              background: 'rgba(255,255,255,.85)',
              animation: `chm-hprog ${heroMs}ms linear forwards`,
              animationPlayState: playing && slides.length > 1 ? 'running' : 'paused',
            }}
          />
        </div>

        {/* ── 2b. 공지 롤러(자동 세로 스크롤) — 관리자 설정으로 표시 여부 제어 ── */}
        {cfg.showRoller ? (
        <aside className="flex w-full flex-col overflow-hidden rounded-2xl border border-chm-border bg-white shadow-lg lg:w-[388px] lg:flex-shrink-0">
          <div className="flex items-center justify-between px-[22px] pb-[14px] pt-5">
            <div className="flex items-baseline gap-[9px]">
              <h3 className="m-0 text-[19px] font-extrabold text-chm-text">공지사항</h3>
              <span className="text-[12.5px] font-bold text-chm-primary">NOTICE</span>
            </div>
            <Link href="/news/notices" className="flex items-center gap-[3px] text-[13px] text-chm-text-muted hover:text-chm-primary">
              전체보기 <span className="text-[15px]">＋</span>
            </Link>
          </div>
          <div className="mx-[22px] h-px bg-chm-border" />

          <div className="relative my-1.5 overflow-hidden" style={{ height: ROWH * VIS }}>
            {notices.length === 0 ? (
              <div className="flex h-full items-center justify-center px-6 text-[14px] text-chm-text-muted">
                등록된 공지가 없습니다.
              </div>
            ) : (
              <div
                style={{
                  transform: `translateY(${-roll * ROWH}px)`,
                  transition: rollTrans ? 'transform .5s ease' : 'none',
                }}
              >
                {rollerItems.map((it, i) => (
                  <Link
                    key={`${it.id}-${i}`}
                    href={`/news/${it.id}`}
                    className="flex items-center gap-[11px] border-b border-chm-border px-[22px]"
                    style={{ height: ROWH }}
                  >
                    <CatChip value={it.value} label={it.label} />
                    <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14.5px] font-semibold text-chm-text">
                      {it.title}
                    </span>
                    <span
                      className="flex-shrink-0 text-[12.5px] text-chm-text-muted/70"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {it.date.slice(5)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
            {/* 하단 페이드 마스크 */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-8"
              style={{ background: 'linear-gradient(transparent, #fff)' }}
            />
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-chm-border px-[22px] pb-5 pt-[14px]">
            <Link
              href="/apply"
              className="flex h-11 items-center justify-center gap-1.5 rounded-[10px] bg-chm-primary text-[14px] font-bold text-white transition-colors hover:bg-chm-primary-hover"
            >
              집수리 신청
            </Link>
            <Link
              href="/news/notices"
              className="flex h-11 items-center justify-center gap-1.5 rounded-[10px] bg-chm-bg-alt text-[14px] font-bold text-chm-primary transition-colors hover:bg-chm-border"
            >
              전체 소식
            </Link>
          </div>
        </aside>
        ) : null}
      </div>
    </section>
  );
}
