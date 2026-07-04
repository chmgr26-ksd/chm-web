/** @type {import('next').NextConfig} */
const nextConfig = {
  // 디자인 시스템은 미컴파일 JSX 소스이므로 Next가 트랜스파일하게 함
  transpilePackages: ['@chm/design-system'],
  reactStrictMode: true,
};

module.exports = nextConfig;
