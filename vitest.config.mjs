import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url)).replace(/\/$/, '');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
  resolve: {
    // 앱과 동일한 '@/...' 경로 별칭을 테스트에서도 사용.
    alias: { '@': root },
  },
});
