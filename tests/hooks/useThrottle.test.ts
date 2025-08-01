import { useThrottle } from '@hooks/useThrottle';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

describe('useThrottle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should schedule a delayed callback when called rapidly', () => {
    const callback = vi.fn();
    const delay = 100;
    const { result } = renderHook(() => useThrottle(callback, delay));

    result.current('first');
    expect(callback).toHaveBeenCalledTimes(1);

    result.current('second');
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(delay - 10);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(10);
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith('second');
  });
});
