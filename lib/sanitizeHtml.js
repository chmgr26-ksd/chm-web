// 리치 텍스트 HTML 새니타이저 — 관리자(STAFF) 입력을 저장 전 서버에서 정제.
// allowlist에 없는 태그/속성은 제거하고, 링크는 안전한 프로토콜만 허용(XSS 방지).
// 순수 JS(DOM 비의존) — 서버 라우트에서 사용.

// 허용 태그(전부 무속성으로 재작성; a만 안전한 href 유지).
const ALLOWED = new Set([
  'p', 'br', 'div', 'span',
  'strong', 'b', 'em', 'i', 'u',
  'h2', 'h3', 'h4',
  'ul', 'ol', 'li',
  'a',
]);

// 통째로 제거할 위험 블록.
const DANGER_BLOCK = /<\s*(script|style|iframe|object|embed|noscript|template)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;

/**
 * HTML 문자열을 allowlist 기준으로 정제.
 * - 위험 블록 제거 → 태그별로 재작성(속성 제거, a는 href만 검증 후 유지)
 * - 허용되지 않은 태그는 마크업만 제거(내부 텍스트는 보존)
 */
export function sanitizeHtml(input, { maxLen = 40000 } = {}) {
  if (!input || typeof input !== 'string') return '';
  let html = input.slice(0, maxLen);
  html = html.replace(DANGER_BLOCK, '');

  html = html.replace(/<\/?[a-zA-Z][^>]*>/g, (tag) => {
    const closeM = /^<\s*\/\s*([a-zA-Z0-9]+)/.exec(tag);
    if (closeM) {
      const name = closeM[1].toLowerCase();
      return ALLOWED.has(name) ? `</${name}>` : '';
    }
    const openM = /^<\s*([a-zA-Z0-9]+)/.exec(tag);
    if (!openM) return '';
    const name = openM[1].toLowerCase();
    if (!ALLOWED.has(name)) return '';
    if (name === 'br') return '<br>';
    if (name === 'a') {
      const hrefM = /\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);
      let href = hrefM ? (hrefM[2] ?? hrefM[3] ?? hrefM[4] ?? '') : '';
      href = href.trim();
      // http(s)/mailto/내부 경로만 허용 — javascript:, data: 등 차단.
      if (!/^(https?:\/\/|mailto:|\/)/i.test(href)) return '<a>';
      const safe = href.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<a href="${safe}" target="_blank" rel="noopener noreferrer nofollow">`;
    }
    return `<${name}>`;
  });

  return html.trim();
}

/** 태그를 제거한 순수 텍스트(공백 정규화) — 빈 값/발췌 판정·검색용. */
export function htmlToText(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(DANGER_BLOCK, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 리치 텍스트가 실질적으로 비어있는지(텍스트 없음). */
export function isBlankHtml(html) {
  return htmlToText(html).length === 0;
}
