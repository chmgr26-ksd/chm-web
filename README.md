# CHM Web (FORM D 웹앱)

CHM Group의 웹앱·업무 플랫폼입니다. **Next.js(App Router)** 기반이며, 브랜드
디자인은 [`@chm/design-system`](https://github.com/ppangppangsk/chm-group)을 그대로 소비합니다.

## 로컬 실행

```bash
npm install          # @chm/design-system(private git dep) 접근 권한 필요 — 아래 참고
npm run dev          # http://localhost:3000
```

> **private 디자인 시스템 의존성**: `@chm/design-system`은 private 저장소
> `github:ppangppangsk/chm-group`에서 설치됩니다. 로컬에서 `npm install`이 되려면
> 해당 저장소에 접근 가능한 GitHub 인증(SSH 키 또는 토큰)이 있어야 합니다.
> (SSH 접근이 되는 환경이면 그대로 설치됩니다.)

## 구조

```
chm-web/
├─ app/
│  ├─ layout.jsx        # 루트 레이아웃 (토큰 CSS + Tailwind 로드)
│  ├─ globals.css       # @tailwind 지시자
│  ├─ page.jsx          # 홈 (PageHero·FeatureCard·Stat)
│  ├─ login/page.jsx    # 로그인 (AuthCard) — Phase 2에서 Auth.js 연결
│  └─ dashboard/page.jsx# 대시보드 (AppShell·Stat·BarChart)
├─ next.config.js       # transpilePackages: ['@chm/design-system']
├─ tailwind.config.js   # 디자인 시스템 프리셋 소비 + 컴포넌트 스캔
└─ postcss.config.js
```

## 디자인 시스템 사용법

```jsx
'use client'; // 인터랙티브 컴포넌트를 쓰는 페이지는 클라이언트 컴포넌트로
import { Button, AppShell, DonationCard } from '@chm/design-system';
```

- 색상/타이포: 프리셋의 Tailwind 유틸리티(`bg-trust-500`, `text-ink-800`,
  `rounded-chm-lg` 등). 동적 브랜드 클래스는 프리셋 safelist로 자동 보장됩니다.
- 토큰 CSS는 `app/layout.jsx`에서 한 번 import합니다.

## 로드맵 (기획서 FORM D)

- **Phase 0** ✅ 스캐폴드 — Next.js + DS 연결 + 홈·로그인·대시보드 샘플 + 배포 골격
- **Phase 1** 공개 페이지 (홈·소개·연혁·사업·서비스·소식·문의·후원·FAQ·갤러리·오시는길)
- **Phase 2** 회원·권한 (Auth.js + MySQL/Prisma, 권한 관리자/직원/일반)
- **Phase 3** 업무 기능 (대시보드·관리자·게시판 CRUD·문의 저장·통계)
- **Phase 4** 후원 결제 (PG 연동) + 배포 안정화

배포는 [`DEPLOY.md`](./DEPLOY.md) 참고 (Hostinger Node.js).
