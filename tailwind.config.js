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
};
