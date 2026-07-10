/** CHM 웹앱 Tailwind 설정 — 디자인 시스템 프리셋 소비.
 *  safelist(동적 브랜드 클래스)는 프리셋에서 자동 상속됩니다. */
module.exports = {
  presets: [require('@chm/design-system/tailwind.preset')],
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    // 벤더링된 디자인 시스템 컴포넌트가 쓰는 유틸리티 클래스도 스캔해야 생성됨
    './vendor/design-system/src/**/*.{js,jsx}',
    './node_modules/@chm/design-system/src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      // 랜딩 페이지(chm-group-design) 전용 팔레트.
      // 원본은 Tailwind v4 @theme + CSS 변수로 3개 테마를 전환했으나,
      // '따뜻한 온기'(theme-warm)로 확정되어 해당 값만 정적으로 이식.
      // DS 프리셋의 색 토큰(primary/trust/ink…)과 이름이 겹치지 않도록 chm- 접두사 유지.
      colors: {
        'chm-primary': '#d97706',
        'chm-primary-hover': '#b45309',
        'chm-bg': '#fffcf8',
        'chm-bg-alt': '#fff7ed',
        'chm-text': '#431407',
        'chm-text-muted': '#78350f',
        'chm-border': '#ffedd5',
        // 핵심가치 6색 — 브랜드 PDF 지정색(테마와 무관하게 고정)
        'chm-orange': '#F28C28',
        'chm-blue': '#2E75B6',
        'chm-green': '#4CAF50',
        'chm-yellow': '#F4C542',
        'chm-purple': '#7B4FA3',
        'chm-deepgreen': '#1F6E43',
      },
    },
  },
};
