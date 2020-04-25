import { noop } from '../../../lib/client/app/utils/constants';

describe('Constants module', () => {
  it('should have no-op function defined and does not throw', () => {
    expect(noop).not.toThrow();
  });
});
