import { describe, it, expect } from 'vitest';
import { rateLimit, rateLimitByIp, clientIp } from '@/lib/rateLimit';

function makeReq(headers) {
  const lower = {};
  for (const k of Object.keys(headers)) lower[k.toLowerCase()] = headers[k];
  return { headers: { get: (k) => (k.toLowerCase() in lower ? lower[k.toLowerCase()] : null) } };
}

describe('rateLimit — 고정 윈도우', () => {
  it('윈도우 내 max회 허용 후 차단', () => {
    const opts = { max: 3, windowMs: 60_000 };
    expect(rateLimit('rl-k1', opts).ok).toBe(true);
    expect(rateLimit('rl-k1', opts).ok).toBe(true);
    expect(rateLimit('rl-k1', opts).ok).toBe(true);
    const blocked = rateLimit('rl-k1', opts);
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it('다른 key는 독립 버킷', () => {
    const opts = { max: 1, windowMs: 60_000 };
    expect(rateLimit('rl-a', opts).ok).toBe(true);
    expect(rateLimit('rl-a', opts).ok).toBe(false);
    expect(rateLimit('rl-b', opts).ok).toBe(true);
  });
});

describe('clientIp', () => {
  it('XFF 우선(첫 IP), 없으면 x-real-ip, 둘 다 없으면 unknown', () => {
    expect(clientIp(makeReq({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }))).toBe('1.2.3.4');
    expect(clientIp(makeReq({ 'x-real-ip': '9.9.9.9' }))).toBe('9.9.9.9');
    expect(clientIp(makeReq({}))).toBe('unknown');
  });
});

describe('rateLimitByIp — 안전 축약', () => {
  it('IP 불명(unknown)이면 스킵(항상 허용) — 전역 락아웃 방지', () => {
    const req = makeReq({});
    for (let i = 0; i < 50; i++) {
      expect(rateLimitByIp(req, 'rlbi-x', { max: 1, windowMs: 60_000 }).ok).toBe(true);
    }
  });

  it('IP가 있으면 정상 제한', () => {
    const req = makeReq({ 'x-forwarded-for': '7.7.7.7' });
    expect(rateLimitByIp(req, 'rlbi-limited', { max: 1, windowMs: 60_000 }).ok).toBe(true);
    expect(rateLimitByIp(req, 'rlbi-limited', { max: 1, windowMs: 60_000 }).ok).toBe(false);
  });

  it('다른 IP는 독립 버킷', () => {
    const a = makeReq({ 'x-forwarded-for': '10.0.0.1' });
    const b = makeReq({ 'x-forwarded-for': '10.0.0.2' });
    const opts = { max: 1, windowMs: 60_000 };
    expect(rateLimitByIp(a, 'rlbi-multi', opts).ok).toBe(true);
    expect(rateLimitByIp(a, 'rlbi-multi', opts).ok).toBe(false);
    expect(rateLimitByIp(b, 'rlbi-multi', opts).ok).toBe(true);
  });
});
