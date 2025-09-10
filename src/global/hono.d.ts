import 'hono';

declare module 'hono' {
  interface HonoRequest {
    getFrontendModule: () => Promise<Record<string, () => string>>;
  }
}
