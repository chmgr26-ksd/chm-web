// 카드뉴스 '집수리교실' 실제 현장 사진 14장을 갤러리(DB)에 일괄 삽입하는 1회용 시드.
// 서버(Hostinger)에서 실행 가능하도록 자체완결형: 미리 렌더된 에셋(scripts/cardnews-seed-assets/)만
// 읽어 넣으므로 sharp/외부 원본 디렉토리 불필요. galleryImage(data=원본, thumb=썸네일)에 저장.
// - 원본: 최장변 ≤1200px JPEG q85, 썸네일: 700px 정사각(중앙 크롭) JPEG q80 (대시보드 업로드와 동일 규격)
// - 재실행 안전: 기존 '구즉동 집수리교실 ' 접두 항목을 먼저 지우고 다시 삽입(멱등).
// 사용(서버 앱 디렉토리에서): node scripts/seed-cardnews.js

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const ASSETS = path.resolve(__dirname, 'cardnews-seed-assets');

async function main() {
  const manifest = JSON.parse(fs.readFileSync(path.join(ASSETS, 'manifest.json'), 'utf8'));

  const removed = await prisma.galleryImage.deleteMany({
    where: { title: { startsWith: '구즉동 집수리교실 ' } },
  });
  if (removed.count > 0) console.log(`기존 카드뉴스 항목 ${removed.count}건 삭제 후 재삽입`);

  let ok = 0;
  for (const m of manifest) {
    const mainPath = path.join(ASSETS, m.main);
    const thumbPath = path.join(ASSETS, m.thumb);
    if (!fs.existsSync(mainPath) || !fs.existsSync(thumbPath)) {
      console.error(`✗ 에셋 없음: ${m.main}/${m.thumb}`);
      continue;
    }
    const data = fs.readFileSync(mainPath);
    const thumb = fs.readFileSync(thumbPath);
    await prisma.galleryImage.create({
      data: {
        title: m.title,
        mimeType: 'image/jpeg',
        size: data.length,
        data,
        thumb,
        createdAt: new Date(m.createdAt),
      },
    });
    ok += 1;
    console.log(`✓ ${m.title}  (main ${(data.length / 1024).toFixed(0)}KB, thumb ${(thumb.length / 1024).toFixed(0)}KB)`);
  }

  const total = await prisma.galleryImage.count();
  console.log(`\n완료: ${ok}/${manifest.length}장 삽입. 갤러리 총 ${total}장.`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => prisma.$disconnect());
