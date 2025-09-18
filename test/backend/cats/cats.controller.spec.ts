import { describe, it, expect, vi } from 'vitest';
import { getCats } from '../../../src/backend/cats/cats.controller';
import catsService from '../../../src/backend/cats/cats.service';

vi.mock('../../../src/backend/cats/cats.service', () => ({
  default: {
    getCats: vi.fn(),
  },
}));

const mockedCatsService = catsService as { getCats: ReturnType<typeof vi.fn> };

describe('getCats', () => {
  it('should return cats data as JSON', async () => {
    const mockData = [{ id: 1, name: 'Whiskers' }];
    mockedCatsService.getCats.mockResolvedValue(mockData);

    const jsonFn = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = { json: jsonFn } as any;

    await getCats(c);

    expect(jsonFn).toHaveBeenCalledWith(mockData);
  });

  it('should handle error and not throw', async () => {
    mockedCatsService.getCats.mockRejectedValue(new Error('fail'));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const c = { json: vi.fn() } as any;

    await expect(getCats(c)).resolves.toBeUndefined();
  });
});
