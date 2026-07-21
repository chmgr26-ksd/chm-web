// 문서 파일 검증 — 확장자 allowlist + 실제 바이트(매직 넘버)로 컨테이너 종류 확인.
// 신뢰할 수 없는 client Content-Type 대신 이 함수로 검증한다(실행형 파일 배제).

// 확장자 → { mime, family }. family는 매직 넘버 계열.
//  - pdf: %PDF
//  - zip: Office Open XML(docx/xlsx/pptx) 및 hwpx는 ZIP 컨테이너(PK)
//  - ole: 구형 한컴/MS Office(hwp/doc/xls/ppt)는 OLE 복합 파일
const EXT_MIME = {
  pdf:  { mime: 'application/pdf', family: 'pdf' },
  hwp:  { mime: 'application/x-hwp', family: 'ole' },
  hwpx: { mime: 'application/hwp+zip', family: 'zip' },
  doc:  { mime: 'application/msword', family: 'ole' },
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', family: 'zip' },
  xls:  { mime: 'application/vnd.ms-excel', family: 'ole' },
  xlsx: { mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', family: 'zip' },
  ppt:  { mime: 'application/vnd.ms-powerpoint', family: 'ole' },
  pptx: { mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', family: 'zip' },
};

export const ALLOWED_EXTS = Object.keys(EXT_MIME);
export const ALLOWED_LABEL = 'PDF · HWP · HWPX · DOC(X) · XLS(X) · PPT(X)';

/** 파일명에서 소문자 확장자 추출(없으면 ''). */
export function extOf(filename) {
  const m = /\.([a-z0-9]+)$/i.exec(filename || '');
  return m ? m[1].toLowerCase() : '';
}

function familyMatches(family, buf) {
  if (family === 'pdf') {
    return buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46; // %PDF
  }
  if (family === 'zip') {
    // PK.. — 일반(03 04) / 빈 아카이브(05 06) / 분할(07 08) 모두 허용
    return buf[0] === 0x50 && buf[1] === 0x4b &&
      ((buf[2] === 0x03 && buf[3] === 0x04) || (buf[2] === 0x05 && buf[3] === 0x06) || (buf[2] === 0x07 && buf[3] === 0x08));
  }
  if (family === 'ole') {
    // OLE/CFB: D0 CF 11 E0 A1 B1 1A E1
    return buf[0] === 0xd0 && buf[1] === 0xcf && buf[2] === 0x11 && buf[3] === 0xe0 &&
      buf[4] === 0xa1 && buf[5] === 0xb1 && buf[6] === 0x1a && buf[7] === 0xe1;
  }
  return false;
}

/**
 * 문서 파일 검증 — 확장자와 실제 매직 넘버가 모두 맞아야 통과.
 * 반환: { ext, mime } | null.
 */
export function sniffDocument(filename, buf) {
  if (!buf || buf.length < 8) return null;
  const ext = extOf(filename);
  const info = EXT_MIME[ext];
  if (!info) return null;
  if (!familyMatches(info.family, buf)) return null;
  return { ext, mime: info.mime };
}
