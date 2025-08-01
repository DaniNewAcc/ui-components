/**
 * Custom hook for autofocusing on the first focusable elements
 *
 * This is useful for accessibility in modal dialogs, popovers, and similar components,
 * where initial keyboard focus should be managed upon mount or visibility change.
 *
 * @param shouldFocus - If true, attempts to focus the first focusable element inside the container.
 * @param containerRef - A ref to the container that holds focusable elements.
 */

import { getFocusableElements } from '@utils/helpers';
import { useEffect } from 'react';

export function useAutoFocus(shouldFocus: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const container = containerRef.current;
    if (!shouldFocus || !container) return;

    const frame = requestAnimationFrame(() => {
      const focusables = getFocusableElements(container);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        container.focus();
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [shouldFocus, containerRef]);
}
