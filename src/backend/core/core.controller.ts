import type { Context } from 'hono';

export async function getPrerender(c: Context): Promise<void | Response> {
  const { prerender } = await c.req.getFrontendModule();
  const result = prerender();
  return c.html(result);
}
