import useReduceMotion, { __setReduceMotionForTests } from '@/hooks/useReduceMotion';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('useReduceMotion', () => {
  let originalMatchMedia: typeof window.matchMedia;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    __setReduceMotionForTests(undefined);
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  const setupMatchMedia = (matches: boolean) => {
    const listeners: ((e: MediaQueryListEvent) => void)[] = [];

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      addEventListener: (event: string, cb: (e: MediaQueryListEvent) => void) => {
        if (event === 'change') listeners.push(cb);
      },
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
    }));

    return listeners;
  };

  it('should return the override value from __setReduceMotionForTests', () => {
    __setReduceMotionForTests(true);
    const { result } = renderHook(() => useReduceMotion());
    expect(result.current).toBe(true);

    __setReduceMotionForTests(false);
    const { result: result2 } = renderHook(() => useReduceMotion());
    expect(result2.current).toBe(false);
  });

  it('should return matchMedia value when override is not set', () => {
    setupMatchMedia(true);
    const { result } = renderHook(() => useReduceMotion());
    expect(result.current).toBe(true);

    setupMatchMedia(false);
    const { result: result2 } = renderHook(() => useReduceMotion());
    expect(result2.current).toBe(false);
  });

  it('should return false when window.matchMedia is not defined', () => {
    const originalMatchMedia = window.matchMedia;
    delete (window as any).matchMedia;

    const { result } = renderHook(() => useReduceMotion());
    expect(result.current).toBe(false);

    window.matchMedia = originalMatchMedia;
  });

  it('should respond to matchMedia change event (handleChange)', () => {
    const listeners = setupMatchMedia(false);
    const { result } = renderHook(() => useReduceMotion());

    expect(result.current).toBe(false);

    act(() => {
      const event = { matches: true } as MediaQueryListEvent;
      listeners.forEach(cb => cb(event));
    });

    expect(result.current).toBe(true);
  });
});
