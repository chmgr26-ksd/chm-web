---
name: CHM Group
description: 사람을 키우고, 집을 고치고, 마을을 연결한다
colors:
  primary: "#2e75b6"
  primary-hover: "#275f97"
  primary-active: "#204c79"
  primary-soft: "#eaf2fa"
  cta: "#f28c28"
  cta-hover: "#d5741a"
  cta-active: "#a95a15"
  cta-soft: "#fef4e9"
  cooperation: "#4caf50"
  community: "#f4c542"
  innovation: "#7b4fa3"
  sustainability: "#1f6e43"
  ink-900: "#1c232b"
  ink-800: "#2c3540"
  ink-600: "#4e5d6c"
  ink-500: "#6b7a8b"
  ink-400: "#97a4b2"
  ink-200: "#dde3ea"
  ink-100: "#eceff3"
  ink-50: "#f6f8fa"
  ink-0: "#ffffff"
  surface-warm: "#faf9f7"
  surface-cool: "#f3f7fb"
  surface-dark: "#1e2a38"
  danger: "#e14b4b"
typography:
  display:
    fontFamily: "Montserrat, Pretendard, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Pretendard, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Montserrat, Pretendard, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "20px"
  2xl: "28px"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  12: "48px"
  16: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ink-0}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.ink-0}"
  button-cta:
    backgroundColor: "{colors.cta}"
    textColor: "{colors.ink-0}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  button-cta-hover:
    backgroundColor: "{colors.cta-hover}"
    textColor: "{colors.ink-0}"
  button-outline:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.primary-hover}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 16px"
  input:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.ink-800}"
    rounded: "{rounded.md}"
    height: "40px"
    padding: "0 12px"
  card-elevated:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.ink-800}"
    rounded: "{rounded.lg}"
    padding: "24px"
  card-outline:
    backgroundColor: "{colors.ink-0}"
    textColor: "{colors.ink-800}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: CHM Group

## Overview

**Creative North Star: "따뜻한 이음 (The Warm Connective)"**

CHM Group의 시각 세계는 **사람과 집, 그리고 마을을 잇는 따뜻한 손길**이다. 차가운 기업 UI가 아니라, 도움을 받던 주민이 기술을 배워 이웃을 돌보는 자립의 서사를 화면이 그대로 닮는다. 신뢰의 파랑(`primary`)이 구조와 링크를 차분히 붙들고, 자립의 주황(`cta`)이 "신청·문의" 같은 결정적 행동에 온기를 얹는다. 배경은 순백이 아니라 살짝 데운 뉴트럴(`surface-warm` #faf9f7)로 두어, 공공기관의 딱딱함 대신 동네 사랑방의 온도를 낸다.

깊이는 요란하지 않다. **은은한 그림자와 10–14px의 둥근 모서리**가 6색 육각 엠블럼의 부드러운 기하를 반복하며, 표면은 평상시 잔잔하다가 상호작용에만 살짝 떠오른다. 6대 핵심가치(자립·신뢰·상생·공동체·혁신·지속가능성)는 6개의 브랜드 색으로 1:1 매핑되어, 장식이 아니라 **의미를 실어 나르는 신호**로만 등장한다.

가장 중요한 사용자는 고령·취약계층 주민이다. 그래서 이 시스템은 화려함보다 **읽힘과 눌림**을 먼저 존중한다: 넉넉한 본문 크기, 높은 대비, 예측 가능한 형태. 랜딩 페이지만은 방문자를 데우기 위해 앰버/브라운의 웜 팔레트를 예외적으로 두르지만, 그 바깥의 모든 표면은 DS 토큰을 정본으로 삼는다.

**Key Characteristics:**
- 신뢰 블루가 뼈대, 자립 오렌지가 행동 — 색이 곧 역할.
- 6대 가치 = 6개 브랜드 색, 의미 있는 곳에만.
- 부드러운 그림자 + 둥근 모서리로 얻는 신뢰감, 하드 라인 없음.
- 데운 뉴트럴 배경으로 만드는 사랑방의 온도.
- 접근성이 기본값: 16px 본문 하한, 또렷한 대비, 명료한 초점.

## Colors

브랜드 파랑을 축으로, 자립 주황을 행동색으로 삼고, 6대 가치 색이 신호로 얹히는 **따뜻한 신뢰형 팔레트**.

### Primary
- **신뢰 블루 (Trust Blue)** (`#2e75b6`): 시스템의 축. 링크·강조 톤·구조적 요소·정보 상태에 쓰는 기본 브랜드색. hover는 `#275f97`, active `#204c79`, 옅은 배경은 `primary-soft` `#eaf2fa`.

### Secondary
- **자립 오렌지 (Self-Reliance Orange / CTA)** (`#f28c28`): **전환 전용색.** "집수리 신청·교실 참가·문의하기"처럼 사용자가 눌러야 하는 결정적 행동에만. hover `#d5741a`, 옅은 배경 `cta-soft` `#fef4e9`. 브랜드에 온기를 주는 주역이자, 남용하면 힘을 잃는 색.

### Tertiary — 6대 핵심가치 색
가치를 표현하는 신호색. 카드 상단 강조 바, 아이콘, 가치 카드에만 사용한다(본문·버튼 배경으로 확장 금지).
- **상생 그린 (Cooperation)** (`#4caf50`): 성공/긍정 상태 겸용.
- **공동체 골드 (Community)** (`#f4c542`): 주의(caution) 상태 겸용. 밝아서 텍스트는 `ink-900`을 얹는다.
- **혁신 퍼플 (Innovation)** (`#7b4fa3`).
- **지속가능성 딥그린 (Sustainability)** (`#1f6e43`).
- (자립 오렌지·신뢰 블루는 위 Primary/Secondary와 동일 색을 공유한다.)

### Neutral — Ink (딥네이비 → 그레이)
- **워드마크 딥네이비 (Ink 800)** (`#2c3540`): 기본 본문 텍스트이자 로고 워드마크 색.
- **뮤트 텍스트 (Ink 600)** (`#4e5d6c`): 보조 설명. **서브틀 (Ink 500)** (`#6b7a8b`): 캡션·placeholder 상위.
- **보더 (Ink 200)** (`#dde3ea`) / **강한 보더 (Ink 300)** (`#c3ccd6`): 경계·구분선.
- **표면**: 앱 배경 `ink-50` `#f6f8fa`, 카드/서피스 `ink-0` `#ffffff`.
- **데운 뉴트럴 (Surface Warm)** (`#faf9f7`): 웜 섹션 배경. **쿨 연블루 (Surface Cool)** (`#f3f7fb`): 히어로 등 쿨 섹션.
- **다크 섹션 (Surface Dark)** (`#1e2a38`): 통계 밴드·공지 바 등 반전 영역. 위 텍스트는 `ink-0`.

### Functional
- **위험 (Danger)** (`#e14b4b`): 브랜드에 적색이 없어 기능 전용으로 도입. 파괴적 행동·에러에만. soft `#fdeceb`.

### Named Rules
**The Blue-Anchors-Orange-Acts Rule.** 신뢰 블루는 구조·링크·톤을 붙들고, 자립 오렌지는 오직 전환 행동(신청·문의)에만 나타난다. 한 화면에 강조 오렌지 CTA는 원칙적으로 **하나**. 그 희소성이 전환력을 만든다.

**The Six-Value Rule.** 6개 브랜드 색은 6대 핵심가치를 표현하는 신호로만 쓴다(가치 카드, 카드 상단 accent 바, 아이콘). 버튼·본문·큰 배경 면적에 장식으로 칠하지 않는다.

**The Landing-Warmth Exception.** 랜딩(`/`)만 앰버/브라운 웜 팔레트를 두른다 — `chm-primary` `#d97706`, `chm-bg` `#fffcf8`, `chm-text` `#431407`, `chm-text-muted` `#78350f`, `chm-border` `#ffedd5`. 이는 방문자를 데우기 위한 **의도된 표면 예외**이며, 랜딩 바깥의 어떤 화면에도 이 값들을 쓰지 않는다. 정본은 언제나 DS 토큰이다.

## Typography

**Display/숫자 Font:** Montserrat (fallback Pretendard, sans-serif)
**Body Font:** Pretendard (Pretendard Variable → system-ui → Noto Sans KR → Malgun Gothic)
**Mono Font:** JetBrains Mono (코드·기술 표기 한정)

**Character:** 한글 본문은 Pretendard로 또렷하고 인간적인 목소리를 내고, 숫자와 영문 라벨·통계 수치는 Montserrat로 각지고 자신감 있게 대비를 준다. 두 서체 모두 next/font/local로 셀프호스팅한다.

### Hierarchy
- **Display** (Montserrat/Pretendard 700, `3rem`/48px, lh 1.25): 통계 수치, 대형 영문/숫자 강조.
- **Headline** (Pretendard 700, `2.25rem`/36px, lh 1.25): 페이지 H1.
- **Title** (Pretendard 600, `1.75rem`/28px, lh 1.4): 섹션 제목(H2). 하위 제목 H3 `1.375rem`/22px, H4 `1.125rem`/18px.
- **Body** (Pretendard 400, `1rem`/16px, lh 1.6): 기본 본문. 강조 본문 `body-lg` 17px. 긴 글은 65–75ch 폭 권장.
- **Label/Overline** (Montserrat/Pretendard 600, `0.6875rem`/11px, letter-spacing 0.08em, 종종 대문자): eyebrow·태그·메타 라벨.

### Named Rules
**The Montserrat-for-Numbers Rule.** Montserrat(display)는 숫자·영문 라벨·워드마크 강조에만. 한글 본문에 Montserrat를 강제하지 말 것(자모 폴백이 어색해진다).

**The 16px Floor Rule.** 본문 텍스트는 16px 아래로 내려가지 않는다. 캡션·라벨(11–14px)은 보조 정보에 한정. 고령 사용자가 기본 사용자이므로 본문 축소는 접근성 후퇴다.

## Layout

4px 그리드 기반의 스페이싱 스케일(`space-1`=4px … `space-20`=80px)로 리듬을 맞춘다. 콘텐츠는 중앙 정렬된 `Container`로 폭을 제한하고, 카드·그리드는 넉넉한 거터로 숨 쉬게 둔다. 섹션은 배경색(warm/cool/dark)을 번갈아 얹어 스크롤 리듬을 만든다. 반응형은 모바일 우선이며, 히어로의 미디어 래퍼는 `flex justify-end`라 폭 미지정 시 축소되므로 **미디어 컨테이너에 `w-full`(또는 `w-[90%]`)을 명시**해야 한다. 밀도는 여유로운 편 — 취약계층 배려를 위해 터치 타깃과 여백을 넉넉히 유지한다.

## Elevation & Depth

**하이브리드지만 그림자 우세.** 표면은 평상시 잔잔하고, 깊이는 하드 라인이 아니라 **딥네이비 잉크 기반의 부드러운 그림자**(`rgba(28,35,43,·)`)로 표현한다. 카드는 기본적으로 `shadow-chm-md`로 살짝 떠 있고, 상호작용(hover)에서 `shadow-chm-lg`로 더 떠오른다. 다크 섹션은 그림자 대신 톤 대비로 층을 만든다.

### Shadow Vocabulary
- **sm** (`box-shadow: 0 1px 2px rgba(28,35,43,.06), 0 1px 1px rgba(28,35,43,.04)`): 미세한 분리(입력·태그).
- **md** (`0 4px 12px rgba(28,35,43,.08), 0 2px 4px rgba(28,35,43,.05)`): 카드 기본 부양.
- **lg** (`0 12px 28px rgba(28,35,43,.10), 0 4px 8px rgba(28,35,43,.06)`): hover·강조 카드.
- **xl** (`0 24px 48px rgba(28,35,43,.14), 0 8px 16px rgba(28,35,43,.08)`): 모달·오버레이.
- **ring** (`0 0 0 3px var(--chm-trust-200)`): 초점 링(포커스 표시의 기본).

### Named Rules
**The Soft-Shadow, No-Harsh-Line Rule.** 깊이는 은은한 그림자로 낸다. 순수 검정(`#000`) 그림자나 무거운 1px 블랙 보더로 표면을 가르지 않는다. 경계가 필요하면 `ink-200` 보더를 쓴다.

## Shapes

**엠블럼의 부드러운 육각을 반복하는 둥근 형태 언어.** 라운드 스케일은 sm 6px · md 10px · lg 14px · xl 20px · 2xl 28px · full(pill). 버튼·입력은 크기에 따라 6/10/14px, 카드는 14px, 알약형 태그·배지는 full. 각지고 날카로운 0px 코너는 쓰지 않는다. 카드 상단의 1px 높이 **accent 바**(`before:`)로 6대 가치 색을 얇게 얹는 것이 시그니처 실루엣이다.

## Components

### Buttons
- **Shape:** 크기별 라운드 — sm `rounded-chm-sm`(6px) / md `rounded-chm-md`(10px) / lg `rounded-chm-lg`(14px). 높이 sm 32 / md 40 / lg 48px.
- **Variants × Tones:** 5개 변형(`solid` `soft` `outline` `ghost` `link`) × 7개 톤(`primary` `cta` `success` `warning` `caution` `danger` `ink`). 조합은 `TONE[tone][variant]` 맵으로 관리.
- **Primary (solid/primary):** `bg-trust-500` + 흰 텍스트, hover `trust-600`, active `trust-700`. 톤·1차 액션.
- **CTA (solid/cta):** `bg-cta`(#f28c28) + 흰 텍스트, hover `cta-hover`. **전환 버튼의 정답.**
- **Focus:** `focus-visible:ring-2 ring-trust-300 ring-offset-1` — 키보드 초점 항상 가시.
- **Loading/Disabled:** 로딩 시 현재색 스피너, 비활성 `opacity-50`. `<a>`/Link로 렌더 시 `disabled` 대신 `aria-disabled`.
- **폰트:** `font-semibold`, 색 전환은 `duration-chm`(200ms) `ease-chm`.

### Cards / Containers
- **Corner:** `rounded-chm-lg`(14px), `overflow-hidden`.
- **Variants:** `elevated`(bg-surface + shadow-chm-md, 기본) / `outline`(bg-surface + border-border) / `muted`(bg-surface-muted).
- **Accent bar:** `accent` 지정 시 상단 1px 바로 6대 가치 색 표시(`before:bg-{value}-500`).
- **Interactive:** hover 시 `shadow-chm-lg`로 부양 + `cursor-pointer`.
- **Slots:** Header `px-6 pt-6 pb-3`, Body `px-6 py-4`, Footer `px-6 py-4 border-t`. Title `text-h4 font-semibold text-ink-800`, Description `text-body-sm text-ink-600`.

### Inputs / Fields
- **Style:** 래퍼가 `bg-surface` + `border-border` + 크기별 라운드. 내부 `<input>`은 투명 배경, 텍스트 `ink-800`, placeholder `ink-400`.
- **Focus:** `focus-within:ring-2 ring-trust-300 border-trust-500` — 래퍼 전체가 초점 반응.
- **Invalid:** `border-danger` + `ring-danger/30`, `aria-invalid` 부여.
- **Disabled:** `opacity-50` + `bg-surface-muted`.
- **Affordance:** `prefix`/`suffix` 슬롯(아이콘·단위) `text-ink-500`.

### Navigation
- 상·하단 공용 NAV. 8개 상위 메뉴, 일부는 드롭다운(children). 데스크톱은 hover 드롭다운, 모바일은 접이식. 활성 라벨은 브랜드 블루로 표시. 헤더 로고는 밝은 배경 전용 래스터 `logo.png`, 푸터는 SVG `<Logo inverse>`.

### Logo (시그니처)
- **엠블럼:** 6색 육각 링(6대 가치 순환) + 중앙 집(house) 심볼. `variant='full|emblem|wordmark|official'`.
- **워드마크:** 딥네이비(`ink-800`). 밝은 배경 전용. 다크 배경엔 `<Logo inverse>`(흰 워드마크).

### PageHero (시그니처)
- **Signature:** 상단에 **6색 브랜드 스펙트럼 라인**(높이 6px, 자립→신뢰→상생→공동체→혁신→지속가능성 순 6등분). 이 스트립이 마케팅 페이지의 서명.
- **Structure:** lg에서 2열 그리드 — 좌측 eyebrow(`text-overline` 대문자 `trust-600`) + H1(`ink-800`, lg에서 `display` 48px) + description(`body-lg` `ink-600`) + actions, 우측 media.
- **Layout note:** media 래퍼가 `flex justify-center lg:justify-end`라 폭 미지정 시 축소 — media에 `w-full`(또는 `w-[90%]`)을 명시한다.

### StatBand (시그니처)
- **Character:** 다크 배경(`surface-dark` #1e2a38) 위 대형 지표 밴드. "낡아가는 동네" 통계 섹션의 컴포넌트화.
- **Numbers:** 수치는 `font-display`(Montserrat) 2.375rem `font-extrabold` `tabular-nums`, 단위는 작게(1.25rem). 다크 대비를 위해 accent는 **밝은 톤**(300/400: `trust-300`·`selfreliance-400` 등), 라벨은 `ink-300`.
- **Layout:** 좌측 headline(white `h3`) + auto-fit 그리드(`minmax(180px, 1fr)`).

### ValueCard (6대 가치 전용)
- **Character:** 6대 핵심가치 표현 카드. 좌측 세로 컬러 바(`w-1.5`, 가치색) + inset ring(가치 100톤) + 육각 chip 아이콘.
- **Content:** 라벨(`h4` `ink-800`) + 영문 라벨(caption 대문자 `ink-500`) + 인용 symbol(`ink-700`) + meaning chips(알약, 가치 50/700 chip).
- **State:** `shadow-chm-sm` → hover `shadow-chm-lg`. `Six-Value Rule`의 대표 사용처.

### NoticeBar
- **Character:** 페이지 최상단 공지/모집 알림 바(예: "2026 집수리 교실 모집 중"). 중앙 정렬, `role="region"`.
- **Tones:** `dark`(surface-dark 바, badge=자립 오렌지, link=`community-400`) / `cta`(오렌지 바) / `primary`(블루 바).
- **Parts:** 알약 badge(`overline` bold) + 본문(medium) + action 링크(bold) + 선택적 닫기 버튼(X, `aria-label="공지 닫기"`).

### Badges & Tags
- **Badge:** 상태/카테고리 라벨. 8색(6대 가치 + `ink` + `danger`) × 3변형(`soft`/`solid`/`outline`) × 2크기(sm/md), `rounded-chm-sm`, 선택적 상태 점(`dot`). community `solid`는 밝아 텍스트를 `ink-900`으로 얹는다.
- **Tag:** 필터·분류용 경량 라벨(별도 컴포넌트).

## Do's and Don'ts

### Do:
- **Do** 전환 행동(신청·문의)에 자립 오렌지 CTA(`bg-cta`)를, 링크·톤에는 신뢰 블루(`primary`)를 쓴다.
- **Do** 본문을 16px 이상, 대비를 WCAG AA(4.5:1) 이상으로 유지한다 — 고령·취약계층이 기본 사용자.
- **Do** 6대 가치 색은 카드 accent 바·아이콘·가치 카드 등 **의미 있는 신호**에만 얹는다.
- **Do** 깊이는 `shadow-chm-md/lg`와 10–14px 라운드로 낸다(부드럽고 신뢰감 있게).
- **Do** 모든 상호작용 요소에 `focus-visible` 링(`ring-trust-300`)을 유지한다.
- **Do** 배경은 순백 대신 데운 뉴트럴(`surface-warm`)·쿨 연블루(`surface-cool`)로 섹션 리듬을 만든다.

### Don't:
- **Don't** 랜딩 밖 화면에 웜 팔레트(`chm-primary` #d97706, `chm-text` #431407 등)를 쓴다 — 그건 랜딩 전용 예외다.
- **Don't** 한 화면에 강조 오렌지 CTA를 여러 개 두어 전환 초점을 흩뜨린다.
- **Don't** 6개 브랜드 색을 버튼·큰 배경 면적에 장식으로 남용한다.
- **Don't** 순수 검정(`#000`) 텍스트·보더·그림자로 표면을 가른다 — `ink-800`/`ink-200`/부드러운 그림자를 쓴다.
- **Don't** 로고 래스터 `logo.png`를 어두운 배경에 얹는다(워드마크 딥네이비·counter 투명) — SVG `<Logo inverse>`를 쓴다.
- **Don't** 본문 텍스트를 16px 아래로 축소한다.
