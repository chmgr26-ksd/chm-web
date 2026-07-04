# 배포 가이드 — Hostinger Node.js (Next.js)

이 앱은 private 디자인 시스템(`@chm/design-system` = private repo `chm-group`)을
**HTTPS git 의존성**으로 설치합니다. Hostinger 빌드가 그 repo를 clone할 수 있도록
**GitHub 토큰**을 환경변수(`GH_TOKEN`)로 주면, `preinstall` 훅이 자동으로 git 인증을
구성합니다. (빌드 명령은 드롭다운의 `npm run build`만 고르면 됩니다.)

---

## 1. GitHub 토큰 발급 (read-only)

1. GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate
2. **Repository access**: Only select repositories → **`ppangppangsk/chm-group`** 선택
3. **Permissions → Repository permissions → Contents: Read-only**
4. 토큰 문자열 복사 (`github_pat_...`)

## 2. hPanel — Node.js Web App 필드값

| 필드 | 값 |
|---|---|
| 프레임워크 사전 설정 | **Next.js** (없으면 Other) |
| 루트 디렉토리 | `/` (비움 가능) |
| **빌드 명령** | **`npm run build`** (드롭다운에서 선택) |
| 패키지 관리자 | **npm** |
| 출력 디렉토리 | 비움 / 자동 (Next.js 서버 모드 — 강제 시 `.next`) |
| 시작 명령 | `npm run start` (= `next start`) |

## 3. 환경 변수 (핵심)

| 이름 | 값 | 용도 |
|---|---|---|
| **`GH_TOKEN`** | 1번 토큰 | preinstall이 이 값으로 private DS를 clone |
| **`NPM_CONFIG_PRODUCTION`** | `false` | devDependencies(Tailwind 등) 설치 보장 |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | — | Phase 2 |
| `DATABASE_URL` | — | Phase 2 |

> **동작 원리**: `npm install`/`npm ci` 시작 시 `preinstall`(`scripts/git-auth.mjs`)이
> 실행되어, `GH_TOKEN`이 있으면 `git config --global url."https://TOKEN@github.com/".insteadOf`
> 를 설정합니다. 그 뒤 git 의존성(`chm-group`)이 토큰으로 clone됩니다.
> `package-lock.json`의 resolved URL도 `git+https`라 `npm ci`에서 SSH를 타지 않습니다.

## 4. 배포 → 확인
- `/` 홈 (PageHero·서비스·통계) · `/login` · `/dashboard`

---

## 대안 (토큰 없이 더 단순하게)

- **`chm-group`을 public으로 전환** → `GH_TOKEN`·preinstall 불필요. 환경변수는
  `NPM_CONFIG_PRODUCTION=false` 하나만. (디자인 시스템 소스 공개 감수)

## 로컬 개발

SSH 키가 있으면 https 의존성을 SSH로 라우팅(한 번만 전역 설정):
```bash
git config --global url."git@github.com:".insteadOf "https://github.com/"
npm ci
```
또는 `GH_TOKEN`을 export하고 `npm ci` (preinstall이 처리).

## 나중 단계 (Phase 2+)
DB(MySQL)·인증(Auth.js) 추가 시 환경변수를 채우고, 빌드 전에
`npx prisma migrate deploy`를 실행하도록 구성합니다.
