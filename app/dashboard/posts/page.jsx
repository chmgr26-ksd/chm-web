import { redirect } from 'next/navigation';

// 소식 관리는 '공지사항 / 교육 활동 소식'으로 분리됨 — 기본 진입은 공지사항으로.
export default function PostsAdminIndex() {
  redirect('/dashboard/posts/notices');
}
