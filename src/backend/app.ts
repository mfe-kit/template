import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { coreRouter, ssrMiddleware } from '@mfe-kit/core/backend';

import catsRouter from './cats/cats.router';
import ssrRouter from './ssr/ssr.router';

const app = new Hono();

app.use('/api/*', cors());
app.use(ssrMiddleware);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.route('/api', coreRouter);
app.route('/api', catsRouter);
app.route('/api', ssrRouter);

export default app;
