'use client';

import { useState, useEffect, useCallback } from 'react';
import RichText from '@/components/site/RichText';

// 마소너리 그리드 + 라이트박스. 그리드는 썸네일(?v=thumb), 라이트박스는 원본을 표시.
export default function GalleryGrid({ images }) {
  const [index, setIndex] = useState(-1);
  const open = index >= 0 && index < images.length;
  const current = open ? images[index] : null;

  const close = useCallback(() => setIndex(-1), []);
  const prev = useCallback(() => setIndex((i) => (i > 0 ? i - 1 : images.length - 1)), [images.length]);
  const next = useCallback(() => setIndex((i) => (i < images.length - 1 ? i + 1 : 0)), [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  const navBtn =
    'absolute top-1/2 z-10 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-chm-full bg-white/15 text-white text-2xl leading-none backdrop-blur transition hover:bg-white/30';

  return (
    <>
      <div className="gap-3 [column-fill:_balance] columns-2 sm:columns-3 lg:columns-4 [&>figure]:mb-3">
        {images.map((img, i) => (
          <figure
            key={img.id}
            role="button"
            tabIndex={0}
            aria-label={`${img.title || '갤러리 이미지'} 크게 보기`}
            onClick={() => setIndex(i)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIndex(i); } }}
            className="group block break-inside-avoid cursor-zoom-in overflow-hidden rounded-chm-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <img
              src={`/api/gallery/${img.id}?v=thumb`}
              alt={img.title || 'CHM Group 갤러리 이미지'}
              loading="lazy"
              className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {img.title && <figcaption className="px-3 py-2 text-caption text-ink-600">{img.title}</figcaption>}
          </figure>
        ))}
      </div>

      {open && current && (
        <div
          className="fixed inset-0 z-[1300] flex items-center justify-center bg-ink-900/90 p-4 animate-[chm-fade_.2s_ease]"
          role="dialog"
          aria-modal="true"
          aria-label={current.title || '갤러리 이미지'}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="닫기"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-chm-full bg-white/15 text-white text-xl backdrop-blur transition hover:bg-white/30"
          >
            ✕
          </button>

          {images.length > 1 && (
            <button type="button" aria-label="이전" onClick={(e) => { e.stopPropagation(); prev(); }} className={`${navBtn} left-2 sm:left-6`}>‹</button>
          )}

          <figure className="flex max-h-[92vh] max-w-[94vw] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={`/api/gallery/${current.id}`}
              alt={current.title || 'CHM Group 갤러리 이미지'}
              className="max-h-[72vh] max-w-[94vw] rounded-chm-md object-contain shadow-chm-xl"
            />
            <figcaption className="mt-3 max-w-2xl text-center text-body-sm text-white/85">
              {current.title ? `${current.title} · ` : ''}{index + 1} / {images.length}
            </figcaption>
            {current.description && (
              <div className="mt-3 max-h-[18vh] max-w-2xl overflow-y-auto px-2 text-white/90 [&_a]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white">
                <RichText html={current.description} className="text-body-sm" />
              </div>
            )}
          </figure>

          {images.length > 1 && (
            <button type="button" aria-label="다음" onClick={(e) => { e.stopPropagation(); next(); }} className={`${navBtn} right-2 sm:right-6`}>›</button>
          )}
        </div>
      )}
    </>
  );
}
