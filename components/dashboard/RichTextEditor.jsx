'use client';

import { useRef, useEffect, useCallback } from 'react';

// 경량 리치 텍스트 에디터 — contentEditable + 툴바(document.execCommand).
// 의존성 없음. onChange로 innerHTML(HTML 문자열)을 전달하고, 서버에서 새니타이즈한다.
// 초기값은 마운트 시 1회만 주입(커서 보존) → 리셋은 상위에서 key 변경으로 재마운트.

const TOOLS = [
  { cmd: 'bold', label: '굵게', icon: 'B', style: 'font-bold' },
  { cmd: 'italic', label: '기울임', icon: 'I', style: 'italic' },
  { cmd: 'underline', label: '밑줄', icon: 'U', style: 'underline' },
  { block: 'h3', label: '제목', icon: 'H' },
  { cmd: 'insertUnorderedList', label: '글머리 목록', icon: '• 목록' },
  { cmd: 'insertOrderedList', label: '번호 목록', icon: '1. 목록' },
  { link: true, label: '링크', icon: '🔗' },
  { cmd: 'removeFormat', label: '서식 지우기', icon: '✕서식' },
];

export default function RichTextEditor({ value = '', onChange, placeholder = '내용을 입력하세요', minHeight = 180 }) {
  const ref = useRef(null);

  const syncEmpty = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const blank = el.textContent.trim().length === 0 && !el.querySelector('img,ul,ol');
    el.setAttribute('data-empty', blank ? 'true' : 'false');
  }, []);

  const emit = useCallback(() => {
    if (!ref.current) return;
    syncEmpty();
    onChange?.(ref.current.innerHTML);
  }, [onChange, syncEmpty]);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = value || '';
      syncEmpty();
    }
    // 마운트 시 1회만 — value 변경 반영은 key 재마운트로 처리.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const focusEditor = () => ref.current?.focus();

  const run = (tool) => {
    focusEditor();
    if (tool.block) {
      // 이미 h3면 문단으로 토글.
      const isH = document.queryCommandValue?.('formatBlock')?.toLowerCase() === tool.block;
      document.execCommand('formatBlock', false, isH ? 'p' : tool.block);
    } else if (tool.link) {
      const url = window.prompt('링크 URL을 입력하세요 (https:// 또는 mailto:)');
      if (url && url.trim()) document.execCommand('createLink', false, url.trim());
    } else if (tool.cmd) {
      document.execCommand(tool.cmd, false, null);
    }
    emit();
  };

  return (
    <div className="overflow-hidden rounded-chm-md border border-border bg-surface focus-within:ring-2 focus-within:ring-primary">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-surface-warm px-2 py-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            title={t.label}
            aria-label={t.label}
            onMouseDown={(e) => e.preventDefault()} // 선택 영역 유지
            onClick={() => run(t)}
            className={`rounded px-2 py-1 text-caption text-ink-700 hover:bg-ink-100 ${t.style || ''}`}
          >
            {t.icon}
          </button>
        ))}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        onInput={emit}
        onBlur={emit}
        data-placeholder={placeholder}
        className="richtext richtext-editor px-3 py-2.5 text-body-sm text-ink-800"
        style={{ minHeight }}
      />
    </div>
  );
}
