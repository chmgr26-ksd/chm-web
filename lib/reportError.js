// 에러 바운더리에서 Sentry로 예외 보고(NEXT_PUBLIC_SENTRY_DSN 설정 시에만).
export function reportError(error) {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  import('@sentry/nextjs')
    .then((Sentry) => Sentry.captureException(error))
    .catch(() => {});
}
