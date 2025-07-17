import useTypeahead from '@/hooks/useTypehead';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

describe('useTypeahead', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should clear existing timeout before setting a new one', () => {
    const options = [
      { label: 'First option', value: 'first option' },
      { label: 'Second option', value: 'second option' },
    ];
    const getLabel = (item: (typeof options)[0]) => item.label;
    const getValue = (item: (typeof options)[0]) => item.value;
    const onMatch = vi.fn();

    const { result } = renderHook(() =>
      useTypeahead({ options, getLabel, getValue, onMatch, timeout: 500 })
    );

    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

    result.current.handleTypeahead('f');

    const firstTimeoutId = setTimeoutSpy.mock.results[0].value;

    result.current.handleTypeahead('p');

    expect(clearTimeoutSpy).toHaveBeenCalledWith(firstTimeoutId);

    expect(setTimeoutSpy).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(500);
  });
});
