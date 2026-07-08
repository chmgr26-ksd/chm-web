// 날짜 표시·입력 유틸 — 서버 TZ(Asia/Seoul, server.js에서 고정) 기준으로 포맷.
const pad = (n) => String(n).padStart(2, '0');
const WD = ['일', '월', '화', '수', '목', '금', '토'];

// datetime-local 입력값("YYYY-MM-DDTHH:mm")으로 변환(수정 폼 초기값).
export function toLocalInput(d) {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

// 행사 일시 표기: "2026.07.15 (수) 14:30"
export function fmtEventDate(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}.${pad(dt.getMonth() + 1)}.${pad(dt.getDate())} (${WD[dt.getDay()]}) ${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
}

// 시작~종료 표기(같은 날이면 종료는 시각만).
export function fmtEventRange(start, end) {
  const s = fmtEventDate(start);
  if (!end) return s;
  const st = new Date(start);
  const e = new Date(end);
  const sameDay = st.getFullYear() === e.getFullYear() && st.getMonth() === e.getMonth() && st.getDate() === e.getDate();
  return sameDay ? `${s} ~ ${pad(e.getHours())}:${pad(e.getMinutes())}` : `${s} ~ ${fmtEventDate(end)}`;
}
