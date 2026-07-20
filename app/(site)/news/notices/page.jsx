import NewsList from '@/components/site/NewsList';

export const metadata = { title: '공지사항', description: 'CHM Group의 공지·안내 사항입니다.' };

export default async function NoticesPage(props) {
  const sp = await props.searchParams;
  const page = Math.max(1, parseInt(sp?.page ?? '1', 10) || 1);
  return (
    <NewsList
      eyebrow="Notice"
      title="공지사항"
      description="CHM Group의 공지·안내 사항입니다."
      categories={['NOTICE', 'CAMPAIGN']}
      basePath="/news/notices"
      page={page}
    />
  );
}
