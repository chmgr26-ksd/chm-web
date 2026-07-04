'use client';

import Link from 'next/link';
import {
  AppShell, Sidebar, SidebarSection, SidebarItem, Topbar,
  PageHeader, Stat, Card, CardBody, BarChart, Badge, Avatar, Button,
  NoticeList, NoticeItem,
} from '@chm/design-system';

const ico = (d) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={d} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export default function DashboardPage() {
  return (
    <AppShell
      sidebar={
        <Sidebar footer={
          <div className="flex items-center gap-2">
            <Avatar name="김수동" value="trust" size="sm" />
            <div className="min-w-0"><div className="truncate text-body-sm font-semibold text-ink-800">김수동</div><div className="text-caption text-ink-500">대표</div></div>
          </div>
        }>
          <SidebarSection label="현황">
            <SidebarItem active icon={ico('M3 12l9-9 9 9M5 10v10h14V10')}>대시보드</SidebarItem>
            <SidebarItem icon={ico('M4 20V10M10 20V4M16 20v-8M22 20H2')} badge="new">통계·분석</SidebarItem>
          </SidebarSection>
          <SidebarSection label="업무">
            <SidebarItem icon={ico('M14 7l3 3-9 9H5v-3z')} badge={8}>집수리 신청</SidebarItem>
            <SidebarItem icon={ico('M17 20v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8')}>회원 관리</SidebarItem>
            <SidebarItem icon={ico('M4 4h16v12H8l-4 4z')}>소식·공지</SidebarItem>
          </SidebarSection>
        </Sidebar>
      }
      topbar={
        <Topbar actions={<><Link href="/"><Button variant="soft" size="sm">사이트로</Button></Link><Avatar name="김수동" value="trust" size="sm" /></>}>
          <div className="text-h4 font-semibold text-ink-800">대시보드</div>
        </Topbar>
      }
    >
      <PageHeader title="안녕하세요, 김수동님 👋" description="오늘의 사업단 운영 현황입니다." />
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <Stat label="이번 달 신청" value="126" unit="건" accent="trust" trend={{ dir: 'up', text: '+18%' }} />
        <Stat label="처리 완료" value="98" unit="건" accent="cooperation" trend={{ dir: 'up', text: '+12%' }} />
        <Stat label="배정 대기" value="14" unit="건" accent="selfreliance" />
        <Stat label="신규 회원" value="23" unit="명" accent="innovation" trend={{ dir: 'up', text: '+5명' }} />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2"><CardBody>
          <div className="mb-4 flex items-center justify-between">
            <div className="text-h4 font-semibold text-ink-800">월별 집수리 처리</div>
            <Badge value="trust" dot>2026 상반기</Badge>
          </div>
          <BarChart tone="trust" data={[
            { label: '1월', value: 62 }, { label: '2월', value: 74 }, { label: '3월', value: 68 },
            { label: '4월', value: 91 }, { label: '5월', value: 104 }, { label: '6월', value: 126 },
          ]} />
        </CardBody></Card>
        <Card><CardBody>
          <div className="mb-3 text-h4 font-semibold text-ink-800">최근 공지</div>
          <NoticeList className="border-0">
            <NoticeItem category="공지" title="상반기 회원 모집" date="07.01" />
            <NoticeItem category="소식" title="사업단 발대식" date="06.24" />
          </NoticeList>
        </CardBody></Card>
      </div>
    </AppShell>
  );
}
