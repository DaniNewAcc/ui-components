import { useCallback, useEffect, useRef, useState } from "react";

export type SetFocusRefProps = {
  index: number;
  element: HTMLElement | null;
};

export type RovingFocusHookProps = {
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  moveFocus: (direction: "next" | "previous") => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setFocusRef: (props: SetFocusRefProps) => void;
};

function useRovingFocus(totalItems: number): RovingFocusHookProps {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const isElementDisabled = (el: HTMLElement | null) => {
    return (
      !el ||
      el.hasAttribute("disabled") ||
      el.getAttribute("aria-disabled") === "true"
    );
  };

  const moveFocus = useCallback(
    (direction: "next" | "previous") => {
      let index = focusedIndex;
      for (let i = 0; i < totalItems; i++) {
        index =
          direction === "next"
            ? (index + 1) % totalItems
            : (index - 1) % totalItems;

        if (!isElementDisabled(elementsRef.current[index])) {
          setFocusedIndex(index);
          break;
        }
      }
    },
    [focusedIndex, totalItems],
  );

  const moveToStart = useCallback(() => {
    for (let i = 0; i < totalItems; i++) {
      if (!isElementDisabled(elementsRef.current[i])) {
        setFocusedIndex(i);
        break;
      }
    }
  }, [totalItems]);

  const moveToEnd = useCallback(() => {
    for (let i = totalItems - 1; i >= 0; i--) {
      if (!isElementDisabled(elementsRef.current[i])) {
        setFocusedIndex(i);
        break;
      }
    }
  }, [totalItems]);

  const setFocusRef = useCallback(
    ({ index, element }: SetFocusRefProps) => {
      if (element && index >= 0 && index < totalItems) {
        elementsRef.current[index] = element;
      }
    },
    [totalItems],
  );

  useEffect(() => {
    const currentEl = elementsRef.current[focusedIndex];
    if (currentEl && !isElementDisabled(currentEl)) {
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
