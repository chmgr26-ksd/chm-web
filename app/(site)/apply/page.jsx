import { getContact } from '@/lib/siteContent';
import ApplyForm from './ApplyForm';

export const metadata = { title: '참여 신청', description: '집수리 신청·교육 참가·자원봉사 협력 제안을 받습니다.' };

// 연락처(전화 신청 안내)를 DB 설정에서 읽어 클라이언트 폼에 전달.
export default async function ApplyPage() {
  const contact = await getContact();
  return <ApplyForm contact={contact} />;
}
