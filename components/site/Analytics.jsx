'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// 공개 사이트 페이지뷰 비콘. (site) 레이아웃에만 두어 대시보드/로그인은 제외됨.
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    const body = { path: pathname };
    // 유입 경로는 랜딩(최초 진입) 1회만 전송 — SPA 내부 이동 중엔 document.referrer가
    // 고정이라 매번 보내면 중복 집계됨.
    if (isFirst && typeof document !== 'undefined' && document.referrer) {
      body.referrer = document.referrer;
    }
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
