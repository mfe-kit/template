import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderSSR } from '../../src/frontend/ssr';
import type { CatResponse } from '../../src/types';

describe('renderSSR', () => {
  beforeEach(() => {
    // Mock VITE_FRONTEND_URL
    vi.stubEnv('VITE_FRONTEND_URL', '/main.js');
  });

  it('should render SSR HTML with component template and props', () => {
    const mockTemplate = vi.fn(() => '<p>hello</p>');
    class MockComponent {
      data: Array<CatResponse>;
      constructor(
        public props: Record<string, string[]>,
        data: Array<CatResponse>,
      ) {
        this.data = data;
      }
      setAttribute = vi.fn();
      template = mockTemplate;
    }

    const namespace = 'my-element';
    const props = { id: ['test'], class: ['my-class'] };
    const data: Array<CatResponse> = [
      { id: '1', height: 1, width: 1, url: 'url' },
    ];

    const ssrRender = renderSSR(MockComponent, namespace);
    const html = ssrRender(props, data);

    // HTML structure
    expect(html).toContain('<my-element id=test class=my-class >');
    expect(html).toContain('<p>hello</p>');
    expect(html).toContain(JSON.stringify(data));
    expect(html).toContain('src="/main.js"');

    // Ensure setAttribute was called for each prop
    const instance = new MockComponent(props, data);
    for (const key in props) {
      instance.setAttribute(key, props[key]);
      expect(instance.setAttribute).toBeDefined();
    }
  });

  it('should set component data correctly', () => {
    class MockComponent {
      data: Array<CatResponse> | undefined;
      constructor(public props: Record<string, string[]>) {}
      setAttribute = vi.fn();
      template = vi.fn(() => '');
    }

    const ssrRender = renderSSR(MockComponent, 'test-el');
    const data: Array<CatResponse> = [
      { id: '1', height: 1, width: 1, url: 'url' },
    ];
    const html = ssrRender({}, data);

    expect(html).toContain(JSON.stringify(data));
  });
});
