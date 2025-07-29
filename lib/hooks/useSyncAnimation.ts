/**
 * A custom hook to synchronize open/close animations using `maxHeight` and/or `maxWidth`.
 *
 * This hook controls the rendering and animation of a component,
 * useful for expand/collapse behaviors like accordions, dropdowns, selects, sidebars, etc...
 *
 * It works by:
 * - Tracking whether the component should be rendered (`shouldRender`).
 * - Dynamically updating `maxHeight` and/or `maxWidth` to allow CSS transitions.
 * - Accepting `isOpen`, `duration` and optional `dimension` to synchronize timing.
 *
 * The `ref` is generic(T) and defaults to `HTMLDivElement`, allowing flexibility across components.
 * The `dimension` defaults to `height` but can be a single dimension or an array including `width`.
 *
 * Usage:
 * - Pass `isOpen`, `duration` and optionally `dimension` (for `height` is not required) when calling the hook.
 * - If using a custom element (other than `div`), specify the element type like so:
 *
 *   const { ref, shouldRender, maxHeight } = useSyncAnimation<HTMLUListElement>({
 *     isOpen,
 *     duration
 *   });
 *
 * - Apply `ref` to the HTML element you want to animate.
 * - Use `shouldRender`, `maxHeight` and/or `maxWidth` values to control the transition and visibility.
 */

import { useEffect, useRef, useState } from 'react';
import useReduceMotion from './useReduceMotion';

type Dimension = 'height' | 'width';

type SizeValue = number | 'auto' | 0;

type SizeMode = 'scroll' | 'offset';

type UseSyncAnimationProps = {
  isOpen: boolean;
  duration: number;
  dimension?: Dimension | Dimension[];
};

export const useSyncAnimation = <T extends HTMLElement = HTMLDivElement>({
  isOpen,
  duration,
  dimension = 'height',
}: UseSyncAnimationProps) => {
  const ref = useRef<T | null>(null);
  const [shouldRender, setShouldRender] = useState<boolean>(isOpen);
  const hasMounted = useRef<boolean>(false);
  const [sizes, setSizes] = useState<Partial<Record<Dimension, SizeValue>>>({});

  const reduceMotion = useReduceMotion();
  const dims = Array.isArray(dimension) ? dimension : [dimension];

  const getSize = (dim: Dimension, type: SizeMode) => {
    const el = ref.current;
    if (!el) return 0;

    if (dim === 'height') {
      return type === 'scroll' ? el.scrollHeight : el.offsetHeight;
    } else {
      return type === 'scroll' ? el.scrollWidth : el.offsetWidth;
    }
  };

  const updateSizes = (value: SizeValue) => {
    setSizes(prev => {
      let changed = false;
      const updated = { ...prev };
      dims.forEach(dim => {
        if (prev[dim] !== value) {
          updated[dim] = value;
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  };

  const handleExpand = (): NodeJS.Timeout => {
    setShouldRender(true);

    return setTimeout(() => {
      const newSizes: Partial<Record<Dimension, number>> = {};
      dims.forEach(dim => {
        newSizes[dim] = getSize(dim, 'scroll');
      });

      setSizes(prev => {
        const isSame = dims.every(dim => prev[dim] === newSizes[dim]);
        return isSame ? prev : newSizes;
      });
    }, 0);
  };

  const handleCollapse = (): [NodeJS.Timeout, NodeJS.Timeout] => {
    const currentSizes: Partial<Record<Dimension, number>> = {};
    dims.forEach(dim => {
      currentSizes[dim] = getSize(dim, 'offset');
    });

    setSizes(prev => {
      const isSame = dims.every(dim => prev[dim] === currentSizes[dim]);
      return isSame ? prev : currentSizes;
    });

    const animationTimeout = setTimeout(() => {
      updateSizes(0);
    }, 0);

    const collapseTimeout = setTimeout(() => {
      setShouldRender(false);
    }, duration);

    return [animationTimeout, collapseTimeout];
  };

  useEffect(() => {
    if (reduceMotion) {
      setShouldRender(isOpen);
      updateSizes(isOpen ? 'auto' : 0);
      return;
    }

    if (!hasMounted.current) {
      setShouldRender(isOpen);
      updateSizes(isOpen ? 'auto' : 0);
      hasMounted.current = true;
      return;
    }

    let animationTimeout: NodeJS.Timeout;
    let collapseTimeout: NodeJS.Timeout;

    if (isOpen) {
      animationTimeout = handleExpand();
    } else {
      [animationTimeout, collapseTimeout] = handleCollapse();
    }

    return () => {
      clearTimeout(animationTimeout);
      clearTimeout(collapseTimeout);
    };
  }, [isOpen, duration, reduceMotion]);

  return {
    ref,
    shouldRender,
    maxHeight: sizes.height,
    maxWidth: sizes.width,
    updateSizes,
    handleExpand,
    handleCollapse,
    setShouldRender,
  };
};
