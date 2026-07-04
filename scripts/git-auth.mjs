// preinstall 훅 — private 디자인 시스템 의존성(chm-group)을 clone하기 위한 GitHub 인증 구성.
//
// Hostinger 빌드처럼 SSH 키가 없는 환경에서는 GH_TOKEN 환경변수를 주면,
// git이 https://github.com 요청에 토큰을 붙여 private repo를 clone합니다.
// 로컬 개발(토큰 없음)에서는 아무 것도 하지 않으므로, 개발자는 자신의 SSH 설정을 그대로 씁니다.
import { execSync } from 'node:child_process';

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
if (!token) {
  // 토큰 없음 → 무동작 (로컬은 SSH 등 기존 git 설정 사용)
  process.exit(0);
}
try {
  execSync(
    `git config --global url."https://${token}@github.com/".insteadOf "https://github.com/"`,
    { stdio: 'ignore' },
  );
  console.log('git-auth: GH_TOKEN으로 GitHub HTTPS 인증을 구성했습니다.');
} catch (e) {
  console.warn('git-auth: git config 설정 실패 —', e.message);
}
