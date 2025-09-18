import { describe, it, expect } from 'vitest';
import { Spinner } from '../../../src/frontend/snippets/spinner';

describe('Spinner', () => {
  it('should hide spinner', async () => {
    const result = Spinner(false);
    expect(result).toMatchSnapshot();
  });
  it('should show spinner', async () => {
    const result = Spinner(true);
    expect(result).toMatchSnapshot();
  });
});
