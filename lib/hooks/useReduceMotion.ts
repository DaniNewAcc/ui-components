/**
 * Custom hook to handle animations based on "reduce motion" preference
 *
 * This hook returns a boolean indicating whether the user has requested reduced motion.
 * It listens for changes to this preference and updates accordingly.
 *
 * The value can be manually overridden in tests using the `__setReduceMotionForTests` helper.
 */

import { useEffect, useState } from 'react';

let forcedValue: boolean | undefined = undefined;

export const __setReduceMotionForTests = (value: boolean | undefined) => {
  forcedValue = value;
};

const useReduceMotion = () => {
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    if (forcedValue !== undefined) return forcedValue;

    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    return false;
  });

  useEffect(() => {
    if (forcedValue !== undefined) {
      setReduceMotion(forcedValue);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return reduceMotion;
};

export default useReduceMotion;
