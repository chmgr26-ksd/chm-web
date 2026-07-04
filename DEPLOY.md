# 배포 가이드 — Hostinger Node.js (Next.js)

디자인 시스템은 이 저장소 안에 **벤더링(포함)** 되어 있어(`vendor/design-system/`),
빌드 시 **외부 저장소 clone·토큰·SSH가 전혀 필요 없습니다.** 그냥 아래대로 하면 됩니다.

## hPanel — Node.js Web App 필드값

| 필드 | 값 |
|---|---|
| 프레임워크 사전 설정 | **Next.js** (없으면 Other) |
| 루트 디렉토리 | `/` (비움 가능) |
| **빌드 명령** | **`npm run build`** |
| 패키지 관리자 | **npm** |
| 출력 디렉토리 | 비움 / 자동 (Next.js 서버 모드 — 강제 시 `.next`) |
| 시작 명령 | **`npm run start`** (= `next start`) |

## 환경 변수

| 이름 | 값 | 용도 |
|---|---|---|
| **`NPM_CONFIG_PRODUCTION`** | `false` | devDependencies(Next·Tailwind) 설치 보장 |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | — | Phase 2 |
| `DATABASE_URL` | — | Phase 2 |

> 토큰(`GH_TOKEN`)은 **더 이상 필요 없습니다.** (디자인 시스템이 벤더링됨)

## 배포 → 확인
- `/` 홈 (PageHero·서비스·통계) · `/login` · `/dashboard`

---

## 디자인 시스템 업데이트 (벤더 동기화)

`chm-group`(디자인 시스템)이 바뀌면, 벤더 복사본을 갱신해야 앱에 반영됩니다:

```bash
bash scripts/sync-ds.sh            # ../chm-design-system → vendor/design-system 복사
npm run build                      # 확인
git add vendor && git commit -m "chore: 디자인 시스템 동기화" && git push
```

> **트레이드오프**: 벤더링은 DS를 앱에 복제하므로 배포가 100% 확실해지는 대신,
> DS 변경 시 위 동기화가 필요합니다. (private git 의존성의 인증 문제를 피하기 위한 선택)

## 나중 단계 (Phase 2+)
DB(MySQL)·인증(Auth.js) 추가 시 위 환경 변수를 채우고, 빌드 전에
`npx prisma migrate deploy` 를 실행하도록 구성합니다.
