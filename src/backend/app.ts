import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { JSDOM } from 'jsdom';

import { frontendModuleMiddleware } from './core/core.middleware';

import catsRouter from './cats/cats.router';
import coreRouter from './core/core.router';

const jsdom = new JSDOM();
global.document = jsdom.window.document;
global.HTMLElement = jsdom.window.HTMLElement;
global.customElements = jsdom.window.customElements;
global.CustomEvent = jsdom.window.CustomEvent;

const app = new Hono();

app.use('/api/*', cors());
app.use(frontendModuleMiddleware);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.route('/api', coreRouter);
app.route('/api', catsRouter);

export default app;
