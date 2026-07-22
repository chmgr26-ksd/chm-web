import { sanitizeHtml } from '@/lib/sanitizeHtml';

// 저장된 리치 텍스트(HTML)를 공개 페이지에 렌더. 저장 시 새니타이즈하지만
// 방어적으로 렌더 시에도 한 번 더 정제한다. 빈 값이면 아무것도 렌더하지 않음.
export default function RichText({ html, className = '' }) {
  const clean = sanitizeHtml(html || '');
  if (!clean) return null;
  return <div className={`richtext ${className}`} dangerouslySetInnerHTML={{ __html: clean }} />;
}
