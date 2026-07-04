/**
 * CHM Group Design System — Tailwind Preset
 *
 * 사용법 (앱의 tailwind.config.js):
 *   const chmPreset = require('@chm/design-system/tailwind.preset');
 *   module.exports = { presets: [chmPreset], content: [...] };
 *
 * 그러면 다음과 같은 유틸리티를 쓸 수 있습니다:
 *   bg-trust-500  text-selfreliance-600  border-cooperation-200
 *   bg-primary    text-ink-800           shadow-chm-md
 *   rounded-chm-lg  font-sans
 *
 * 컬러 값은 src/tokens/tokens.css 의 CSS 변수와 1:1 대응됩니다.
 */

const scale = (name) => ({
  50:  `var(--chm-${name}-50)`,
  100: `var(--chm-${name}-100)`,
  200: `var(--chm-${name}-200)`,
  300: `var(--chm-${name}-300)`,
  400: `var(--chm-${name}-400)`,
  500: `var(--chm-${name}-500)`,
  600: `var(--chm-${name}-600)`,
  700: `var(--chm-${name}-700)`,
  800: `var(--chm-${name}-800)`,
  900: `var(--chm-${name}-900)`,
  DEFAULT: `var(--chm-${name}-500)`,
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 컴포넌트가 value/tone prop으로 클래스를 동적 조합하므로 브랜드 컬러를
  // safelist로 보장 (이 프리셋을 쓰는 앱이 자동 상속 — 별도 설정 불필요).
  safelist: [
    {
      pattern: /(bg|text|border|ring)-(trust|selfreliance|cooperation|community|innovation|sustainability)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    'bg-primary', 'bg-primary-hover', 'bg-primary-active', 'bg-primary-soft', 'text-primary',
    'bg-danger', 'bg-danger-soft', 'text-danger',
    'text-success', 'text-warning', 'text-caution', 'text-info',
    'bg-surface', 'bg-surface-muted', 'border-border',
    'font-sans', 'font-mono',
  ],
  theme: {
    extend: {
      colors: {
        trust:          scale('trust'),
        selfreliance:   scale('selfreliance'),
        cooperation:    scale('cooperation'),
        community:      scale('community'),
        innovation:     scale('innovation'),
        sustainability: scale('sustainability'),
        ink: {
          0: 'var(--chm-ink-0)',   50: 'var(--chm-ink-50)',   100: 'var(--chm-ink-100)',
          200: 'var(--chm-ink-200)', 300: 'var(--chm-ink-300)', 400: 'var(--chm-ink-400)',
          500: 'var(--chm-ink-500)', 600: 'var(--chm-ink-600)', 700: 'var(--chm-ink-700)',
          800: 'var(--chm-ink-800)', 900: 'var(--chm-ink-900)',
        },
        // semantic aliases
        primary: {
          DEFAULT: 'var(--chm-primary)',
          hover:   'var(--chm-primary-hover)',
          active:  'var(--chm-primary-active)',
          soft:    'var(--chm-primary-soft)',
        },
        success: 'var(--chm-success)',
        warning: 'var(--chm-warning)',
        caution: 'var(--chm-caution)',
        info:    'var(--chm-info)',
        danger: {
          DEFAULT: 'var(--chm-danger)',
          hover:   'var(--chm-danger-hover)',
          soft:    'var(--chm-danger-soft)',
        },
        surface: {
          DEFAULT: 'var(--chm-surface)',
          muted:   'var(--chm-surface-muted)',
        },
        border: 'var(--chm-border)',
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui',
               'Apple SD Gothic Neo', 'Noto Sans KR', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        display:  ['3rem',      { lineHeight: '1.15', fontWeight: '700' }],
        h1:       ['2.25rem',   { lineHeight: '1.2',  fontWeight: '700' }],
        h2:       ['1.75rem',   { lineHeight: '1.25', fontWeight: '700' }],
        h3:       ['1.375rem',  { lineHeight: '1.3',  fontWeight: '600' }],
        h4:       ['1.125rem',  { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg':['1.0625rem', { lineHeight: '1.6' }],
        body:     ['1rem',      { lineHeight: '1.6' }],
        'body-sm':['0.875rem',  { lineHeight: '1.5' }],
        caption:  ['0.75rem',   { lineHeight: '1.4' }],
        overline: ['0.6875rem', { lineHeight: '1.3', letterSpacing: '0.08em' }],
      },
      borderRadius: {
        'chm-sm':  '6px',
        'chm-md':  '10px',
        'chm-lg':  '14px',
        'chm-xl':  '20px',
        'chm-2xl': '28px',
      },
      boxShadow: {
        'chm-sm': '0 1px 2px rgba(28,35,43,.06), 0 1px 1px rgba(28,35,43,.04)',
        'chm-md': '0 4px 12px rgba(28,35,43,.08), 0 2px 4px rgba(28,35,43,.05)',
        'chm-lg': '0 12px 28px rgba(28,35,43,.10), 0 4px 8px rgba(28,35,43,.06)',
        'chm-xl': '0 24px 48px rgba(28,35,43,.14), 0 8px 16px rgba(28,35,43,.08)',
      },
      transitionTimingFunction: {
        chm: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
};
