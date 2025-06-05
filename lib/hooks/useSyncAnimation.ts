/**
 * A custom hook to synchronize open/close animations using `maxHeight`.
 *
 * This hook controls the rendering and animation of a component,
 * particularly for expand/collapse behaviors like accordions, dropdowns, selects, etc...
 *
 * It works by:
 * - Tracking whether the component should be rendered (`shouldRender`).
 * - Dynamically updating `maxHeight` to allow CSS transitions.
 * - Accepting `isOpen` and `duration` as inputs to sync timing with animations.
 *
 * The `ref` is generic(T) and defaults to `HTMLDivElement`, allowing flexibility across components.
 *
 * Usage:
 * - Pass `isOpen` and `duration` when calling the hook.
 * - If using a custom element (other than `div`), specify the element type like so:
 *
 *   const { ref, shouldRender, maxHeight } = useSyncAnimation<HTMLUListElement>({
 *     isOpen,
 *     duration
 *   });
 *
 * - Apply `ref` to the HTML element you want to animate.
 * - Use the `maxHeight` and `shouldRender` values to control the transition and visibility.
 */

import { useEffect, useRef, useState } from 'react';
import useReduceMotion from './useReduceMotion';

type UseSyncAnimationProps = {
  isOpen: boolean;
  duration: number;
};

export const useSyncAnimation = <T extends HTMLElement = HTMLDivElement>({
  isOpen,
  duration,
}: UseSyncAnimationProps) => {
  const ref = useRef<T | null>(null);
  const [shouldRender, setShouldRender] = useState<boolean>(isOpen);
  const [maxHeight, setMaxHeight] = useState<number | string>(0);

  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      if (isOpen) {
        setShouldRender(true);
        setMaxHeight('auto');
      } else {
        setMaxHeight(0);
        setShouldRender(false);
      }
      return;
    }
    if (isOpen) {
      setShouldRender(true);

      setTimeout(() => {
        if (ref.current) {
          ref.current.offsetHeight;
          setMaxHeight(ref.current.scrollHeight);
        }
      }, 10);
    } else {
      setMaxHeight(ref.current?.scrollHeight || 0);

      setTimeout(() => {
        setMaxHeight(0);
      }, 10);

      setTimeout(() => {
        setShouldRender(false);
      }, duration);
    }
  }, [isOpen, duration]);

  return { ref, shouldRender, maxHeight, setMaxHeight, setShouldRender };
};
