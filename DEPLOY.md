# 배포 가이드 — Hostinger Node.js (Next.js)

## hPanel 설정

1. **hPanel → 웹사이트 → 웹사이트 추가 → Node.js Web App**
2. **GitHub 연동** → 이 앱 저장소 연결 (예: `ppangppangsk/chm-web`)
3. 설정값:

   | 항목 | 값 |
   |---|---|
   | 프레임워크 | Next.js (자동 감지) |
   | Node 버전 | 22.x |
   | 빌드 명령 | `npm install --include=dev && npm run build` |
   | 시작 명령 | `npm start` (= `next start`, PORT 환경변수 자동 사용) |
   | 앱 루트 | `/` |
   | 도메인 | 원하는 도메인/서브도메인 |

4. **환경 변수**:
   | 이름 | 값 | 시점 |
   |---|---|---|
   | `NPM_CONFIG_PRODUCTION` | `false` | 지금 (Tailwind가 devDep이라 필수) |
   | `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | — | Phase 2 |
   | `DATABASE_URL` | — | Phase 2 |

## ⚠️ private 디자인 시스템 의존성 (중요)

이 앱은 `@chm/design-system`을 **private 저장소**(`github:ppangppangsk/chm-group`)에서
설치합니다. Hostinger 빌드 중 `npm install`이 그 저장소를 clone할 수 있어야 합니다.

세 가지 해결책 (하나 선택):
1. **디자인 시스템 저장소를 public으로 전환** — 가장 단순. (소스 공개해도 무방하면)
2. **GitHub Personal Access Token 사용** — Hostinger 환경변수/`.npmrc`로 토큰 주입해
   private repo 설치 허용.
3. **디자인 시스템을 앱에 벤더링(복사)** — 의존성 대신 `packages/`로 포함.

> Hostinger의 GitHub 연동이 같은 계정의 다른 private repo까지 접근 가능한지는
> 실제 빌드 로그로 확인하세요. `npm error ... github:ppangppangsk/chm-group ... 403/404`
> 가 나오면 위 1~3 중 하나를 적용합니다.

## 배포 확인
- `/` 홈 → PageHero·서비스·통계
- `/login` → 로그인 화면
- `/dashboard` → 대시보드

## 나중 단계
Phase 2 이후 DB(MySQL)·인증(Auth.js)·결제 연동이 추가되면, 위 환경 변수를 채우고
Prisma 마이그레이션(`npx prisma migrate deploy`)을 빌드 명령에 포함시킵니다.
