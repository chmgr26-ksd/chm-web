#!/usr/bin/env bash
# 디자인 시스템 벤더 복사본 갱신
# ../chm-design-system 이 업데이트되면 실행해 vendor/design-system/ 을 최신화합니다.
#
#   bash scripts/sync-ds.sh
#
set -euo pipefail

SRC="${1:-../chm-design-system}"
DST="vendor/design-system"

if [ ! -d "$SRC/src" ]; then
  echo "오류: 디자인 시스템 소스를 찾을 수 없습니다: $SRC/src" >&2
  echo "사용법: bash scripts/sync-ds.sh [디자인시스템경로]" >&2
  exit 1
fi

rm -rf "$DST/src" "$DST/tailwind.preset.js"
cp -r "$SRC/src" "$DST/src"
cp "$SRC/tailwind.preset.js" "$DST/tailwind.preset.js"

echo "✓ 벤더 갱신 완료: $SRC → $DST"
echo "  (vendor/design-system/package.json 은 수동 유지 — 버전만 필요 시 갱신)"
echo "  다음: npm run build 로 확인 후 커밋"
