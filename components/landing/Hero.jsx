'use client';

import { motion } from 'motion/react';

// 랜딩 히어로 — chm-group-design/src/components/Hero.tsx 이식.
// 원본은 fixed 헤더를 피하려 pt-32였으나, 이 앱의 SiteHeader는 sticky라 상단 여백을 줄임.
export default function Hero({ heroUrl = '/landing/hero.jpg', heroKind = 'image' }) {
  return (
    <section className="relative overflow-hidden bg-chm-bg-alt pb-20 pt-16 lg:pb-28 lg:pt-24">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-6 inline-block rounded-full bg-chm-primary/10 px-3 py-1 text-sm font-semibold text-chm-primary">
                생활환경 관리 전문기업
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 text-4xl font-bold leading-tight text-chm-text md:text-5xl lg:text-6xl"
            >
              사람을 키우고, <br />
              집을 고치고, <br />
              <span className="text-chm-primary">마을을 연결합니다</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-10 max-w-2xl text-lg leading-relaxed text-chm-text-muted md:text-xl"
            >
              기술로 자립하고, 신뢰로 연결하며, 공동체로 성장합니다. <br className="hidden md:block" />
              지역 주민의 참여로 주거와 생활환경의 문제를 해결하는 지속가능한 플랫폼.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#about"
                className="rounded-xl bg-chm-primary px-8 py-4 font-medium text-white shadow-lg shadow-chm-primary/20 transition-colors hover:bg-chm-primary-hover"
              >
                CHM Group 알아보기
              </a>
              <a
                href="#business"
                className="rounded-xl border border-chm-border bg-chm-bg px-8 py-4 font-medium text-chm-text transition-colors hover:bg-chm-bg-alt"
              >
                주요 사업분야
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mt-12 lg:mt-0"
          >
            <div className="absolute inset-0 translate-x-4 translate-y-4 transform rounded-3xl bg-chm-primary/10" />
            {heroKind === 'video' ? (
              /* poster는 정적 이미지라 업로드 영상과 불일치 → 생략하고 영상 자체 첫 프레임을 표시.
                 무음 자동재생이라 로딩 직후 현재 영상의 첫 장면이 뜬다. preload=auto로 첫 프레임을 앞당김. */
              <video
                src={heroUrl}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label="주민 기술자가 집수리 작업을 하는 모습"
                className="relative aspect-[4/3] w-full rounded-3xl bg-chm-bg-alt object-cover shadow-xl"
              />
            ) : (
              <img
                src={heroUrl}
                alt="주민 기술자가 집수리 작업을 하는 모습"
                width={1408}
                height={768}
                fetchPriority="high"
                className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-xl"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
