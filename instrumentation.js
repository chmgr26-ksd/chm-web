// Next.js 서버 계측 훅 — 서버/엣지 런타임에서 Sentry 초기화.
// DSN(SENTRY_DSN) 미설정 시 아무 것도 하지 않음(안전 비활성).
export async function register() {
  if (process.env.SENTRY_INSTRUMENTATION_LOG === '1') {
    console.log('[instrumentation] register() runtime=', process.env.NEXT_RUNTIME);
  }
  if (!process.env.SENTRY_DSN) return;
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      tracesSampleRate: 0, // 성능 추적 비활성(에러 캡처만) — 부하·용량 최소화
      environment: process.env.NODE_ENV,
    });
  }
}
