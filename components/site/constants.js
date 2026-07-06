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
  { href: '/', label: '홈' },
  { href: '/about', label: '소개' },
  { href: '/business', label: '사업 안내' },
  { href: '/news', label: '소식' },
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

// 소식 — 정적 데이터(향후 CMS·게시판으로 대체)
export const NEWS = [
  {
    id: 1, cat: '모집', value: 'selfreliance', date: '2026.07.01',
    title: '2026 집수리 교실 1기 수강생 모집',
    body: `우리 동네 집은 우리 손으로! 기초 수리 기술을 배우는 집수리 교실 1기 수강생을 모집합니다.

· 대상: 대전 유성구 거주 주민 누구나
· 기간: 2026년 8월, 주 2회 총 8회
· 내용: 공구 사용법, 방충망·수전·조명 교체, 안전 교육
· 수료 후 마을관리사업단 활동 연계

참여를 원하시면 아래 버튼으로 신청해 주세요.`,
  },
  {
    id: 2, cat: '공지', value: 'trust', date: '2026.06.24',
    title: '예비사회적기업 지정 신청 접수 완료',
    body: `CHM Group이 2026년 7월 예비사회적기업 지정 신청을 완료했습니다.

3년간의 리빙랩 실증 경험을 바탕으로, 2027년 인증 사회적기업 전환을 목표로 나아갑니다. 응원해 주신 주민과 파트너 기관에 감사드립니다.`,
  },
  {
    id: 3, cat: '행사', value: 'cooperation', date: '2026.06.12',
    title: '어은동 리빙랩 성과공유회 개최 안내',
    body: `지난 3년간 어은동·궁동에서 진행한 주민 참여형 주거관리 리빙랩의 성과를 나누는 자리를 마련했습니다.

주민 수요조사 결과, 집수리 교육-서비스 연계 사례, 앞으로의 계획을 공유합니다. 관심 있는 주민과 기관 누구나 환영합니다.`,
  },
  {
    id: 4, cat: '캠페인', value: 'innovation', date: '2026.05.30',
    title: '장마철 대비 우리집 안전점검 캠페인',
    body: `장마가 오기 전, 누수·곰팡이·전기 안전을 미리 점검하세요.

캠페인 기간 중 신청 가구를 대상으로 기본 안전점검을 진행합니다. 점검 항목: 지붕·창호 누수, 배수, 콘센트·누전차단기, 곰팡이 취약부.`,
  },
];

export const APPLY_TYPES = [
  { key: 'repair', label: '집수리 서비스' },
  { key: 'edu',    label: '집수리 교실 참가' },
  { key: 'vol',    label: '자원봉사 · 협력' },
];
