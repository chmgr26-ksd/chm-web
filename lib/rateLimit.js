// 간단한 인메모리 고정 윈도우 레이트리밋.
// 단일 프로세스 커스텀 서버(server.js) 전제 — 외부 스토어 없이 MVP 수준의 남용 방지.
// (재시작 시 초기화됨. 다중 인스턴스로 확장 시 Redis 등으로 교체 필요)
const buckets = new Map();

/**
 * @param {string} key  식별자(예: `login:1.2.3.4`)
 * @param {{max:number, windowMs:number}} opts
 * @returns {{ok:boolean, retryAfter?:number}}
 */
export function rateLimit(key, { max, windowMs }) {
  const now = Date.now();
  // 버킷이 과도하게 쌓이면 만료분 정리(메모리 누수 방지).
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (now > b.reset) buckets.delete(k);
  }
  const b = buckets.get(key);
  if (!b || now > b.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  b.count += 1;
  if (b.count > max) return { ok: false, retryAfter: Math.ceil((b.reset - now) / 1000) };
  return { ok: true };
}

/** 프록시(Hostinger LiteSpeed) 뒤 클라이언트 IP 추출. */
export function clientIp(req) {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/**
 * 요청 IP 기준 레이트리밋. IP 식별 불가('unknown') 시 스킵한다 —
 * 프록시가 XFF를 안 보낼 때 전역 단일 버킷으로 정상 사용자를 락아웃하는 회귀 방지.
 */
export function rateLimitByIp(req, bucket, opts) {
  const ip = clientIp(req);
  if (ip === 'unknown') return { ok: true };
  return rateLimit(`${bucket}:${ip}`, opts);
}
