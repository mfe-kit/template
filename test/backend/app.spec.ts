import { describe, it, expect, vi } from 'vitest';

vi.mock('@mfe-kit/core/backend', () => ({
  coreRouter: { routes: [] },
  ssrMiddleware: vi.fn((c, next) => next()),
}));

vi.mock('hono/cors', () => ({
  cors: vi.fn(() => vi.fn((c, next) => next())),
}));

import { Hono } from 'hono';
import app from '../../src/backend/app';
import { coreRouter } from '@mfe-kit/core/backend';
import { cors } from 'hono/cors';
import catsRouter from '../../src/backend/cats/cats.router';
import ssrRouter from '../../src/backend/ssr/ssr.router';

describe('Hono app setup', () => {
  it('should create a Hono app instance', () => {
    expect(app).toBeDefined();
    expect(app).toBeInstanceOf(Hono);
  });

  it('should use CORS middleware for /api/*', () => {
    expect(cors).toHaveBeenCalled();
  });

  it('should register all routers', () => {
    expect(coreRouter).toBeDefined();
    expect(catsRouter).toBeDefined();
    expect(ssrRouter).toBeDefined();
  });

  it('should handle errors and return 500 JSON response', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    app.get('/test-error', () => {
      throw new Error('Test error');
    });
    const req = new Request('http://localhost/test-error');
    const res = await app.fetch(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json).toEqual({ error: 'Internal Server Error' });
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toBe('Unhandled error:');
    expect(consoleSpy.mock.calls[0][1]).toBeInstanceOf(Error);
    expect(consoleSpy.mock.calls[0][1].message).toBe('Test error');

    consoleSpy.mockRestore();
  });
});
