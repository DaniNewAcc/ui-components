/**
 * Custom hook to correctly handle rendering React elements outside the normal DOM tree.
 *
 * It ensures a DOM container with the specified ID exists (creating it if needed),
 * appends it to the document body, and cleans it up when no longer needed.
 *
 * This is useful for rendering portals such as modals, tooltips, or overlays.
 *
 * @param id - The ID of the DOM container element (default: 'portal-root').
 * @returns The container DOM element where the portal content should be rendered, or null initially.
 */

import { useEffect, useState } from 'react';

export function usePortal(id: string = 'portal-root'): HTMLElement | null {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let element = document.getElementById(id);
    let created = false;

    if (!element) {
      element = document.createElement('div');
      element.setAttribute('id', id);
      document.body.appendChild(element);
      created = true;
    }

    setContainer(element);

    return () => {
      if (created && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [id]);

  return container;
}
