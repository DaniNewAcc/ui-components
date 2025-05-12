import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(
  handler: () => void,
  active: boolean = true
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler, active]);

  return ref;
}
