import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { coreRouter, ssrMiddleware } from '@mfe-kit/core/backend';

import catsRouter from './cats/cats.router';

const app = new Hono();

app.use('/api/*', cors());
app.use(ssrMiddleware);

app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal Server Error' }, 500);
});

app.route('/api', coreRouter);
app.route('/api', catsRouter);

export default app;
