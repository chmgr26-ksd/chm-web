// 공지 배너(NoticeHero) 설정 — 기본값·범위·그라디언트 프리셋.
// 컴포넌트(렌더) · API(검증) · 관리자 폼(UI)에서 공유해 값이 어긋나지 않게 한다.

export const NOTICE_HERO_DEFAULTS = {
  heroInterval: 5, // 배너 자동 전환(초)
  rollInterval: 3, // 공지 롤러 이동(초)
  gradient: 'amber', // 그라디언트 톤 프리셋 key
  excerptLen: 90, // 배너 설명 발췌 길이(자)
  autoplay: true, // 자동 전환/롤링
  showRoller: true, // 우측 공지 롤러 표시
};

export const NOTICE_HERO_RANGES = {
  heroInterval: { min: 3, max: 10 },
  rollInterval: { min: 2, max: 6 },
  excerptLen: { min: 40, max: 160 },
};

// 그라디언트 톤 프리셋 — 배너 슬라이드마다 순환 적용.
// colors: [[from,to], ...] / 'brand'는 colors:null → 카테고리 브랜드색(CSS 변수) 사용.
export const NOTICE_GRADIENT_PRESETS = {
  amber: {
    label: '앰버 (기본 · 웜 오렌지)',
    colors: [
      ['#b45309', '#f59e0b'],
      ['#9a3412', '#ea580c'],
      ['#a16207', '#eab308'],
      ['#92400e', '#d97706'],
      ['#7c2d12', '#c2410c'],
    ],
  },
  sunset: {
    label: '선셋 (진한 주황·레드)',
    colors: [
      ['#7c2d12', '#ea580c'],
      ['#9f1239', '#fb7185'],
      ['#7c2d12', '#f97316'],
      ['#9a3412', '#f43f5e'],
      ['#831843', '#f97316'],
    ],
  },
  gold: {
    label: '골드 (밝은 노랑·앰버)',
    colors: [
      ['#a16207', '#facc15'],
      ['#ca8a04', '#fde047'],
      ['#b45309', '#fbbf24'],
      ['#a16207', '#fcd34d'],
      ['#92400e', '#f59e0b'],
    ],
  },
  brand: {
    label: '브랜드 6색 (카테고리별)',
    colors: null,
  },
};

export const NOTICE_GRADIENT_KEYS = Object.keys(NOTICE_GRADIENT_PRESETS);

// 정수 설정값 정규화 — 숫자 아님/범위 밖이면 기본값·경계로 보정.
export function clampInt(value, { min, max }, fallback) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

// AppSetting 행 → 렌더/응답용 정규화 config(널·이상값은 기본값으로 폴백).
export function normalizeNoticeHeroConfig(s) {
  const g = NOTICE_GRADIENT_PRESETS[s?.noticeGradient] ? s.noticeGradient : NOTICE_HERO_DEFAULTS.gradient;
  return {
    heroInterval: clampInt(s?.noticeHeroInterval, NOTICE_HERO_RANGES.heroInterval, NOTICE_HERO_DEFAULTS.heroInterval),
    rollInterval: clampInt(s?.noticeRollInterval, NOTICE_HERO_RANGES.rollInterval, NOTICE_HERO_DEFAULTS.rollInterval),
    gradient: g,
    excerptLen: clampInt(s?.noticeExcerptLen, NOTICE_HERO_RANGES.excerptLen, NOTICE_HERO_DEFAULTS.excerptLen),
    autoplay: s?.noticeAutoplay ?? NOTICE_HERO_DEFAULTS.autoplay,
    showRoller: s?.noticeShowRoller ?? NOTICE_HERO_DEFAULTS.showRoller,
  };
}

// 슬라이드 배경 그라디언트 — 프리셋 colors 순환 또는 카테고리 브랜드색(CSS 변수).
export function slideGradient(gradientKey, value, index) {
  const preset = NOTICE_GRADIENT_PRESETS[gradientKey] || NOTICE_GRADIENT_PRESETS.amber;
  if (preset.colors) {
    const [a, b] = preset.colors[index % preset.colors.length];
    return `linear-gradient(135deg, ${a}, ${b})`;
  }
  return `linear-gradient(135deg, var(--chm-${value}-600), var(--chm-${value}-400))`;
}
