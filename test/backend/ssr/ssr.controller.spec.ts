import { describe, it, expect, vi } from 'vitest';
import { getSSR } from '../../../src/backend/ssr/ssr.controller';
import catsService from '../../../src/backend/cats/cats.service';

vi.mock('../../../src/backend/cats/cats.service', () => ({
  default: {
    getCats: vi.fn(),
  },
}));

const mockedCatsService = catsService as unknown as {
  getCats: ReturnType<typeof vi.fn>;
};

describe('getSSR', () => {
  it('should render SSR HTML with cats data', async () => {
    const mockData = [{ id: 1, name: 'Mittens' }];
    mockedCatsService.getCats.mockResolvedValue(mockData);

    const ssrFn = vi.fn().mockReturnValue('<div>SSR content</div>');
    const queriesFn = vi.fn().mockReturnValue({ filter: 'all' });
    const htmlFn = vi.fn();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = {
      req: {
        getFrontendModule: vi.fn().mockResolvedValue({ ssr: ssrFn }),
        queries: queriesFn,
      },
      html: htmlFn,
    };

    await getSSR(c);

    expect(mockedCatsService.getCats).toHaveBeenCalled();
    expect(ssrFn).toHaveBeenCalledWith({ filter: 'all' }, mockData);
    expect(htmlFn).toHaveBeenCalledWith('<div>SSR content</div>');
  });

  it('should handle error and not throw', async () => {
    mockedCatsService.getCats.mockRejectedValue(new Error('fail'));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c: any = {
      req: {
        getFrontendModule: vi.fn(),
        queries: vi.fn(),
      },
      html: vi.fn(),
    };

    await expect(getSSR(c)).resolves.toBeUndefined();
  });
});
