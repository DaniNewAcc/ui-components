/**
 * A custom hook that throttles a callback function.
 *
 * Throttling ensures that the callback is not called more than once in a specified time window,
 * even if the function is invoked many times. This is useful for performance optimization in
 * situations such as scroll or resize events where you want to limit the frequency of execution.
 *
 * @param callback - The function to be throttled.
 * @param delay - The minimum delay (in milliseconds) between calls to the callback.
 * @returns A throttled version of the input callback function.
 *
 * Example usage:
 * const throttledScrollHandler = useThrottle(handleScroll, 200);
 *
 * window.addEventListener('scroll', throttledScrollHandler);
 *
 * Internally:
 * - It stores the timestamp of the last invocation using a ref.
 * - If a call comes in before the `delay` period, it schedules the callback using setTimeout.
 * - If enough time has passed, it immediately invokes the callback and updates the timestamp.
 */

import { useCallback, useRef } from 'react';

function useThrottle<Func extends (...args: any[]) => void>(callback: Func, delay: number): Func {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttledFn = useCallback(
    (...args: Parameters<Func>) => {
      const now = Date.now();

      if (lastCallRef.current && now < lastCallRef.current + delay) {
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(
            () => {
              lastCallRef.current = Date.now();
              timeoutRef.current = null;
              callback(...args);
            },
            delay - (now - lastCallRef.current)
          );
        }
      } else {
        lastCallRef.current = now;
        callback(...args);
      }
    },
    [callback, delay]
  );

  return throttledFn as Func;
}

export default useThrottle;
