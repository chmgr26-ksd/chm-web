'use client';

import { useEffect } from 'react';

// 브라우저 Sentry 초기화 — NEXT_PUBLIC_SENTRY_DSN 설정 시에만 동작.
// SDK는 마운트 후 동적 로드(초기 렌더 차단 없음). 미설정 시 아무 것도 하지 않음.
export default function SentryClient() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;
    let cancelled = false;
    import('@sentry/nextjs')
      .then((Sentry) => {
        if (cancelled || Sentry.getClient?.()) return;
        Sentry.init({
          dsn,
          tracesSampleRate: 0,
          replaysSessionSampleRate: 0,
          replaysOnErrorSampleRate: 0,
          environment: process.env.NODE_ENV,
        });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  return null;
}
