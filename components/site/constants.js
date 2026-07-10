// CHM Group 공개 사이트 공용 상수 — 공식 웹 핸드오프 확정 콘텐츠.

export const CONTACT = {
  phone: '010-2220-3330',
  phoneHref: 'tel:01022203330',
  email: 'smbadboy@naver.com',
  address: '대전광역시 유성구 어은동',
  addressDetail: '대전광역시 유성구 어은동 (상세 주소 입력 예정)',
  hours: '평일 09:00 – 18:00 · 주말·공휴일 휴무 (긴급 수리는 전화 문의)',
  rep: '김수동',
  companyKo: '(주)씨에이치엠그룹',
  companyEn: 'CHM Group Co., Ltd.',
};

export const NAV = [
  // '/'는 랜딩 페이지(로고 클릭으로 이동). 기존 홈은 '/main'으로 이동하며 라벨은 '메인'.
  { href: '/main', label: '메인' },
  { href: '/about', label: '소개' },
  { href: '/business', label: '사업 안내' },
  { href: '/news', label: '소식' },
  { href: '/events', label: '행사' },
  { href: '/gallery', label: '갤러리' },
  { href: '/faq', label: 'FAQ' },
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
