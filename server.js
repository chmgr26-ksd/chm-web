// 커스텀 Next.js 프로덕션 서버 — Hostinger LiteSpeed(LSAPI) 환경 호환용.
// 호스팅이 지정하는 process.env.PORT 에 단일 프로세스로 명시 바인딩한다.
// (기본 `next start`가 LSAPI에서 포트/프록시가 어긋나 503이 나던 문제를 회피)
const { createServer } = require('http');
const next = require('next');

const port = parseInt(process.env.PORT || '3000', 10);
const hostname = process.env.HOSTNAME || '0.0.0.0';

const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = createServer((req, res) => {
      handle(req, res).catch((err) => {
        console.error('[server] request error:', err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });
    });
    server.on('error', (err) => console.error('[server] error:', err));
    server.listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      // DB 커넥션 워밍업 — 첫 대시보드 요청의 콜드 쿼리 지연으로 인한
      // 스트림 끊김(빈 화면 조각) 방지. 실패해도 무시.
      setTimeout(() => {
        fetch(`http://127.0.0.1:${port}/api/health`).catch(() => {});
      }, 800);
    });
  })
  .catch((err) => {
    console.error('[server] failed to start:', err);
    process.exit(1);
  });
