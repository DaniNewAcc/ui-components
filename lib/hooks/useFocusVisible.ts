/**
 * useFocusVisible
 *
 * A reusable hook to track whether an element should visually show focus styles,
 * based on whether the user is interacting via keyboard (e.g. Tab, Arrow keys)
 * or mouse (e.g. click).
 *
 * This is useful for accessible components where you only want to show focus outlines
 * or other focus indicators when navigating with a keyboard — not when clicking.
 *
 * @param inputMode - A string representing the current input method (e.g., 'keyboard', 'mouse').
 *                    This is usually provided by a global hook like `useKeyboardNavigation`.
 *
 * @returns {
 *   isFocusVisible: boolean — whether the element should visually show focus,
 *   handleMouseDown: () => void — attach to `onMouseDown`,
 *   handleFocus: () => void — attach to `onFocus`,
 *   handleBlur: () => void — attach to `onBlur`
 * }
 *
 */

import { useCallback, useRef, useState } from 'react';

const useFocusVisible = (inputMode: string) => {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const isClickingRef = useRef(false);

  const handleMouseDown = useCallback(() => {
    isClickingRef.current = true;
    setIsFocusVisible(false);
    setTimeout(() => {
      isClickingRef.current = false;
    }, 0);
  }, []);

  const handleFocus = useCallback(() => {
    const shouldShowFocus = !isClickingRef.current && inputMode === 'keyboard';
    setIsFocusVisible(shouldShowFocus);
  }, [inputMode]);

  const handleBlur = useCallback(() => {
    setIsFocusVisible(false);
  }, []);

  return {
    isFocusVisible,
    handleMouseDown,
    handleFocus,
    handleBlur,
  };
};

export default useFocusVisible;
