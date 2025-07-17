import useComponentIds from '@/hooks/useComponentIds';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('useComponentIds', () => {
  const baseName = 'modal';
  const parts = ['title', 'description'];

  it('should generate IDs for all parts with no overrides', () => {
    const { result } = renderHook(() => useComponentIds(baseName, parts));
    const ids = result.current;

    expect(ids.title).toMatch(/^modal-.+-title$/);
    expect(ids.description).toMatch(/^modal-.+-description$/);
    expect(ids.title).not.toBe(ids.description);
  });

  it('should use overrides when provided for a part', () => {
    const overrides = { title: 'custom-title-id' };
    const { result } = renderHook(() => useComponentIds(baseName, parts, overrides));
    const ids = result.current;

    expect(ids.title).toBe('custom-title-id');
    expect(ids.description).toMatch(/^modal-.+-description$/);
  });

  it('should use all overrides if provided for all parts', () => {
    const overrides = {
      title: 'override-title',
      description: 'override-description',
    };
    const { result } = renderHook(() => useComponentIds(baseName, parts, overrides));
    const ids = result.current;

    expect(ids.title).toBe('override-title');
    expect(ids.description).toBe('override-description');
  });

  it('should return stable ids across rerenders', () => {
    const { result, rerender } = renderHook(() => useComponentIds(baseName, parts));
    const initialIds = result.current;

    rerender();
    const rerenderedIds = result.current;

    expect(initialIds).toEqual(rerenderedIds);
  });
});
