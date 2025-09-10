import { defineConfig } from 'vite';
import baseConfig from '@mfe-kit/dev-tools/vite.config.frontent.js';

export default defineConfig(({ mode }) => baseConfig(mode));
