import { describe, it, expect } from 'vitest';
import { CatImage } from '../../../src/frontend/snippets/cat-image';

describe('CatImage', () => {
  it('should show image', async () => {
    const result = CatImage('testUrl', false);
    expect(result).toMatchSnapshot();
  });
  it('should hide image', async () => {
    const result = CatImage('testUrl', true);
    expect(result).toMatchSnapshot();
  });
});
