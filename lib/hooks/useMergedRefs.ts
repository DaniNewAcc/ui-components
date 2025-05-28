/**
 * Custom hook to merge multiple refs into a single callback ref.
 *
 * This is useful when you need to assign multiple refs to the same DOM element,
 * such as combining an internal ref with a forwarded ref.
 *
 * It supports both function refs and mutable object refs.
 *
 * Usage example:
 * const mergedRef = useMergedRefs(forwardedRef, internalRef);
 * <div ref={mergedRef} />
 *
 * @param refs - An array of refs (function refs or mutable refs) to merge
 * @returns A callback ref that updates all provided refs with the given element
 */

import { useCallback } from 'react';

export function useMergedRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return useCallback(
    (element: T | null) => {
      for (const ref of refs) {
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref != null && typeof ref === 'object') {
          (ref as React.MutableRefObject<T | null>).current = element;
        }
      }
    },
    [refs]
  );
}
