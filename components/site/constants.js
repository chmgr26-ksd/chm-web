// CHM Group 공개 사이트 공용 상수 — 공식 웹 핸드오프 확정 콘텐츠.

export const CONTACT = {
  phone: '010-2220-3330',
  phoneHref: 'tel:01022203330',
  email: 'smbadboy@naver.com',
  address: '대전광역시 유성구 유성대로 780',
  addressDetail: '대전광역시 유성구 유성대로 780 청영빌딩 4층',
  // 지도 핀 좌표(위도,경도) — 도로명("유성대로")이 원내동~전민동까지 걸친 장거리 도로라
  // 문자열 지오코딩이 엉뚱한 구간을 잡는 문제를 피하려고 청영빌딩 좌표로 직접 고정.
  // 값 출처: 카카오맵 공유링크(유성대로 780) → WGS84 변환, 장대동 초등학교 좌표로 삼각검증.
  geo: '36.3614984,127.3366665',
  hours: '평일 09:00 – 18:00 · 주말·공휴일 휴무 (긴급 수리는 전화 문의)',
  rep: '김수동',
  companyKo: '(주)씨에이치엠그룹',
  companyEn: 'CHM Group Co., Ltd.',
};

// 후기 모집 구글 폼 URL — 실제 폼 주소로 교체 필요(관리자 제공).
export const REVIEW_FORM_URL = 'https://forms.gle/';

// 메인 네비게이션 — 일부는 하위메뉴(children)를 가진다.
// '/'는 랜딩(로고 클릭). '메인' 페이지는 삭제(콘텐츠는 '소개'로 이관).
export const NAV = [
  { href: '/about', label: '소개' },
  { href: '/business', label: '사업 안내' },
  {
    label: '소식',
    href: '/news/notices',
    children: [
      { href: '/news/notices', label: '공지사항' },
      { href: '/news/education', label: '교육 활동 소식' },
    ],
  },
  { href: '/archive', label: '활동 아카이브' },
  {
    label: '후기',
    href: '/reviews/class',
    children: [
      { href: '/reviews/class', label: '집수리 교실 후기' },
      { href: '/reviews/experience', label: '집수리 체험 후기' },
      { href: REVIEW_FORM_URL, label: '후기 모집 (참여하기)', external: true },
    ],
  },
  { href: '/resources', label: '자료실' },
  {
    label: '문의 사항',
    href: '/support/faq',
    children: [
      { href: '/support/faq', label: 'FAQ' },
      { href: '/support/qna', label: 'QNA' },
    ],
  },
  { href: '/location', label: '오시는 길' },
];

// 6대 핵심가치(성장 시퀀스) — DS value 키와 브랜드 컬러 매핑
export const VALUES = [
  { key: 'selfreliance',   name: '자립',       eng: 'SELF-RELIANCE',  desc: '도움을 받는 주민에서 지역의 문제를 해결하는 주민으로. 기술 습득과 일자리로 경제적 자립을 이룹니다.' },
  { key: 'trust',          name: '신뢰',       eng: 'TRUST',          desc: '안전, 책임, 전문성. 믿고 맡길 수 있는 생활환경 관리 서비스를 약속합니다.' },
  { key: 'cooperation',    name: '상생',       eng: 'COOPERATION',    desc: '주민과 상인, 기관이 함께 성장하는 지역경제 생태계를 만듭니다.' },
  { key: 'community',      name: '공동체',     eng: 'COMMUNITY',      desc: '사람과 사람을 연결합니다. 주민이 주민을 돌보는 따뜻한 마을을 지향합니다.' },
  { key: 'innovation',     name: '혁신',       eng: 'INNOVATION',     desc: '기존의 집수리를 넘어, 새로운 지역관리 모델을 만드는 창의적 해결방식을 시도합니다.' },
  { key: 'sustainability', name: '지속가능성', eng: 'SUSTAINABILITY',  desc: '지역에 뿌리내리고 세대를 이어 성장하는, 일회성이 아닌 지속 가능한 체계를 구축합니다.' },
];

export const APPLY_TYPES = [
  { key: 'repair', label: '집수리 서비스' },
  { key: 'edu',    label: '집수리 교실 참가' },
  { key: 'vol',    label: '자원봉사 · 협력' },
];
