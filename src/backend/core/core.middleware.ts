import type { Context, Next } from 'hono';
import { createServer as createViteServer } from 'vite';

const vite = await createViteServer({
  server: { middlewareMode: true },
  mode: 'development',
  configFile: false,
  plugins: [],
});

const devServerFrontendModuleMiddleware = async (
  c: Context,
  next: Next,
): Promise<void> => {
  try {
    c.req.getFrontendModule = () => vite.ssrLoadModule('src/frontend/index.ts');
  } catch (e) {
    vite.ssrFixStacktrace(e as Error);
  }

  await next();
};

const prodServerFrontendModuleMiddleware = async (
  c: Context,
  next: Next,
): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  c.req.getFrontendModule = () => import('./frontend.es.mjs');
  await next();
};

export const frontendModuleMiddleware =
  process.env.VITE_ENV === 'development'
    ? devServerFrontendModuleMiddleware
    : prodServerFrontendModuleMiddleware;
