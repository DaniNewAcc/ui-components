/**
 * Custom hook to manage roving focus among a set of elements.
 *
 * Overview:
 * - Maintains a "focusedIndex" and moves focus among registered elements.
 * - Supports both string and number keys (either a single value or an array).
 * - Useful in menus, tab lists, or custom keyboard navigation components.
 *
 * Focus Movement Methods:
 * - `moveFocus(direction: 'next' | 'previous')`: Moves focus to the next or previous focusable element.
 * - `moveToStart()`: Moves focus to the first focusable element.
 * - `moveToEnd()`: Moves focus to the last focusable element.
 *
 * Ref Registration:
 * - Use `setFocusRef({ index, element })` to register elements by their index.
 * - The hook maintains an internal map of registered elements.
 *
 * Focus Logic:
 * - Disabled or hidden elements are skipped (checks `disabled`, `aria-disabled`, and visibility).
 * - If the `initialFocusedIndex` is valid and the corresponding element is focusable, it will be focused on mount.
 *
 * Usage:
 *
 * const {
 *   focusedIndex,
 *   setFocusedIndex,
 *   moveFocus,
 *   moveToStart,
 *   moveToEnd,
 *   setFocusRef
 * } = useRovingFocus(initialFocusedIndex);
 *
 * - `initialFocusedIndex` is optional; if provided, it determines which element starts focused.
 * - Call `setFocusRef({ index, element })` for each element you want to include in the roving focus group.
 * - Use `moveFocus('next' | 'previous')`, `moveToStart()`, and `moveToEnd()` inside a keydown handler to support keyboard navigation.
 * - `setFocusedIndex` allows manual control of which element is focused (e.g. from mouse interaction or other logic).
 * - `focusedIndex` can be used to conditionally style or render elements based on current focus.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type SetFocusRefProps = {
  index: string | number;
  element: HTMLElement | null;
};

export type RovingFocusHookProps = {
  focusedIndex: string | number | null;
  setFocusedIndex: React.Dispatch<React.SetStateAction<string | number | null>>;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setFocusRef: (props: SetFocusRefProps) => void;
};

function useRovingFocus(
  initialFocusedIndex?: string | number | (string | number)[] | null
): RovingFocusHookProps {
  const [focusedIndex, setFocusedIndex] = useState(() => {
    if (initialFocusedIndex == null) return null;
    return Array.isArray(initialFocusedIndex)
      ? (initialFocusedIndex[0] ?? null)
      : initialFocusedIndex;
  });

  const elementsRef = useRef<Map<string | number, HTMLElement | null>>(new Map());

  const isElementDisabled = (el: HTMLElement | null): boolean =>
    !el || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';

  const isElementVisible = (el: HTMLElement | null): boolean => {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return !(
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      el.getAttribute('aria-hidden') === 'true'
    );
  };

  const isElementFocusable = (el: HTMLElement | null | undefined): el is HTMLElement => {
    return !!el && !isElementDisabled(el) && isElementVisible(el);
  };

  const setFocusRef = useCallback(({ index, element }: SetFocusRefProps) => {
    if (element != null && isElementFocusable(element)) {
      elementsRef.current.set(index, element);
    }
  }, []);

  const moveFocus = useCallback(
    (direction: 'next' | 'previous') => {
      const entries = Array.from(elementsRef.current.entries());
      const focusables = entries.filter(([_, el]) => isElementFocusable(el));

      if (focusables.length === 0) return;

      let currentIndex = focusables.findIndex(([key]) => key === focusedIndex);

      if (currentIndex === -1 || !focusables[currentIndex][1]?.focus) {
        currentIndex = direction === 'next' ? 0 : focusables.length - 1;
      }

      let nextIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

      if (nextIndex >= focusables.length) nextIndex = 0;
      if (nextIndex < 0) nextIndex = focusables.length - 1;

      const [nextKey] = focusables[nextIndex];
      setFocusedIndex(nextKey);

      const nextElement = focusables[nextIndex][1];
      nextElement?.focus();
    },
    [focusedIndex]
  );

  const moveToStart = useCallback(() => {
    for (const [key, el] of elementsRef.current.entries()) {
      if (isElementFocusable(el)) {
        setFocusedIndex(key);
        break;
      }
    }
  }, []);

  const moveToEnd = useCallback(() => {
    const entries = Array.from(elementsRef.current.entries()).reverse();
    for (const [key, el] of entries) {
      if (isElementFocusable(el)) {
        setFocusedIndex(key);
        break;
      }
    }
  }, []);

  useEffect(() => {
    const el = elementsRef.current.get(focusedIndex ?? '');
    if (isElementFocusable(el)) {
      el.focus();
    }
  }, [focusedIndex]);

  return {
    focusedIndex,
    setFocusedIndex,
    setFocusRef,
    moveFocus,
    moveToStart,
    moveToEnd,
  };
}

export default useRovingFocus;
