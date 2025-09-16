import { Hono } from 'hono';
import { getSSR } from './ssr.controller';

const ssrRouter = new Hono();

ssrRouter.get('/ssr', getSSR);

export default ssrRouter;
