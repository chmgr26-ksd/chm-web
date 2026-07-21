'use client';

import { useState, useEffect, useRef } from 'react';

// 교실 후기 사진 자동 롤링 — 한 장씩 표시하고 interval마다 다음 장으로 페이드 전환.
// images: [{ id }]. 사진 1장이면 롤링 없이 정지.
export default function ReviewCarousel({ images, interval = 2600, alt = '' }) {
  const [idx, setIdx] = useState(0);
  const timer = useRef(null);
  const count = images.length;

  useEffect(() => {
    if (count <= 1) return undefined;
    timer.current = setInterval(() => setIdx((i) => (i + 1) % count), interval);
    return () => clearInterval(timer.current);
  }, [count, interval]);

  if (count === 0) {
    return <div className="grid aspect-[4/3] w-full place-items-center rounded-chm-lg bg-surface-muted text-body-sm text-ink-400">사진 준비 중</div>;
  }

  const go = (i) => {
    setIdx(i);
    if (timer.current) clearInterval(timer.current); // 수동 조작 시 타이머 리셋
    if (count > 1) timer.current = setInterval(() => setIdx((v) => (v + 1) % count), interval);
  };

  return (
    <div className="relative overflow-hidden rounded-chm-lg border border-border bg-surface-muted">
      <div className="relative aspect-[4/3] w-full">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={`/api/review-images/${img.id}`}
            alt={alt}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === idx ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
      </div>
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              aria-label={`${i + 1}번 사진`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? 'w-5 bg-white' : 'w-2 bg-white/60 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
