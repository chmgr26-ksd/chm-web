// 실제 바이트(매직 넘버)로 이미지 종류 판별 — SVG 등 스크립트 실행 가능 포맷 배제.
// 신뢰할 수 없는 client Content-Type 대신 이 함수로 검증한다.
export function sniffImage(buf) {
  if (!buf || buf.length < 12) return null;
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  // GIF: "GIF8"
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x38) return 'image/gif';
  // WEBP: "RIFF"...."WEBP"
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  return null;
}

// 브라우저에서 재생 가능한 영상만 판별(mp4/webm). client Content-Type 대신 매직 넘버로 검증.
// mov(quicktime)는 크롬 미재생이 잦아 배제한다.
export function sniffVideo(buf) {
  if (!buf || buf.length < 12) return null;
  // ISO BMFF(mp4/m4v 등): 4..7 == "ftyp"
  if (buf[4] === 0x66 && buf[5] === 0x74 && buf[6] === 0x79 && buf[7] === 0x70) {
    const brand = String.fromCharCode(buf[8], buf[9], buf[10], buf[11]);
    if (brand.startsWith('qt')) return null; // quicktime(.mov) 제외
    return 'video/mp4';
  }
  // WebM / Matroska EBML: 1A 45 DF A3
  if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) return 'video/webm';
  return null;
}
