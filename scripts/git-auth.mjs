// preinstall 훅 — private 디자인 시스템 의존성(chm-group)을 clone하기 위한 GitHub 인증 구성.
//
// Hostinger 빌드처럼 SSH 키가 없는 환경에서 GH_TOKEN 환경변수를 주면,
// git이 github.com 접근을 "https + 토큰"으로 재작성해 private repo를 clone합니다.
//
// 중요: npm은 GitHub git 의존성을 내부적으로 여러 형태(https, ssh://, scp형)로 시도합니다.
// 그래서 세 가지 프리픽스를 모두 토큰 https로 재작성해야 SSH로 새어나가지 않습니다.
//
// 로컬 개발(토큰 없음)에서는 아무 것도 하지 않으므로 개발자의 기존 SSH 설정을 그대로 씁니다.
import { execSync } from 'node:child_process';

const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || '';
if (!token) {
  process.exit(0); // 토큰 없음 → 무동작
}

const target = `https://${token}@github.com/`;
const prefixes = [
  'https://github.com/',
  'ssh://git@github.com/',
  'git@github.com:',
];

try {
  for (const p of prefixes) {
    execSync(`git config --global --add url."${target}".insteadOf "${p}"`, { stdio: 'ignore' });
  }
  console.log('git-auth: GH_TOKEN으로 GitHub(https/ssh) 접근을 토큰 인증으로 구성했습니다.');
} catch (e) {
  console.warn('git-auth: git config 설정 실패 —', e.message);
}
