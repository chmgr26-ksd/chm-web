/**
 * CHM Group Design System — 공개 엔트리포인트.
 * "사람을 키우고, 집을 고치고, 마을을 연결한다"
 *
 * 사용 전 토큰 스타일시트를 반드시 한 번 임포트하세요:
 *   import '@chm/design-system/tokens.css';
 */

// 유틸
export { cn } from './lib/cn.js';

// 브랜드
export { Logo } from './components/Logo.jsx';
export { ValueCard } from './components/ValueCard.jsx';
export { ValueDotStrip } from './components/ValueDotStrip.jsx';

// 액션 & 표시
export { Button } from './components/Button.jsx';
export { Badge } from './components/Badge.jsx';
export { Tag } from './components/Tag.jsx';
export { Avatar, AvatarGroup } from './components/Avatar.jsx';
export { Spinner } from './components/Spinner.jsx';
export { Progress } from './components/Progress.jsx';
export { Stat } from './components/Stat.jsx';
export { Tooltip } from './components/Tooltip.jsx';
export { Divider } from './components/Divider.jsx';

// 컨테이너 & 레이아웃
export {
  Card, CardHeader, CardTitle, CardDescription, CardBody, CardFooter,
} from './components/Card.jsx';
export { Container } from './components/Container.jsx';
export { Alert } from './components/Alert.jsx';

// 폼
export { Field } from './components/Field.jsx';
export { Input } from './components/Input.jsx';
export { Textarea } from './components/Textarea.jsx';
export { Select } from './components/Select.jsx';
export { Checkbox } from './components/Checkbox.jsx';
export { Radio } from './components/Radio.jsx';
export { Switch } from './components/Switch.jsx';

// 네비게이션 & 인터랙션
export { Tabs, TabList, Tab, TabPanel } from './components/Tabs.jsx';
export { Accordion, AccordionItem } from './components/Accordion.jsx';
export { Modal } from './components/Modal.jsx';
export { Breadcrumb } from './components/Breadcrumb.jsx';
export { Pagination } from './components/Pagination.jsx';

// 데이터
export {
  Table, THead, TBody, TR, TH, TD,
} from './components/Table.jsx';

// ── 플랫폼(FORM D) 컴포넌트 ──────────────────────────────
// 앱 레이아웃
export {
  AppShell, Sidebar, SidebarSection, SidebarItem, Topbar,
} from './components/AppShell.jsx';
export { PageHeader } from './components/PageHeader.jsx';
export { EmptyState } from './components/EmptyState.jsx';

// 통계·분석
export { BarChart, Sparkline } from './components/Chart.jsx';

// 회원·후원·게시판
export { AuthCard } from './components/AuthCard.jsx';
export { DonationCard } from './components/DonationCard.jsx';
export { NoticeList, NoticeItem } from './components/NoticeList.jsx';

// 마케팅 페이지
export { PageHero } from './components/PageHero.jsx';
export { FeatureCard } from './components/FeatureCard.jsx';
export { Timeline, TimelineItem } from './components/Timeline.jsx';
export { NoticeBar } from './components/NoticeBar.jsx';
export { StatBand } from './components/StatBand.jsx';

// 토큰 (JS에서 프로그래매틱 접근용)
export { default as tokens } from './tokens/tokens.json';
