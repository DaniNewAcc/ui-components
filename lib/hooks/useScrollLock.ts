/**
 * A custom hook that disables scrolling on the `<body>` element
 * when the `active` parameter is `true`. This is useful for modals,
 * drawers or overlays where background scroll should be prevented.
 *
 * On cleanup (e.g., component unmount or `active` becomes `false`),
 * it restores the original overflow style.
 *
 * @param active - Whether to lock the scroll or not.
 */

import { useEffect } from 'react';

const useScrollLock = (active: boolean) => {
  useEffect(() => {
    if (!active) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [active]);
};

export default useScrollLock;
