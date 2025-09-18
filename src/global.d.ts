/// <reference types="vite/client" />
import 'hono';
import type { CatResponse, SSRProps } from './types';

interface ImportMetaEnv {
  readonly VITE_APP_VERSION: string;
  readonly VITE_BACKEND_URL: string;
  readonly VITE_FRONTEND_URL: string;
  readonly VITE_ENV: string;
  readonly VITE_MFE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.scss?inline' {
  const content: string;
  export default content;
}

type FrontendModule = Record<string, () => string> & {
  ssr: (props: SSRProps, data: Array<CatResponse>) => string;
} & { prerender: () => string };

declare module 'hono' {
  interface HonoRequest {
    getFrontendModule: () => Promise<FrontendModule>;
  }
}
