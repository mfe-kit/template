import { Hono } from 'hono';
import { getCats } from './cats.controller';

const catsRouter = new Hono();

catsRouter.get('/cats', getCats);

export default catsRouter;
