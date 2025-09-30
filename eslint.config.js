import eslintConfig from '@mfe-kit/dev-tools/eslint.config.js';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  eslintConfig,
  {
    files: ['*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
      },
    },
  },
]);
