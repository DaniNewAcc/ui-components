import { useCallback, useEffect, useRef, useState } from 'react';

export type SetFocusRefProps = {
  index: number;
  element: HTMLElement | null;
};

export type RovingFocusHookProps = {
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setFocusRef: (props: SetFocusRefProps) => void;
};

function useRovingFocus(
  totalItems: number,
  initialFocusedIndex?: number | number[] | null
): RovingFocusHookProps {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  // Check if the initialFocusedIndex is an array or a single value
  useEffect(() => {
    if (Array.isArray(initialFocusedIndex)) {
      setFocusedIndex(initialFocusedIndex[0] || 0);
    } else {
      setFocusedIndex(initialFocusedIndex || 0);
    }
  }, [initialFocusedIndex]);

  // helper functions for checking if an element is focusable

  // check if the element is disabled
  const isElementDisabled = (el: HTMLElement | null) => {
    return !el || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';
  };

  // check if the element is visible
  const isElementVisible = (el: HTMLElement | null) => {
    if (!el) return false;

    const style = window.getComputedStyle(el);
    const isHidden =
      style.display === 'none' ||
      style.visibility === 'hidden' ||
      el.getAttribute('aria-hidden') === 'true';

    return !isHidden;
  };

  // check if the element is focusable
  const isElementFocusable = (el: HTMLElement | null) => {
    return el && !isElementDisabled(el) && isElementVisible(el);
  };

  // functions for moving focus through different elements

  // moves focus to the next or previous focusable element
  const moveFocus = useCallback(
    (direction: 'next' | 'previous') => {
      let index = focusedIndex;
      for (let i = 0; i < totalItems; i++) {
        index =
          direction === 'next' ? (index + 1) % totalItems : (index - 1 + totalItems) % totalItems;

        const el = elementsRef.current[index];
        if (isElementFocusable(el)) {
          setFocusedIndex(index);
          break;
        }
      }
    },
    [focusedIndex, totalItems]
  );

  // moves focus to the first focusable element
  const moveToStart = useCallback(() => {
    for (let i = 0; i < totalItems; i++) {
      if (isElementFocusable(elementsRef.current[i])) {
        setFocusedIndex(i);
        break;
      }
    }
  }, [totalItems]);

  // moves focus to the last focusable element
  const moveToEnd = useCallback(() => {
    for (let i = totalItems - 1; i >= 0; i--) {
      if (isElementFocusable(elementsRef.current[i])) {
        setFocusedIndex(i);
        break;
      }
    }
  }, [totalItems]);

  // register a ref to a focusable element at specific index
  const setFocusRef = useCallback(
    ({ index, element }: SetFocusRefProps) => {
      if (element && index >= 0 && index < totalItems) {
        elementsRef.current[index] = element;
      }
    },
    [totalItems]
  );

  // focuses the current element at the current focusedIndex if it's focusable
  useEffect(() => {
    const currentEl = elementsRef.current[focusedIndex];
    if (currentEl && isElementFocusable(currentEl)) {
      currentEl.focus();
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
