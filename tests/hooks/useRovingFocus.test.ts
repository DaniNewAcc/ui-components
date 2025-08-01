import { useRovingFocus } from '@hooks/useRovingFocus';
import { renderHook } from '@testing-library/react';
import { act } from 'react';

const createMockElement = (canFocus = true): HTMLElement => {
  const el = document.createElement('button');
  el.disabled = !canFocus;
  el.focus = canFocus ? vi.fn() : (undefined as any);
  return el;
};

describe('useRovingFocus - fallback and navigation logic', () => {
  it('should do nothing if no focusable elements are registered', () => {
    const { result } = renderHook(() => useRovingFocus(undefined, false));

    act(() => {
      result.current.moveFocus('next');
    });

    expect(result.current.focusedIndex).toBeNull();
  });

  it('should fallback to first item when focusedIndex is not registered (currentIndex === -1)', () => {
    const { result } = renderHook(() => useRovingFocus('untracked', false));

    act(() => {
      result.current.setFocusRef({ index: 0, element: createMockElement() });
      result.current.setFocusRef({ index: 1, element: createMockElement() });
    });

    act(() => {
      result.current.moveFocus('next');
    });

    expect(result.current.focusedIndex).toBe(1);
  });

  it('should fallback to last item when moving previous and focusedIndex is not found', () => {
    const { result } = renderHook(() => useRovingFocus('missing', false));

    act(() => {
      result.current.setFocusRef({ index: 0, element: createMockElement() });
      result.current.setFocusRef({ index: 1, element: createMockElement() });
    });

    act(() => {
      result.current.moveFocus('previous');
    });

    expect(result.current.focusedIndex).toBe(0);
  });

  it('should skip element without .focus() and move to next valid', () => {
    const { result } = renderHook(() => useRovingFocus(undefined, false));

    const badEl = document.createElement('div');
    const goodEl = createMockElement(true);

    act(() => {
      result.current.setFocusRef({ index: 0, element: badEl });
      result.current.setFocusRef({ index: 1, element: goodEl });
    });

    act(() => {
      result.current.moveFocus('next');
    });

    expect(result.current.focusedIndex).toBe(1);
  });

  it('should stop moving if at end and loop is false', () => {
    const { result } = renderHook(() => useRovingFocus(1, false));

    act(() => {
      result.current.setFocusRef({ index: 0, element: createMockElement() });
      result.current.setFocusRef({ index: 1, element: createMockElement() });
    });

    act(() => {
      result.current.moveFocus('next');
    });

    expect(result.current.focusedIndex).toBe(1);
  });

  it('should wrap to start if at end and loop is true', () => {
    const { result } = renderHook(() => useRovingFocus(1, true));

    act(() => {
      result.current.setFocusRef({ index: 0, element: createMockElement() });
      result.current.setFocusRef({ index: 1, element: createMockElement() });
    });

    act(() => {
      result.current.moveFocus('next');
    });

    expect(result.current.focusedIndex).toBe(0);
  });

  it('should wrap to end if at start and moving previous with loop = true', () => {
    const { result } = renderHook(() => useRovingFocus(0, true));

    act(() => {
      result.current.setFocusRef({ index: 0, element: createMockElement() });
      result.current.setFocusRef({ index: 1, element: createMockElement() });
    });

    act(() => {
      result.current.moveFocus('previous');
    });

    expect(result.current.focusedIndex).toBe(1);
  });
});

describe('useRovingFocus - initialFocusedIndex variations', () => {
  it('should return null when initialFocusedIndex is undefined', () => {
    const { result } = renderHook(() => useRovingFocus());
    expect(result.current.focusedIndex).toBeNull();
  });

  it('should use value directly when initialFocusedIndex is a string', () => {
    const { result } = renderHook(() => useRovingFocus('menu-item-1'));
    expect(result.current.focusedIndex).toBe('menu-item-1');
  });

  it('should use value directly when initialFocusedIndex is a number', () => {
    const { result } = renderHook(() => useRovingFocus(2));
    expect(result.current.focusedIndex).toBe(2);
  });

  it('should use first element of array if array is passed', () => {
    const { result } = renderHook(() => useRovingFocus(['item-1', 'item-2']));
    expect(result.current.focusedIndex).toBe('item-1');
  });

  it('should return null if initialFocusedIndex is an empty array', () => {
    const { result } = renderHook(() => useRovingFocus([]));
    expect(result.current.focusedIndex).toBeNull();
  });

  it('should return null if initialFocusedIndex is null', () => {
    const { result } = renderHook(() => useRovingFocus(null));
    expect(result.current.focusedIndex).toBeNull();
  });
});
