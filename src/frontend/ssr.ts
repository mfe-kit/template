import type { CatResponse } from '../types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Instantiable<T = any> = { new (...args: any[]): T };

const useSpreadAttributes = (props: Record<string, string[]>): string => {
  let result = '';
  for (const key in props) {
    result += `${key}=${props[key]} `;
  }
  return result;
};

export const renderSSR =
  (Target: Instantiable, namespace: string) =>
  (props: Record<string, string[]>, data: CatResponse) => {
    const component = new Target(props, data);
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
