import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { notifyAdmins } from '@/lib/mailer';
import { rateLimitByIp } from '@/lib/rateLimit';
import { sanitizeHtml, isBlankHtml, htmlToText } from '@/lib/sanitizeHtml';

const TITLE_MAX = 191;
const NAME_MAX = 100;
const CONTACT_MAX = 191;
const BODY_MAX = 20000;

// QNA 문의 접수(공개 엔드포인트) — 방문자가 질문을 남긴다. 관리자 답변은 대시보드에서.
export async function POST(req) {
  // 스팸 방지 — IP당 분당 5회.
  const rl = rateLimitByIp(req, 'qna', { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ error: '요청이 많습니다. 잠시 후 다시 시도해 주세요.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 });

  const authorName = (body.authorName || '').toString().trim();
  const contact = (body.contact || '').toString().trim() || null;
  const title = (body.title || '').toString().trim();
  const rawBody = (body.body || '').toString();

  if (!authorName || !title || isBlankHtml(rawBody)) {
    return NextResponse.json({ error: '이름·제목·내용을 입력해 주세요.' }, { status: 400 });
  }
  if (authorName.length > NAME_MAX || title.length > TITLE_MAX || (contact && contact.length > CONTACT_MAX)) {
    return NextResponse.json({ error: '입력이 너무 깁니다.' }, { status: 400 });
  }
  const content = sanitizeHtml(rawBody, { maxLen: BODY_MAX });

  const session = await auth();
  const userId = session?.user?.id || null;
  await prisma.qnaPost.create({ data: { authorName, contact, title, body: content, userId } });

  // 관리자 알림 — fire-and-forget.
  notifyAdmins({
    subject: `[CHM] 새 QNA 문의 — ${authorName}`,
    text: `새 QNA 문의가 접수되었습니다.\n\n제목: ${title}\n작성자: ${authorName}\n연락처: ${contact || '-'}\n\n내용:\n${htmlToText(content)}\n\n대시보드 > QNA 관리에서 답변해 주세요.`,
  }).catch((e) => console.error('[qna] 알림 메일 실패:', e?.message || e));

  return NextResponse.json({ ok: true });
}
