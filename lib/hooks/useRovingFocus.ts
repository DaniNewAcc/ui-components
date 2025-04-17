import { useCallback, useEffect, useRef, useState } from "react";

export type SetFocusRefProps = {
  index: number;
  element: HTMLElement | null;
};

type MoveFocus = (direction: "next" | "previous") => void;

export type RovingFocusHookProps = {
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  moveFocus: MoveFocus;
  setFocusRef: (props: SetFocusRefProps) => void;
};

function useRovingFocus(totalItems: number): RovingFocusHookProps {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const elementsRef = useRef<(HTMLElement | null)[]>([]);

  const moveFocus = useCallback(
    (direction: "next" | "previous") => {
      setFocusedIndex((prev) => {
        let newIndex = prev;
        if (direction === "next") {
          newIndex = (prev + 1) % totalItems;
        } else if (direction === "previous") {
          newIndex = (prev - 1 + totalItems) % totalItems;
        }
        return newIndex;
      });
    },
    [totalItems],
  );

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
    if (currentEl) {
      currentEl.focus();
    }
  }, [focusedIndex]);

  useEffect(() => {
    const currentEl = elementsRef.current[focusedIndex];

    return () => {
      if (currentEl) {
        currentEl.blur();
      }
    };
  }, [focusedIndex]);

  return {
    focusedIndex,
    setFocusedIndex,
    setFocusRef,
    moveFocus,
  };
}

export default useRovingFocus;
