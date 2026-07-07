// 소식·게시판 카테고리 — 라벨 + 브랜드 컬러 매핑(공용).
export const POST_CATEGORY = {
  RECRUIT:  { label: '모집',   value: 'selfreliance' },
  NOTICE:   { label: '공지',   value: 'trust' },
  EVENT:    { label: '행사',   value: 'cooperation' },
  CAMPAIGN: { label: '캠페인', value: 'innovation' },
};

export const POST_CATEGORY_VALUES = Object.keys(POST_CATEGORY);

export function isValidCategory(c) {
  return POST_CATEGORY_VALUES.includes(c);
}
