import Link from 'next/link';
import { Container, Logo, ValueDotStrip } from '@chm/design-system';
import { resolveNav } from './constants';
import { getContact } from '@/lib/siteContent';

export default async function SiteFooter() {
  const CONTACT = await getContact();
  const NAV = resolveNav(CONTACT.reviewFormUrl);
  return (
    <footer className="bg-surface-dark text-ink-300">
      <Container size="xl" className="grid gap-10 py-14 md:grid-cols-[1.2fr_2fr_1fr]">
        <div>
          <Logo variant="full" size={28} inverse />
          <p className="mt-4 max-w-sm text-body-sm leading-relaxed text-ink-400">
            사람을 키우고, 집을 고치고, 마을을 연결한다.<br />
            주민의 기술과 참여로 지역의 생활환경 문제를 해결합니다.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-body-sm font-bold text-white">메뉴</h4>
          {/* 상단 네비(NAV)와 동일 구조 — 하위메뉴까지 사이트맵으로 노출. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-5 text-body-sm sm:grid-cols-3">
            {NAV.map((n) =>
              n.children ? (
                <div key={n.label}>
                  <Link href={n.href} className="mb-2 block font-bold text-white hover:text-ink-200">{n.label}</Link>
                  <ul className="flex flex-col gap-1.5">
                    {n.children.map((c) =>
                      c.external ? (
                        <li key={c.href}>
                          <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-ink-400 hover:text-white">{c.label} ↗</a>
                        </li>
                      ) : (
                        <li key={c.href}>
                          <Link href={c.href} className="text-ink-300 hover:text-white">{c.label}</Link>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ) : (
                <div key={n.href}>
                  <Link href={n.href} className="font-bold text-white hover:text-ink-200">{n.label}</Link>
                </div>
              )
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-body-sm">
            <Link href="/apply" className="text-ink-300 hover:text-white">참여 신청</Link>
            <Link href="/login" className="text-ink-400 hover:text-white">로그인 · 회원</Link>
          </div>
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
