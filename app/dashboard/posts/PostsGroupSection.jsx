import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import {
  PageHeader, Badge, Button, EmptyState,
  Table, THead, TBody, TR, TH, TD,
} from '@chm/design-system';
import { POST_CATEGORY, POST_GROUPS } from '@/lib/posts';
import PostActions from './PostActions';
import Pager from '../Pager';

const PAGE_SIZE = 20;

function fmtDate(d) {
  const dt = new Date(d);
  const p = (n) => String(n).padStart(2, '0');
  return `${dt.getFullYear()}.${p(dt.getMonth() + 1)}.${p(dt.getDate())}`;
}

// 소식 그룹(공지사항 / 교육 활동 소식) 관리 목록 — 카테고리로 필터.
export default async function PostsGroupSection({ groupKey, page }) {
  const group = POST_GROUPS[groupKey];
  const where = { category: { in: group.cats } };
  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const newHref = `/dashboard/posts/new?group=${groupKey}`;

  return (
    <>
      <PageHeader
        title={`${group.label} 관리`}
        description={`공개 사이트의 '${group.label}' 페이지에 노출되는 글을 작성·수정·삭제합니다.`}
        actions={<Button as={Link} href={newHref} tone="primary" size="sm">새 글 작성</Button>}
      />
      {posts.length === 0 ? (
        <EmptyState
          title={page > 1 ? '이 페이지에는 글이 없습니다' : '작성된 글이 없습니다'}
          description={page > 1 ? '이전 페이지를 확인해 주세요.' : `새 글을 작성하면 공개 '${group.label}' 페이지에 노출됩니다.`}
          action={<Button as={Link} href={page > 1 ? group.href : newHref} tone="primary" size="sm">{page > 1 ? '처음으로' : '새 글 작성'}</Button>}
        />
      ) : (
        <>
          <div className="overflow-x-auto rounded-chm-lg border border-border">
            <Table>
              <THead>
                <TR><TH>카테고리</TH><TH>제목</TH><TH>상태</TH><TH>작성일</TH><TH>작성자</TH><TH> </TH></TR>
              </THead>
              <TBody>
                {posts.map((p) => (
                  <TR key={p.id}>
                    <TD><Badge value={POST_CATEGORY[p.category]?.value || 'trust'}>{POST_CATEGORY[p.category]?.label || p.category}</Badge></TD>
                    <TD className="font-semibold text-ink-800">{p.title}</TD>
                    <TD>{p.published ? <Badge value="cooperation" dot>공개</Badge> : <Badge value="community" dot>비공개</Badge>}</TD>
                    <TD>{fmtDate(p.createdAt)}</TD>
                    <TD>{p.authorName || '—'}</TD>
                    <TD><PostActions id={p.id} published={p.published} /></TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
          <Pager page={page} pageCount={pageCount} basePath={group.href} />
        </>
      )}
    </>
  );
}
