'use client';

import { useEffect } from 'react';

// 브라우저 Sentry 초기화 — NEXT_PUBLIC_SENTRY_DSN 설정 시에만 동작.
// SDK는 마운트 후 동적 로드(초기 렌더 차단 없음). 미설정 시 아무 것도 하지 않음.
export default function SentryClient() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;
    let cancelled = false;
    import('@sentry/browser')
      .then((Sentry) => {
        if (cancelled || Sentry.getClient?.()) return;
        // tracesSampleRate:0 = 트레이싱 미사용(빌드타임 __SENTRY_TRACING__=false로 코드도 제거됨).
        // Replay 통합은 로드하지 않으므로 관련 옵션도 두지 않음(에러 캡처만 수행).
        Sentry.init({
          dsn,
          tracesSampleRate: 0,
          environment: process.env.NODE_ENV,
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return null;
}
