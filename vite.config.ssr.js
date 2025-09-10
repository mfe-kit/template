import { defineConfig } from 'vite';
import baseConfig from '@mfe-kit/dev-tools/vite.config.ssr.js';

export default defineConfig(({ mode }) => baseConfig(mode));
