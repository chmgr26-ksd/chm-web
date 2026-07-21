'use client';

import { useState, useRef, useCallback } from 'react';

// Before/After 드래그 비교 슬라이더 — After 사진 위에 Before를 겹치고, 가운데 손잡이를
// 좌우로 밀어 노출 비율을 조절. beforeId/afterId 중 하나가 없으면 있는 사진만 표시.
export default function BeforeAfter({ beforeId, afterId, alt = '' }) {
  const [pos, setPos] = useState(50); // Before가 보이는 폭(%)
  const wrapRef = useRef(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, pct)));
  }, []);

  const onDown = (e) => {
    dragging.current = true;
    setFromClientX(e.touches ? e.touches[0].clientX : e.clientX);
  };
  const onMove = (e) => {
    if (!dragging.current) return;
    setFromClientX(e.touches ? e.touches[0].clientX : e.clientX);
  };
  const onUp = () => { dragging.current = false; };

  // 한쪽만 있을 때는 비교 없이 단일 이미지.
  if (!beforeId || !afterId) {
    const only = beforeId || afterId;
    if (!only) return <div className="grid aspect-[4/3] w-full place-items-center rounded-chm-lg bg-surface-muted text-body-sm text-ink-400">사진 준비 중</div>;
    return (
      <div className="overflow-hidden rounded-chm-lg border border-border">
        <img src={`/api/review-images/${only}`} alt={alt} className="aspect-[4/3] w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-chm-lg border border-border bg-surface-muted"
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={onUp}
      onTouchStart={onDown}
      onTouchMove={onMove}
      onTouchEnd={onUp}
    >
      {/* After(아래층, 전체) */}
      <img src={`/api/review-images/${afterId}`} alt={`${alt} 수리 후`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-caption font-semibold text-white">After</span>

      {/* Before(위층) — clip-path로 pos% 만큼만 노출(이미지 크기는 After와 동일 유지). */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={`/api/review-images/${beforeId}`} alt={`${alt} 수리 전`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-caption font-semibold text-white">Before</span>
      </div>

      {/* 손잡이 */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="h-full w-0.5 bg-white/90 shadow" />
        <div className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-700 shadow-lg">
          <span className="text-body-sm">⇄</span>
        </div>
      </div>
    </div>
  );
}
