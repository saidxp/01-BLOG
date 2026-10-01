import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  const pipe = new RelativeTimePipe();
  const now = new Date('2026-09-27T12:00:00Z').getTime();

  it('formats recent dates relative to the supplied clock', () => {
    expect(pipe.transform(new Date(now - 2 * 60_000), now)).toBe('2 minutes ago');
  });

  it('handles invalid values safely', () => {
    expect(pipe.transform('not-a-date', now)).toBe('Unknown time');
  });
});
