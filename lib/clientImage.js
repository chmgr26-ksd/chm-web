// 브라우저 클라이언트 전용 이미지 처리 유틸(캔버스 기반). 서버에서 import 금지.
// 갤러리·후기 등 이미지 업로드 폼에서 공유 — 서버 이미지 처리 없이 메모리 안전하게 리사이즈.

// 해상도(사이즈) 프리셋 — 저장되는 원본의 최대 변, JPEG 품질.
export const SIZE_PRESETS = {
  high: { label: '고화질 (1600px)', maxDim: 1600, quality: 0.9 },
  standard: { label: '표준 (1200px)', maxDim: 1200, quality: 0.85 },
  light: { label: '가벼움 (800px)', maxDim: 800, quality: 0.8 },
};

// 썸네일(그리드) 비율 — 중앙 크롭. null이면 원본 비율 유지.
export const RATIO_PRESETS = {
  original: { label: '원본 비율', ar: null },
  square: { label: '정사각형 1:1', ar: 1 },
  landscape: { label: '가로 4:3', ar: 4 / 3 },
  portrait: { label: '세로 3:4', ar: 3 / 4 },
};

export const SIZE_OPTIONS = Object.entries(SIZE_PRESETS).map(([value, p]) => ({ value, label: p.label }));
export const RATIO_OPTIONS = Object.entries(RATIO_PRESETS).map(([value, p]) => ({ value, label: p.label }));

// 브라우저에서 이미지를 리사이즈(+선택적 중앙 크롭)해 JPEG Blob 반환.
// imageOrientation으로 EXIF 회전 반영. 실패 시 예외 → 호출부에서 원본 폴백 처리.
export async function renderResized(file, { maxDim, quality, ratio = null }) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  let sx = 0, sy = 0, sw = bitmap.width, sh = bitmap.height;

  // 원하는 비율(width/height)로 중앙 크롭.
  if (ratio) {
    const srcAR = sw / sh;
    if (srcAR > ratio) {
      const newW = sh * ratio;
      sx = (sw - newW) / 2;
      sw = newW;
    } else {
      const newH = sw / ratio;
      sy = (sh - newH) / 2;
      sh = newH;
    }
  }

  // 크롭 영역을 maxDim에 맞춰 축소(확대는 안 함).
  let ow = sw, oh = sh;
  if (ow > maxDim || oh > maxDim) {
    const scale = Math.min(maxDim / ow, maxDim / oh);
    ow = ow * scale;
    oh = oh * scale;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(ow));
  canvas.height = Math.max(1, Math.round(oh));
  canvas.getContext('2d').drawImage(bitmap, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  if (bitmap.close) bitmap.close();
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

// 업로드용 표준 처리 — 원본(비율 유지)과 썸네일(선택 비율 크롭)을 함께 생성.
// 반환: { main: Blob, thumb: Blob } (실패 시 예외).
export async function prepareUpload(file, { size = 'standard', thumbRatio = null, thumbDim = 700 } = {}) {
  const preset = SIZE_PRESETS[size] || SIZE_PRESETS.standard;
  const [main, thumb] = await Promise.all([
    renderResized(file, { maxDim: preset.maxDim, quality: preset.quality, ratio: null }),
    renderResized(file, { maxDim: thumbDim, quality: 0.8, ratio: thumbRatio }),
  ]);
  return { main, thumb };
}
