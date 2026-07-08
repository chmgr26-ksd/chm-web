import { describe, it, expect } from 'vitest';
import { POST_CATEGORY, POST_CATEGORY_VALUES, isValidCategory } from '@/lib/posts';

describe('posts — 카테고리', () => {
  it('유효 카테고리만 통과', () => {
    expect(isValidCategory('NOTICE')).toBe(true);
    expect(isValidCategory('RECRUIT')).toBe(true);
    expect(isValidCategory('EVENT')).toBe(true);
    expect(isValidCategory('CAMPAIGN')).toBe(true);
    expect(isValidCategory('INVALID')).toBe(false);
    expect(isValidCategory(undefined)).toBe(false);
    expect(isValidCategory('')).toBe(false);
  });

  it('모든 카테고리에 라벨·색상 매핑 존재', () => {
    expect(POST_CATEGORY_VALUES.length).toBeGreaterThan(0);
    for (const key of POST_CATEGORY_VALUES) {
      expect(POST_CATEGORY[key].label).toBeTruthy();
      expect(POST_CATEGORY[key].value).toBeTruthy();
    }
  });
});
