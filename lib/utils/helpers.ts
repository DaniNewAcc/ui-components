export const isElementDisabled = (el: HTMLElement | null): boolean =>
  !el || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true';

export const isElementVisible = (el: HTMLElement | null): boolean => {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return !(
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    el.getAttribute('aria-hidden') === 'true'
  );
};

export const isElementFocusable = (el: HTMLElement | null | undefined): el is HTMLElement => {
  return !!el && !isElementDisabled(el) && isElementVisible(el);
};

export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  const elements = Array.from(container.querySelectorAll<HTMLElement>(selectors));
  return elements.filter(isElementFocusable);
};
