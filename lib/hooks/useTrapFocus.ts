/**
 * Custom hook to trap keyboard focus within a specific container element.
 *
 * The hook ensures that keyboard navigation (Tab/Shift+Tab) stays within a defined container.
 * Used mainly for modals, dialogs, or popovers to prevent focus from escaping the component.
 *
 * Usage:
 * - Pass a `containerRef` that points to the element you want to trap focus inside.
 * - Optionally set `loop` to `false` to disable looping focus; defaults to `true`.
 * - The hook returns a `moveFocus` function for manually moving focus (e.g., when handling arrow keys).
 *
 * Behavior:
 * - When the component mounts, focus is automatically moved to the first focusable element inside the container.
 * - When the component unmounts, focus is returned to the element that was previously focused.
 */

import { getFocusableElements } from '@/utils/helpers';
import { MutableRefObject, useCallback, useEffect } from 'react';

type TrapFocusProps = {
  containerRef: MutableRefObject<HTMLElement | null>;
  loop: boolean;
};

const useTrapFocus = ({ containerRef, loop = true }: TrapFocusProps) => {
  const moveFocus = useCallback(
    (direction: 'next' | 'previous') => {
      const container = containerRef.current;
      if (!container) return;

      const focusables = getFocusableElements(container);
      if (focusables.length === 0) return;

      const activeElement = document.activeElement;
      let currentIndex = focusables.indexOf(activeElement as HTMLElement);
      if (currentIndex === -1) {
        currentIndex = direction === 'next' ? -1 : 0;
      }

      let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex >= focusables.length) {
        nextIndex = loop ? 0 : focusables.length - 1;
      } else if (nextIndex < 0) {
        nextIndex = loop ? focusables.length - 1 : 0;
      }

      const nextElement = focusables[nextIndex];
      if (nextElement) {
        nextElement.focus();
      }
    },
    [containerRef, loop]
  );

  useEffect(() => {
    const prevFocusedElement = document.activeElement as HTMLElement;
    const container = containerRef.current;
    if (!container) return;

    const focusables = getFocusableElements(container);
    if (focusables.length > 0) {
      focusables[0].focus();
    }

    return () => {
      if (prevFocusedElement && document.contains(prevFocusedElement)) {
        prevFocusedElement.focus();
      }
    };
  }, [containerRef, getFocusableElements]);

  return {
    moveFocus,
  };
};
export default useTrapFocus;
