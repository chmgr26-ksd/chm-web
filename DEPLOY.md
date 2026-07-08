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
| 시작 명령 | **`npm run start`** (= `node server.js`) |

> **커스텀 서버**: `server.js`가 `process.env.PORT`(Hostinger가 지정)에 단일 프로세스로
> 바인딩합니다. 기본 `next start`는 Hostinger LiteSpeed(LSAPI) 환경에서 포트/프록시가
> 어긋나 503이 나므로 커스텀 서버를 사용합니다. (미들웨어·ISR·정적서빙 모두 동작 확인)

## 환경 변수

| 이름 | 값 | 용도 |
|---|---|---|
| **`NPM_CONFIG_PRODUCTION`** | `false` | devDependencies(Next·Tailwind·Prisma) 설치 보장 |
| **`DATABASE_URL`** | `mysql://user:pass@host:3306/db` | Prisma DB 접속 (Phase 2 필수) |
| **`AUTH_SECRET`** | `openssl rand -base64 32` 결과 | Auth.js 세션 서명 (Phase 2 필수) |
| **`AUTH_TRUST_HOST`** | `true` | 프록시(Hostinger) 뒤 호스트 신뢰 (Phase 2 필수) |

> 토큰(`GH_TOKEN`)은 **더 이상 필요 없습니다.** (디자인 시스템이 벤더링됨)

### 에러 모니터링(Sentry, 선택)
Sentry로 서버·브라우저 오류를 자동 수집하려면 아래 환경변수를 등록하세요. **미설정 시 완전히 비활성**(설치만 되고 아무 것도 전송 안 함)이라 지금 배포에는 영향 없습니다.

| 이름 | 값 | 용도 |
|---|---|---|
| `SENTRY_DSN` | Sentry 프로젝트 DSN | 서버(Node) 오류 전송 |
| `NEXT_PUBLIC_SENTRY_DSN` | 같은 DSN | 브라우저 오류 전송(빌드 시 주입 → **설정 후 재배포 필요**) |

> Sentry 계정(sentry.io 무료 플랜) → 프로젝트 생성 → DSN 복사 → 위 두 변수에 등록 → 재배포.
> 소스맵 업로드/webpack 플러그인은 쓰지 않으므로(빌드 메모리 안전) 스택트레이스는 압축된 형태로 표시됩니다.

## 배포 → 확인
- `/` 홈 · `/about` · `/business` · `/news` · `/apply` · `/location`
- `/login` · `/signup` · `/dashboard`(직원·관리자만)

---

## Phase 2 배포 (회원·권한·문의 DB)

빌드 명령 `npm run build` 는 이제 **`prisma migrate deploy && next build`** 입니다.
즉 배포 때마다 마이그레이션이 자동 적용됩니다. **최초 1회 순서:**

1. **Hostinger에서 MySQL 데이터베이스 생성** (hPanel → Databases → MySQL).
   생성된 host·db·user·pass로 `DATABASE_URL` 을 구성해 환경변수에 등록.
2. `AUTH_SECRET`(= `openssl rand -base64 32`), `AUTH_TRUST_HOST=true`, `NPM_CONFIG_PRODUCTION=false` 환경변수 등록.
3. **배포 실행** → `npm install`(postinstall: `prisma generate`) → `prisma migrate deploy`(테이블 생성) → `next build`.
4. **초기 관리자 계정 생성** (한 번만). 아래 중 하나:
   - 시드 스크립트: `ADMIN_EMAIL=... ADMIN_PASSWORD=... ADMIN_NAME=... npx prisma db seed`
   - 또는 `/signup` 으로 가입 후 DB에서 승격:
     `UPDATE User SET role='ADMIN' WHERE email='가입한이메일';`

### 권한 구분
- `ADMIN` 관리자 / `STAFF` 직원 → `/dashboard` 접근 가능(미들웨어 보호)
- `USER` 일반 회원 → `/dashboard` 접근 시 홈으로 리다이렉트

### 이메일 알림(선택)
문의 접수 시 관리자에게 메일을 보내려면 SMTP 환경변수를 설정하세요(미설정 시 발송만 건너뜀):
`SMTP_HOST`·`SMTP_PORT`(465/587)·`SMTP_USER`·`SMTP_PASS`·`SMTP_FROM`(선택)·`NOTIFY_EMAIL`(선택, 미설정 시 관리자 전체). Hostinger 이메일 계정의 SMTP를 쓰면 됩니다.

### 미포함(후속 증분)
- **후원 결제**: PG(토스페이먼츠/PortOne) 계약·키 필요 — 스키마(`Donation`)만 스캐폴드됨.

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

## 스키마 변경 시
`prisma/schema.prisma` 수정 후 로컬에서 `npx prisma migrate dev --name 변경명` 으로
마이그레이션 파일을 만들고 커밋하면, 배포 시 `prisma migrate deploy` 가 자동 적용합니다.
