/**
 * A custom hook that detects whether the user is interacting via keyboard
 * (e.g., using Tab or Arrow keys) or mouse.
 *
 * Returns the current input mode ('keyboard' or 'mouse'), allowing components
 * to conditionally style elements, for example, to show focus outlines only when
 * the user is navigating via keyboard.
 *
 * This enhances accessibility by preventing unwanted focus styles during mouse interaction,
 * while preserving them for keyboard users.
 */

import { useEffect, useState } from 'react';

type InputMode = 'mouse' | 'keyboard';

function useKeyboardNavigation() {
  const [inputMode, setInputMode] = useState<InputMode>('mouse');

  useEffect(() => {
    const updateInputMode = (mode: InputMode) => {
      if (document.body.dataset.inputMode !== mode) {
        document.body.dataset.inputMode = mode;
        setInputMode(mode);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' || e.key.startsWith('Arrow')) {
        updateInputMode('keyboard');
      }
    };

    const handleMouseDown = () => {
      updateInputMode('mouse');
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, []);

  return inputMode;
}

export default useKeyboardNavigation;
