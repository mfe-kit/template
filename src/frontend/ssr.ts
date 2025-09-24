import { useSpreadAttributes, type Instantiable } from '@mfe-kit/core';
import type { CatResponse } from '../types';

export const renderSSR =
  (Target: Instantiable, namespace: string) =>
  (props: Record<string, string[]>, data: Array<CatResponse>) => {
    const component = new Target();
    component.data = data;
    for (const key in props) {
      component.setAttribute(key, props[key]);
    }
    const html = component.template();
    return `
      <${namespace} ${useSpreadAttributes(props)}>
        <template shadowrootmode="open">
          ${html}
        </template
      </${namespace}>
      <script type="application/json" data-ssr>
        ${JSON.stringify(data)}
      </script>
      <script type="module" src="${import.meta.env.VITE_FRONTEND_URL}"></script>
    `;
  };
