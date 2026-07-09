# 후원 결제 — 동시성·멱등성 설계 (도입 전 사전 설계)

> **상태**: 미구현. `prisma/schema.prisma`의 `Donation`은 스캐폴드(name·amount·message·status)만 존재.
> PG(토스페이먼츠/PortOne) 계약·키 확보 후 이 문서대로 구현한다.
> **원칙**: 돈이 걸린 로직은 "테스트에서 되니 OK" 금지. 동시 요청·재시도·부분 실패에서도 **절대 이중 결제/이중 반영이 없어야** 한다.

---

## 1. 위협 모델 (결제에서 반드시 막을 3가지)

| 문제 | 결제에서의 구체적 사고 | 방어 |
|---|---|---|
| **Idempotency 위반** | 결제창 중복 클릭·네트워크 재시도·**웹훅 중복 수신**으로 같은 결제가 2번 반영 → 후원 금액 이중 기록 | 유니크 키(orderId·paymentKey·eventId) + 조건부 쓰기 |
| **Race condition** | 콜백과 웹훅이 **동시에** 같은 주문을 PAID로 바꾸려 함 (read-status→write) | 조건부 UPDATE(affected rows) 또는 행 잠금 |
| **Partial write** | "PAID 기록"과 "영수증 발송/집계 증가"가 여러 단계인데 중간 실패 | DB 트랜잭션(외부 호출은 트랜잭션 밖) |

핵심: **클라이언트가 보낸 금액·성공여부를 절대 신뢰하지 않는다.** 반드시 **서버가 PG 서버에 직접 조회/승인**해 확정한다.

---

## 2. 표준 결제 플로우 (승인 기반, 토스페이먼츠 v2 / PortOne 유사)

```
[1] 브라우저: 후원 폼 제출
       └→ 서버 POST /api/donations           (PENDING 주문 생성, orderId 발급)
[2] 브라우저: PG 결제창 호출(orderId, amount)
       └→ 사용자 결제
[3] PG → 브라우저: 성공 리다이렉트(paymentKey, orderId, amount)
       └→ 서버 POST /api/donations/confirm    (★ 승인·확정)
             ├ PG 서버에 승인 요청(secret key)  ← 외부호출(트랜잭션 밖)
             ├ 금액 == 우리 PENDING 금액 검증
             └ 조건부로 PENDING → PAID 전이
[4] PG → 서버: 웹훅 POST /api/webhooks/pay     (백업·비동기 확정)
             └ eventId 멱등 처리 후 동일 전이
```

**콜백(3)과 웹훅(4)은 둘 다 같은 상태 전이를 시도**한다 → **어느 쪽이 먼저 와도, 두 번 와도 결과가 같아야 한다(멱등)**.

---

## 3. 스키마 설계

```prisma
enum DonationStatus { PENDING PAID FAILED CANCELED }

model Donation {
  id          String         @id @default(cuid())
  orderId     String         @unique          // 우리가 발급하는 주문번호 = 멱등키(생성 단계)
  name        String
  amount      Int                              // 원 단위 정수(부동소수 금지)
  message     String?        @db.Text
  status      DonationStatus @default(PENDING)

  // 결제 확정 시 채워짐
  pgProvider  String?                          // "toss" | "portone"
  paymentKey  String?        @unique           // PG의 결제 고유키 = 멱등키(확정 단계). 이중기록 차단
  paidAt      DateTime?
  failReason  String?

  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  @@index([status, createdAt])
}

// 웹훅 중복 수신 방어용 — 처리한 이벤트 기록
model WebhookEvent {
  id          String   @id @default(cuid())
  provider    String
  eventId     String                           // PG가 준 이벤트/결제 고유 ID
  createdAt   DateTime @default(now())

  @@unique([provider, eventId])                // 같은 이벤트 재수신 시 INSERT 실패 → 스킵
}
```

**두 개의 유니크가 두 단계의 멱등을 보장한다:**
- `orderId @unique` → 주문 **생성** 중복 방지
- `paymentKey @unique` → 결제 **확정** 이중기록 방지

---

## 4. 단계별 구현과 방어

### 4-1. 주문 생성 `POST /api/donations`
```js
// 멱등키는 클라이언트가 요청당 1회 생성(UUID)하거나 서버가 cuid로 발급.
// 여기서는 서버 발급 orderId를 그대로 멱등키로 사용.
const orderId = crypto.randomUUID();
// 금액은 서버에서 정한 값/화이트리스트만 허용(클라 금액 맹신 금지). 최소·최대 검증.
if (!Number.isInteger(amount) || amount < 1000 || amount > 10_000_000)
  return 400;
const d = await prisma.donation.create({ data: { orderId, name, amount, message, status: 'PENDING' } });
return { orderId: d.orderId, amount: d.amount };
```
- **중복 클릭**: 매 클릭이 새 PENDING을 만드므로, 프런트에서 **결제창 진입 후 버튼 비활성화** + 만료되지 않은 PENDING 재사용 권장. PENDING 다수는 무해(결제 안 되면 자동 만료 처리).

### 4-2. 승인·확정 `POST /api/donations/confirm`  (★ 가장 중요)
```js
const { paymentKey, orderId, amount } = body;

// (a) 우리 PENDING 주문 확인 + 금액 대조(클라 금액 불신)
const order = await prisma.donation.findUnique({ where: { orderId } });
if (!order) return 404;
if (order.status === 'PAID') return { ok: true };          // 이미 확정 → 멱등 재응답
if (order.amount !== amount) return 400;                    // 금액 위변조 차단

// (b) PG 서버에 직접 승인(외부호출 — 트랜잭션 '밖'). PG 승인은 paymentKey+orderId+amount로 멱등.
const pg = await confirmWithPG({ paymentKey, orderId, amount });  // 실패 시 FAILED 처리
if (!pg.ok) {
  await prisma.donation.updateMany({ where: { orderId, status: 'PENDING' }, data: { status: 'FAILED', failReason: pg.reason } });
  return 400;
}

// (c) 조건부 상태 전이 — PENDING일 때만 PAID로. affected rows로 성공 판정(원자적).
const res = await prisma.donation.updateMany({
  where: { orderId, status: 'PENDING' },
  data: { status: 'PAID', pgProvider: pg.provider, paymentKey, paidAt: new Date() },
});
// res.count === 1 → 내가 확정. res.count === 0 → 이미 다른 경로(웹훅)가 확정함 → 멱등 성공.
return { ok: true };
```
- `updateMany({ where: { status: 'PENDING' } })` 는 **조건부 UPDATE**라 락 없이 원자적: 동시에 콜백·웹훅이 와도 **정확히 하나만 count=1**, 나머지는 count=0(무해).
- `paymentKey @unique` 가 최후의 방어: 어떤 이유로 두 주문에 같은 paymentKey를 쓰려 하면 DB가 거부.

### 4-3. 웹훅 `POST /api/webhooks/pay`  (백업·비동기)
```js
// (a) 서명 검증(PG secret로 HMAC 등) — 위조 웹훅 차단
if (!verifySignature(req)) return 401;

// (b) 이벤트 멱등: 이미 처리한 이벤트면 스킵 (INSERT 성공해야 처리)
try {
  await prisma.webhookEvent.create({ data: { provider, eventId } });
} catch (e) {
  if (e.code === 'P2002') return 200;   // 이미 처리됨 → 조용히 성공(재전송 대비)
  throw e;
}

// (c) 4-2(c)와 동일한 조건부 전이 재사용 (colback과 중복돼도 count로 흡수)
await prisma.donation.updateMany({ where: { orderId, status: 'PENDING' }, data: { status: 'PAID', paymentKey, paidAt: new Date() } });
return 200;
```

---

## 5. 규칙 (반드시 지킬 것)

1. **PG API 호출은 DB 트랜잭션 밖에서** — 외부 네트워크를 트랜잭션 안에 넣지 않는다(락 오래 잡힘·타임아웃 시 롤백 지옥).
2. **상태 전이는 항상 조건부** — `WHERE status = 'PENDING'` + affected rows 확인. `SELECT status → if → UPDATE` 금지(그 사이가 race 구간).
3. **금액·성공여부는 서버가 PG로 재확인** — 클라이언트 파라미터 맹신 금지.
4. **금액은 정수(원 단위)** — 부동소수 금지.
5. **웹훅은 서명 검증 + eventId 유니크로 멱등** — 재전송·중복 수신 대비.
6. **모든 상태 전이는 단방향** — PAID/CANCELED 등 종료 상태에서 재전이 금지(조건부 WHERE가 자동 보장).

---

## 6. 정합성 보정 (reconciliation)

콜백·웹훅을 둘 다 놓치는 경우(사용자 이탈, 웹훅 유실)를 대비:
- **주기 배치**(cron): 일정 시간 이상 `PENDING`인 주문을 PG 서버에 조회해 실제 상태로 동기화(PAID면 확정, 실패/만료면 CANCELED).
- 이 배치도 **4-2(c) 조건부 전이**를 재사용 → 이미 확정된 건 무해.

---

## 7. 안전성 검증

- **동시 요청**: 콜백과 웹훅이 동시에 PENDING→PAID 시도 → 조건부 `updateMany`가 **정확히 하나만 count=1**, 나머지는 count=0. 이중 반영 없음.
- **중복 요청**: 같은 결제 재전송/재클릭 → orderId·paymentKey·eventId 유니크로 흡수, 이미 PAID면 멱등 재응답(200). 이중 결제 없음.
- **부분 실패**: PG 승인 성공 후 DB 쓰기 전에 프로세스 종료 → 주문은 PENDING 유지 → **웹훅** 또는 **reconciliation 배치**가 PG 조회로 PAID 확정(승인은 멱등이라 재호출 안전). 반대로 DB만 되고 응답 유실 → 재요청 시 이미 PAID라 멱등.

---

## 8. 구현 체크리스트

- [ ] PG 계약(토스페이먼츠/PortOne) + `PG_SECRET_KEY` 환경변수
- [ ] `Donation` 스키마 확장(orderId·paymentKey unique 등) + `WebhookEvent` 모델 + 마이그레이션
- [ ] `POST /api/donations`(PENDING 생성) / `confirm`(승인·조건부 전이) / `webhooks/pay`(서명검증·멱등)
- [ ] 금액 화이트리스트·범위 검증, 서버측 금액 대조
- [ ] 웹훅 서명 검증
- [ ] reconciliation cron(장기 PENDING 동기화)
- [ ] 결제 실패/취소 UX + 영수증(기부금 영수증은 별도 요건 확인)

---

관련: [배포 가이드](../DEPLOY.md) · 현재 스키마 `prisma/schema.prisma`의 `Donation`(스캐폴드)
