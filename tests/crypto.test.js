import { describe, it, expect, beforeAll } from 'vitest';
import { encrypt, decrypt } from '@/lib/crypto';

describe('crypto — AES-256-GCM', () => {
  beforeAll(() => {
    process.env.AUTH_SECRET = 'test-auth-secret-for-unit-tests-000';
  });

  it('encrypt→decrypt 왕복이 원문과 일치', () => {
    const plain = 'smtp-비밀번호-!@#$%^&*()';
    const enc = encrypt(plain);
    expect(typeof enc).toBe('string');
    expect(enc).not.toBe(plain);
    expect(decrypt(enc)).toBe(plain);
  });

  it('빈 문자열도 왕복', () => {
    expect(decrypt(encrypt(''))).toBe('');
  });

  it('같은 평문도 매번 다른 암호문(IV 랜덤)', () => {
    expect(encrypt('same-value')).not.toBe(encrypt('same-value'));
  });

  it('변조된 암호문은 복호화 실패(인증 태그 검증)', () => {
    const enc = encrypt('tamper-me');
    const buf = Buffer.from(enc, 'base64');
    buf[buf.length - 1] ^= 0xff; // 마지막 바이트 변조
    expect(() => decrypt(buf.toString('base64'))).toThrow();
  });

  it('AUTH_SECRET 미설정 시 throw(폴백 키 금지)', () => {
    const saved = process.env.AUTH_SECRET;
    delete process.env.AUTH_SECRET;
    try {
      expect(() => encrypt('x')).toThrow();
    } finally {
      process.env.AUTH_SECRET = saved;
    }
  });
});
