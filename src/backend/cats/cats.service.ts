import type { CatResponse } from '../../types';

const CATS_URL = process.env.VITE_CATS_SERVICE_URL || '';

export default {
  getCats,
};

async function getCats(): Promise<CatResponse> {
  const res = await fetch(CATS_URL, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch cats: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
