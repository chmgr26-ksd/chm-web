import { describe, it, expect } from 'vitest';
import { can, roleAtLeast, isLoggedIn, isValidRole, hasRole } from '@/lib/rbac';

describe('rbac.can — 권한 게이트', () => {
  it('dashboard:access는 STAFF 이상만', () => {
    expect(can({ role: 'USER' }, 'dashboard:access')).toBe(false);
    expect(can({ role: 'STAFF' }, 'dashboard:access')).toBe(true);
    expect(can({ role: 'ADMIN' }, 'dashboard:access')).toBe(true);
  });

  it('members:manage·settings:manage는 ADMIN만', () => {
    expect(can({ role: 'STAFF' }, 'members:manage')).toBe(false);
    expect(can({ role: 'ADMIN' }, 'members:manage')).toBe(true);
    expect(can({ role: 'STAFF' }, 'settings:manage')).toBe(false);
    expect(can({ role: 'ADMIN' }, 'settings:manage')).toBe(true);
  });

  it('콘텐츠 관리 권한(posts/events/faqs/gallery/inquiry)은 STAFF 이상', () => {
    for (const perm of ['posts:manage', 'events:manage', 'faqs:manage', 'gallery:manage', 'inquiry:manage']) {
      expect(can({ role: 'USER' }, perm)).toBe(false);
      expect(can({ role: 'STAFF' }, perm)).toBe(true);
      expect(can({ role: 'ADMIN' }, perm)).toBe(true);
    }
  });

  it('정의되지 않은 권한은 거부(안전 기본값)', () => {
    expect(can({ role: 'ADMIN' }, 'nope:whatever')).toBe(false);
  });

  it('null/undefined/잘못된 역할은 거부', () => {
    expect(can(null, 'account:access')).toBe(false);
    expect(can(undefined, 'dashboard:access')).toBe(false);
    expect(can({ role: 'GHOST' }, 'account:access')).toBe(false);
  });

  it('role 문자열 직접 전달도 동작', () => {
    expect(can('ADMIN', 'settings:manage')).toBe(true);
    expect(can('STAFF', 'settings:manage')).toBe(false);
  });
});

describe('rbac — 헬퍼', () => {
  it('roleAtLeast 계층', () => {
    expect(roleAtLeast({ role: 'ADMIN' }, 'STAFF')).toBe(true);
    expect(roleAtLeast({ role: 'STAFF' }, 'ADMIN')).toBe(false);
    expect(roleAtLeast('USER', 'USER')).toBe(true);
    expect(roleAtLeast(null, 'USER')).toBe(false);
  });

  it('isLoggedIn — 유효 역할 보유 여부', () => {
    expect(isLoggedIn({ role: 'USER' })).toBe(true);
    expect(isLoggedIn({ role: 'GHOST' })).toBe(false);
    expect(isLoggedIn(null)).toBe(false);
    expect(isLoggedIn(undefined)).toBe(false);
  });

  it('isValidRole / hasRole', () => {
    expect(isValidRole('ADMIN')).toBe(true);
    expect(isValidRole('SUPERADMIN')).toBe(false);
    expect(isValidRole(undefined)).toBe(false);
    expect(hasRole({ role: 'STAFF' }, 'STAFF')).toBe(true);
    expect(hasRole({ role: 'STAFF' }, 'ADMIN')).toBe(false);
  });
});
