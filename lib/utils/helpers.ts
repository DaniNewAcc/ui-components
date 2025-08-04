import { cn } from '@utils/cn';
import { CSSProperties } from 'react';

type MergeScrollableClassesProps = Partial<{
  className: string;
  style: CSSProperties;
}>;

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

export const getFocusableElements = (container: HTMLElement | null | undefined): HTMLElement[] => {
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

export const applyInitialFocus = <T>(
  isValid: boolean,
  activeValue: T | null,
  fallbackValue: T | undefined,
  setFocus: (val: T) => void
) => {
  if (isValid && activeValue !== null) {
    setFocus(activeValue);
  } else if (fallbackValue !== undefined) {
    setFocus(fallbackValue);
  }
};

export const mergeScrollableClasses = ({
  className,
  style,
}: MergeScrollableClassesProps): string => {
  const DEFAULT_MAX_HEIGHT = '50vh';

  const hasHeightInClass = /\b(?:h-|max-h-)/.test(className ?? '');
  const hasHeightInStyle = style?.height !== undefined || style?.maxHeight !== undefined;

  const shouldApplyDefaultMaxHeight = !hasHeightInClass && !hasHeightInStyle;

  return cn(
    'overflow-y-auto',
    shouldApplyDefaultMaxHeight && `ui:max-h-[${DEFAULT_MAX_HEIGHT}]`,
    className
  );
};
