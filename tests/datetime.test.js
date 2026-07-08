import { describe, it, expect } from 'vitest';
import { toLocalInput, fmtEventDate, fmtEventRange } from '@/lib/datetime';

// 테스트는 TZ=Asia/Seoul 로 실행됨(package.json test 스크립트). +09:00 명시로 모호성 제거.
const d1 = new Date('2026-07-15T14:30:00+09:00');
const d2 = new Date('2026-07-15T16:00:00+09:00');
const d3 = new Date('2026-07-16T10:00:00+09:00');

describe('datetime (KST)', () => {
  it('toLocalInput → datetime-local 문자열', () => {
    expect(toLocalInput(d1)).toBe('2026-07-15T14:30');
    expect(toLocalInput(null)).toBe('');
    expect(toLocalInput('invalid-date')).toBe('');
  });

  it('fmtEventDate → 날짜·시각 포함', () => {
    const s = fmtEventDate(d1);
    expect(s.startsWith('2026.07.15')).toBe(true);
    expect(s).toContain('14:30');
  });

  it('fmtEventRange 같은 날은 종료를 시각만 표기', () => {
    const r = fmtEventRange(d1, d2);
    expect(r.startsWith('2026.07.15')).toBe(true);
    expect(r).toContain('~ 16:00');
    expect(r).not.toContain('2026.07.15 ~ 2026'); // 같은 날은 종료 날짜 반복 안 함
  });

  it('fmtEventRange 다른 날은 종료 전체 표기', () => {
    expect(fmtEventRange(d1, d3)).toContain('2026.07.16');
  });

  it('fmtEventRange 종료 없으면 시작만', () => {
    expect(fmtEventRange(d1, null)).toBe(fmtEventDate(d1));
  });
});
