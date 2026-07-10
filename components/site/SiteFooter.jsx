import Link from 'next/link';
import { Container, Logo, ValueDotStrip } from '@chm/design-system';
import { CONTACT, NAV } from './constants';

export default function SiteFooter() {
  return (
    <footer className="bg-surface-dark text-ink-300">
      <Container size="xl" className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="full" size={28} inverse />
          <p className="mt-4 max-w-sm text-body-sm leading-relaxed text-ink-400">
            사람을 키우고, 집을 고치고, 마을을 연결한다.<br />
            주민의 기술과 참여로 지역의 생활환경 문제를 해결합니다.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-body-sm font-bold text-white">메뉴</h4>
          <ul className="flex flex-col gap-2.5 text-body-sm">
            {/* NAV에서 '/'(랜딩)는 로고로 이동하므로 원래 제외했으나, 이제 NAV 첫 항목은
                별도 페이지인 '/main'이라 그대로 노출한다. */}
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ink-300 hover:text-white">{n.label}</Link>
              </li>
            ))}
            <li><Link href="/apply" className="text-ink-300 hover:text-white">참여 신청</Link></li>
            <li><Link href="/login" className="text-ink-400 hover:text-white">로그인 · 회원</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-body-sm font-bold text-white">연락처</h4>
          <ul className="flex flex-col gap-2.5 text-body-sm text-ink-300">
            <li><a href={CONTACT.phoneHref} className="hover:text-white">{CONTACT.phone}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a></li>
            <li>{CONTACT.address}</li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container size="xl" className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="text-caption text-ink-400">© 2026 {CONTACT.companyKo} · {CONTACT.companyEn}</p>
          <ValueDotStrip variant="dots" size="sm" />
        </Container>
      </div>
    </footer>
  );
}
