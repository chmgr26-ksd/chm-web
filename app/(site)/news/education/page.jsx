import NewsList from '@/components/site/NewsList';

export const metadata = { title: '교육 활동 소식', description: '집수리 교실·행사·모집 등 교육 활동 소식입니다.' };

export default async function EducationNewsPage(props) {
  const sp = await props.searchParams;
  const page = Math.max(1, parseInt(sp?.page ?? '1', 10) || 1);
  return (
    <NewsList
      eyebrow="Education"
      title="교육 활동 소식"
      description="집수리 교실·행사·모집 등 교육 활동 소식입니다."
      categories={['EVENT', 'RECRUIT']}
      basePath="/news/education"
      page={page}
    />
  );
}
