import useTrapFocus from '@/hooks/useTrapFocus';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/utils/helpers', () => ({
  getFocusableElements: (container: HTMLElement) =>
    Array.from(container.querySelectorAll('[tabindex]')),
}));

describe('useTrapFocus', () => {
  let container: HTMLElement;
  let focusables: HTMLElement[];

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    for (let i = 0; i < 3; i++) {
      const btn = document.createElement('button');
      btn.setAttribute('tabindex', '0');
      btn.textContent = `btn${i}`;
      container.appendChild(btn);
    }

    focusables = Array.from(container.querySelectorAll('[tabindex]'));
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should return early if container is null', () => {
    const { result } = renderHook(() =>
      useTrapFocus({ containerRef: { current: null }, loop: true })
    );
    result.current.moveFocus('next');
  });

  it('should return early if no focusable elements are found', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const { result } = renderHook(() =>
      useTrapFocus({ containerRef: { current: container }, loop: true })
    );

    result.current.moveFocus('next');
    expect(document.activeElement).not.toBe(container);
  });

  it('should handle currentIndex === -1 and set it correctly', () => {
    const containerRef = { current: container };
    const { result } = renderHook(() => useTrapFocus({ containerRef, loop: true }));

    const outside = document.createElement('div');
    document.body.appendChild(outside);
    outside.setAttribute('tabindex', '0');
    outside.focus();

    result.current.moveFocus('next');

    expect(document.activeElement).toBe(focusables[0]);
  });

  it('should handle nextIndex >= focusables.length and loop to start', () => {
    const containerRef = { current: container };
    const { result } = renderHook(() => useTrapFocus({ containerRef, loop: true }));

    focusables[2].focus();
    result.current.moveFocus('next');

    expect(document.activeElement).toBe(focusables[0]);
  });

  it('should handle nextIndex >= focusables.length without loop and stay at last', () => {
    const containerRef = { current: container };
    const { result } = renderHook(() => useTrapFocus({ containerRef, loop: false }));

    focusables[2].focus();
    result.current.moveFocus('next');

    expect(document.activeElement).toBe(focusables[2]);
  });

  it('should set currentIndex = direction === "next" ? -1 : 0 when activeElement is not found', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const btn1 = document.createElement('button');
    btn1.setAttribute('tabindex', '0');
    container.appendChild(btn1);

    const outside = document.createElement('button');
    outside.setAttribute('tabindex', '0');
    document.body.appendChild(outside);
    outside.focus();

    const { result } = renderHook(() =>
      useTrapFocus({ containerRef: { current: container }, loop: true })
    );

    result.current.moveFocus('next');
    expect(document.activeElement).toBe(btn1);
  });

  it('should set currentIndex = 0 when direction is "previous" and activeElement is not found', () => {
    const containerRef = { current: container };
    const { result } = renderHook(() => useTrapFocus({ containerRef, loop: true }));

    const outside = document.createElement('button');
    outside.setAttribute('tabindex', '0');
    document.body.appendChild(outside);
    outside.focus();

    result.current.moveFocus('previous');

    expect(document.activeElement).toBe(focusables[2]);
  });

  it('should set nextIndex = loop ? focusables.length - 1 : 0 when nextIndex < 0', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const btn1 = document.createElement('button');
    btn1.setAttribute('tabindex', '0');
    const btn2 = document.createElement('button');
    btn2.setAttribute('tabindex', '0');
    container.appendChild(btn1);
    container.appendChild(btn2);

    btn1.focus();

    const { result } = renderHook(() =>
      useTrapFocus({ containerRef: { current: container }, loop: true })
    );

    result.current.moveFocus('previous');
    expect(document.activeElement).toBe(btn2);
  });

  it('should respect loop = false when nextIndex < 0 and stop at 0', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    btn1.setAttribute('tabindex', '0');
    btn2.setAttribute('tabindex', '0');
    container.appendChild(btn1);
    container.appendChild(btn2);

    btn1.focus();

    const { result } = renderHook(() =>
      useTrapFocus({ containerRef: { current: container }, loop: false })
    );

    result.current.moveFocus('previous');
    expect(document.activeElement).toBe(btn1);
  });
});
