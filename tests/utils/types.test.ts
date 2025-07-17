import { forwardRefWithAs } from '@/utils/types';
import { describe, expect, it } from 'vitest';

describe('forwardRefWithAs', () => {
  it('uses explicit displayName if provided', () => {
    function render() {
      return null;
    }

    const Comp = forwardRefWithAs(render, 'MyDisplayName') as React.FC & { displayName?: string };
    expect(Comp.displayName).toBe('MyDisplayName');
  });

  it('uses render function name if displayName is not provided', () => {
    function MyRender() {
      return null;
    }

    const Comp = forwardRefWithAs(MyRender) as React.FC & { displayName?: string };
    expect(Comp.displayName).toBe('MyRender');
  });

  it('falls back to "Component" if no displayName or render name', () => {
    const anonymousRender = function () {
      return null;
    };

    Object.defineProperty(anonymousRender, 'name', { value: '', configurable: true });

    const Comp = forwardRefWithAs(anonymousRender) as React.FC & { displayName?: string };
    expect(Comp.displayName).toBe('Component');
  });
});
