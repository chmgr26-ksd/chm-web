// ============================================================================
// 중앙화 RBAC — 역할·권한·인가 헬퍼의 단일 소스(Single Source of Truth).
//
// 순수 JS(Prisma/bcrypt 등 Node 전용 코드 없음) → Edge 미들웨어·서버·클라이언트
// 어디서나 import 가능. "누가 무엇을 할 수 있나"는 오직 이 파일에서 정의한다.
// ============================================================================

/** 역할 상수 */
export const ROLES = { USER: 'USER', STAFF: 'STAFF', ADMIN: 'ADMIN' };

/** 유효 역할 목록(검증용) */
export const ROLE_VALUES = [ROLES.USER, ROLES.STAFF, ROLES.ADMIN];

/** 역할 계층(숫자가 클수록 상위). 상위 역할은 하위 역할의 권한을 포함한다. */
export const ROLE_RANK = { USER: 1, STAFF: 2, ADMIN: 3 };

/** 화면 표기용 한글 라벨 */
export const ROLE_LABEL = { USER: '일반 회원', STAFF: '직원', ADMIN: '관리자' };

/**
 * 권한(capability) 정의 — 역할과 분리된 "능력" 단위.
 * 각 권한을 수행하려면 필요한 "최소 역할"을 지정(계층 기반).
 * 예) inquiry:manage = STAFF → STAFF·ADMIN 허용, USER 불가.
 */
export const PERMISSIONS = {
  'dashboard:access': ROLES.STAFF, // 업무 대시보드 접근
  'inquiry:manage':   ROLES.STAFF, // 문의 상태 변경
  'members:view':     ROLES.ADMIN, // 회원 목록 조회
  'members:manage':   ROLES.ADMIN, // 회원 권한 변경
  'settings:manage':  ROLES.ADMIN, // 앱 설정(이메일 알림 등) 관리
  'account:access':   ROLES.USER,  // 마이페이지(로그인 회원 누구나)
};

/** user 객체 또는 role 문자열에서 역할을 추출 */
function roleOf(userOrRole) {
  if (!userOrRole) return null;
  return typeof userOrRole === 'string' ? userOrRole : userOrRole.role || null;
}

/** 로그인 여부(유효 역할 보유) */
export function isLoggedIn(userOrRole) {
  const r = roleOf(userOrRole);
  return !!r && r in ROLE_RANK;
}

/** 유효한 역할 문자열인지 */
export function isValidRole(role) {
  return ROLE_VALUES.includes(role);
}

/** 정확히 해당 역할인지 */
export function hasRole(userOrRole, role) {
  return roleOf(userOrRole) === role;
}

/** 최소 역할 이상인지(계층) — roleAtLeast(user, 'STAFF') */
export function roleAtLeast(userOrRole, minRole) {
  const r = roleOf(userOrRole);
  if (!r || !(r in ROLE_RANK) || !(minRole in ROLE_RANK)) return false;
  return ROLE_RANK[r] >= ROLE_RANK[minRole];
}

/** 권한 보유 여부 — can(user, 'members:manage') */
export function can(userOrRole, permission) {
  const minRole = PERMISSIONS[permission];
  if (!minRole) return false; // 정의되지 않은 권한은 거부(안전 기본값)
  return roleAtLeast(userOrRole, minRole);
}
