// 아바타 배경색 — 이름을 해시해 6개 브랜드 색 중 하나로 결정.
// 같은 이름 → 항상 같은 색(안정적), 이름마다 달라 다양하게 보임(랜덤한 인상).
const VALUES = ['trust', 'selfreliance', 'cooperation', 'community', 'innovation', 'sustainability'];

export function avatarColor(seed = '') {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return VALUES[h % VALUES.length];
}
