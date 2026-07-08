import { describe, it, expect } from 'vitest';
import { avatarColor } from '@/lib/avatarColor';

const VALUES = ['trust', 'selfreliance', 'cooperation', 'community', 'innovation', 'sustainability'];

describe('avatarColor', () => {
  it('항상 6개 브랜드 색 중 하나를 반환', () => {
    for (const n of ['홍길동', '김철수', 'John Doe', '', 'a', '사용자']) {
      expect(VALUES).toContain(avatarColor(n));
    }
  });

  it('같은 이름은 항상 같은 색(결정적)', () => {
    expect(avatarColor('홍길동')).toBe(avatarColor('홍길동'));
    expect(avatarColor('김영희')).toBe(avatarColor('김영희'));
  });

  it('이름이 다양하면 색도 여러 개로 분산', () => {
    const names = ['김철수', '이영희', '박민수', '최지우', '정해인', '강동원', '조인성', '윤아', '장나라', '임시완'];
    const colors = new Set(names.map(avatarColor));
    expect(colors.size).toBeGreaterThan(2); // 최소 3색 이상 분산
  });
});
