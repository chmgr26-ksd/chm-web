import { auth } from '@/auth';
import { can } from '@/lib/rbac';
import { PageHeader, EmptyState } from '@chm/design-system';
import MailSettingsForm from './MailSettingsForm';
import ContactSettingsForm from './ContactSettingsForm';
import SiteImagesForm from './SiteImagesForm';
import NoticeHeroForm from './NoticeHeroForm';
import { getSiteImageMimes, isVideoMime } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

function Section({ title, description, children }) {
  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-h4 font-bold text-ink-850">{title}</h2>
      {description && <p className="mb-5 mt-1 text-body-sm text-ink-600">{description}</p>}
      {!description && <div className="mb-5" />}
      {children}
    </section>
  );
}

export default async function SettingsPage() {
  const session = await auth();
  if (!can(session?.user, 'settings:manage')) {
    return (
      <>
        <PageHeader title="설정" />
        <EmptyState title="관리자 전용" description="설정은 관리자만 접근할 수 있습니다." />
      </>
    );
  }
  const mimes = await getSiteImageMimes();
  const imageKinds = {};
  for (const [k, m] of Object.entries(mimes)) imageKinds[k] = isVideoMime(m) ? 'video' : 'image';

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="사이트 설정"
        description="공개 사이트의 연락처·이미지와 알림 이메일을 관리합니다."
      />

      <Section title="연락처 · 기관 정보" description="주소·전화·이메일 등. 저장하면 사이트 전체(푸터·오시는 길·메인 등)에 반영되고, 주소는 지도에도 적용됩니다.">
        <ContactSettingsForm />
      </Section>

      <Section title="사이트 이미지" description="랜딩·메인·소개·사업 페이지의 대표 이미지를 교체합니다. 랜딩 히어로는 모션 GIF·영상(mp4·webm)도 넣을 수 있습니다.">
        <SiteImagesForm initialKinds={imageKinds} />
      </Section>

      <Section title="공지 배너(랜딩 최상단)" description="랜딩 상단 자동순환 배너·공지 롤러의 전환 간격, 그라디언트 톤, 설명 발췌 길이, 자동재생·롤러 표시를 조정합니다.">
        <NoticeHeroForm />
      </Section>

      <Section title="알림 이메일" description="문의가 접수되면 발송할 이메일 알림(발신 계정·수신자)을 관리합니다.">
        <MailSettingsForm />
      </Section>
    </div>
  );
}
