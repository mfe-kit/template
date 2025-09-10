import { Hono } from 'hono';

import { getPrerender } from './core.controller';

const coreRouter = new Hono();

coreRouter.get('/health', (c) => c.text('OK'));
coreRouter.get('/prerender', getPrerender);

export default coreRouter;
