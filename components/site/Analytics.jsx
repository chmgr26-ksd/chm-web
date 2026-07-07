'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// 공개 사이트 페이지뷰 비콘. (site) 레이아웃에만 두어 대시보드/로그인은 제외됨.
export default function Analytics() {
  const pathname = usePathname();
  useEffect(() => {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
  return null;
}
