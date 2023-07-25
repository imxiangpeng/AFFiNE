import path, { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const pluginOutputDir = resolve(rootDir, './apps/electron/dist/plugins');

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      'next/router': 'next-router-mock',
      'next/config': resolve(rootDir, './scripts/vitest/next-config-mock.ts'),
      // prevent tests using two different sources of yjs
      yjs: path.resolve(__dirname, 'node_modules/yjs'),
    },
  },
  define: {
    'process.env.PLUGIN_DIR': JSON.stringify(pluginOutputDir),
  },
  test: {
    setupFiles: [
      resolve(rootDir, './scripts/setup/lit.ts'),
      resolve(rootDir, './scripts/setup/i18n.ts'),
      resolve(rootDir, './scripts/setup/search.ts'),
      resolve(rootDir, './scripts/setup/lottie-web.ts'),
      resolve(rootDir, './scripts/setup/global.ts'),
    ],
    include: [
      'packages/**/*.spec.ts',
      'packages/**/*.spec.tsx',
      'apps/web/**/*.spec.ts',
      'apps/web/**/*.spec.tsx',
      'tests/unit/**/*.spec.ts',
      'tests/unit/**/*.spec.tsx',
    ],
    exclude: ['**/node_modules', '**/dist', '**/build', '**/out'],
    testTimeout: 5000,
    threads: !process.env.NATIVE_TEST,
    coverage: {
      provider: 'istanbul', // or 'c8'
      reporter: ['lcov'],
      reportsDirectory: '.coverage/store',
    },
  },
});
