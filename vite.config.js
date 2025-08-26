import { defineConfig, loadEnv } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import playgroundServ from '@mfe-kit/dev-tools';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, 'src', '');
  const rootConfig = 'src';

  const cssConfig = {
    preprocessorOptions: {
      scss: {
        additionalData: `
          $namespace: '${env.VITE_MFE_NAME}';
        `,
      },
    },
  };

  const testConfig = {
    globals: true,
    environment: 'jsdom',
    include: ['../test/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: '../coverage',
      all: true,
      exclude: ['**/*.d.ts', 'test/**', '**/node_modules/**'],
    },
  };

  return {
    root: rootConfig,
    cacheDir: '../node_modules/.vite',
    server: {
      port: 7000,
    },
    css: cssConfig,
    test: testConfig,
    build: {
      outDir: '../dist/frontend',
      emptyOutDir: true,
      target: 'esnext',
      lib: {
        name: 'frontend',
        entry: 'frontend/index.ts',
        formats: ['iife'],
        fileName: () => 'index.js',
      },
    },
    plugins: [
      playgroundServ(rootConfig),
      viteStaticCopy({
        targets: [
          {
            src: ['manifest.yaml'],
            dest: './',
            transform: (contents) =>
              contents
                .toString()
                .replace(/__FRONTEND__/g, env.VITE_FRONTEND_URL)
                .replace(/__BACKEND__/g, env.VITE_BACKEND_URL),
          },
        ],
      }),
    ],
  };
});
