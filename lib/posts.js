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

// 공개 IA와 맞춘 소식 그룹 — 대시보드 세분화(공지사항 / 교육 활동 소식).
//  공지사항 = 공지·캠페인, 교육 활동 소식 = 행사·모집. (공개 /news/notices·/news/education와 동일)
export const POST_GROUPS = {
  notices:   { label: '공지사항',      cats: ['NOTICE', 'CAMPAIGN'], defaultCat: 'NOTICE', href: '/dashboard/posts/notices',  publicPath: '/news/notices' },
  education: { label: '교육 활동 소식', cats: ['EVENT', 'RECRUIT'],   defaultCat: 'EVENT',  href: '/dashboard/posts/education', publicPath: '/news/education' },
};

/** 카테고리로 소속 그룹 key 추정(없으면 notices). */
export function groupOfCategory(cat) {
  return Object.keys(POST_GROUPS).find((g) => POST_GROUPS[g].cats.includes(cat)) || 'notices';
}
