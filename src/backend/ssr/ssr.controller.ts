import type { Context } from 'hono';
import catsService from '../cats/cats.service';

export async function getSSR(c: Context): Promise<void | Response> {
  try {
    const { ssr } = await c.req.getFrontendModule();
    const data = await catsService.getCats();
    const result = ssr(c.req.queries(), data);
    return c.html(result);
  } catch {
    console.error('Cant retrieve any cat');
  }
}
