import useAutoFocus from '@/hooks/useAutoFocus';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/utils/helpers', () => ({
  getFocusableElements: (container: HTMLElement) =>
    Array.from(container.querySelectorAll('button, [tabindex]:not([tabindex="-1"])')),
}));

describe('useAutoFocus', () => {
  it('should focus the first focusable element if present', async () => {
    const container = document.createElement('div');

    const button1 = document.createElement('button');
    const button2 = document.createElement('button');
    container.appendChild(button1);
    container.appendChild(button2);

    button1.focus = vi.fn();
    button2.focus = vi.fn();

    const containerRef = { current: container };

    renderHook(() => useAutoFocus(true, containerRef));

    await new Promise(requestAnimationFrame);

    expect(button1.focus).toHaveBeenCalled();
    expect(button2.focus).not.toHaveBeenCalled();
  });

  it('should focus the container if no focusable elements are found', async () => {
    const container = document.createElement('div');

    container.focus = vi.fn();

    const containerRef = { current: container };

    renderHook(() => useAutoFocus(true, containerRef));

    await new Promise(requestAnimationFrame);

    expect(container.focus).toHaveBeenCalled();
  });

  it('should do nothing if shouldFocus is false', async () => {
    const container = document.createElement('div');
    const containerRef = { current: container };

    container.focus = vi.fn();

    renderHook(() => useAutoFocus(false, containerRef));

    await new Promise(requestAnimationFrame);

    expect(container.focus).not.toHaveBeenCalled();
  });
});
