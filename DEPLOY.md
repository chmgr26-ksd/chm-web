# 배포 가이드 — Hostinger Node.js (Next.js)

이 앱은 private 디자인 시스템(`@chm/design-system` = private repo `chm-group`)을
**HTTPS git 의존성**으로 설치합니다. 그래서 Hostinger 빌드가 그 repo를 clone할 수
있도록 **GitHub 토큰**을 주입하는 것이 핵심입니다. 아래 순서대로 하면 됩니다.

---

## 1. GitHub 토큰 발급 (read-only)

1. GitHub → Settings → Developer settings → **Fine-grained personal access tokens** → Generate
2. **Repository access**: Only select repositories → **`ppangppangsk/chm-group`** 만 선택
3. **Permissions → Repository permissions → Contents: Read-only**
4. 생성된 토큰 문자열 복사 (예: `github_pat_xxx`)

> 최소 권한(chm-group 읽기 전용)만 부여 — 유출돼도 피해 최소화.

## 2. hPanel — Node.js Web App 추가

1. **hPanel → 웹사이트 → 웹사이트 추가 → Node.js Web App**
2. **GitHub 연동** → `ppangppangsk/chm-web` 선택
3. 설정값:

   | 항목 | 값 |
   |---|---|
   | 프레임워크 | Next.js (자동 감지) |
   | Node 버전 | 22.x |
   | 빌드 명령 | (아래 3번 참고 — 토큰 라우팅 포함) |
   | 시작 명령 | `npm start` |
   | 앱 루트 | `/` |

## 3. 빌드 명령 (토큰으로 private 의존성 clone)

```bash
git config --global url."https://${GH_TOKEN}@github.com/".insteadOf "https://github.com/" && npm install --include=dev && npm run build
```

- 앞부분이 `https://github.com/` 요청을 토큰이 붙은 URL로 라우팅 → private `chm-group` clone 성공.
- `--include=dev` : Tailwind가 devDependency라 필수(안 하면 빌드 실패).

## 4. 환경 변수

| 이름 | 값 | 용도 |
|---|---|---|
| `GH_TOKEN` | (1번에서 발급한 토큰) | private DS 의존성 clone |
| `NPM_CONFIG_PRODUCTION` | `false` | devDependencies 설치 보장 |
| `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | — | Phase 2 |
| `DATABASE_URL` | — | Phase 2 |

## 5. 배포 → 확인

- `/` 홈 (PageHero·서비스·통계)
- `/login` 로그인
- `/dashboard` 대시보드

---

## 대안 (토큰이 번거로우면)

- **A. `chm-group`을 public으로 전환** → 토큰·빌드명령 라우팅 전부 불필요. 빌드 명령은
  `npm install --include=dev && npm run build`로 단순화. (디자인 시스템 소스 공개 감수)
- **B. 디자인 시스템 벤더링** → DS를 앱 repo에 복사(`file:` 의존성). 외부 접근 자체가 사라짐.

## 로컬 개발
SSH 키가 있는 개발자는 https 의존성을 SSH로 라우팅하면 됩니다(한 번만):
```bash
git config --global url."git@github.com:".insteadOf "https://github.com/"
npm install
```
또는 위 `GH_TOKEN` 방식과 동일하게 토큰을 사용해도 됩니다.

## 나중 단계 (Phase 2+)
DB(MySQL)·인증(Auth.js) 추가 시 위 환경 변수를 채우고, 빌드 명령에
Prisma 마이그레이션(`npx prisma migrate deploy`)을 포함시킵니다.
