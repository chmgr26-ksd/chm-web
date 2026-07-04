/**
 * cn — 조건부 className 병합 유틸리티.
 * 외부 의존성 없이 truthy 값만 공백으로 결합합니다.
 *
 *   cn('btn', isPrimary && 'btn-primary', { 'is-active': active })
 */
export function cn(...args) {
  const out = [];
  for (const arg of args) {
    if (!arg) continue;
    if (typeof arg === 'string' || typeof arg === 'number') {
      out.push(String(arg));
    } else if (Array.isArray(arg)) {
      const inner = cn(...arg);
      if (inner) out.push(inner);
    } else if (typeof arg === 'object') {
      for (const key in arg) {
        if (arg[key]) out.push(key);
      }
    }
  }
  return out.join(' ');
}

export default cn;
