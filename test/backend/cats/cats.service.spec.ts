import { describe, expect, it, vi, beforeEach } from 'vitest';
import api from '../../../src/backend/cats/cats.service';

vi.mock('node:process', () => ({
  env: {
    VITE_CATS_SERVICE_URL: 'https://api.thecatapi.com/v1/images/search',
  },
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('api.getCats', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should successfully fetch cats and return JSON data', async () => {
    const mockCatData = [{ name: 'Whiskers' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockCatData),
    });

    const result = await api.getCats();
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.thecatapi.com/v1/images/search',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    expect(result).toEqual(mockCatData);
  });

  it('should throw an error if the fetch response is not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });
    await expect(api.getCats()).rejects.toThrow(
      'Failed to fetch cats: 500 Internal Server Error',
    );
  });
});
