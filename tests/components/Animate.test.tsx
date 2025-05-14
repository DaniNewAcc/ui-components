import { Animate } from '@/components';
import useReduceMotion from '@/hooks/useReduceMotion';
import { render, screen } from '@testing-library/react';
import { act, useRef } from 'react';
import { vi } from 'vitest';

// mock reduce motion hook for testing
vi.mock('@/hooks/useReduceMotion', () => ({
  __esmodule: true,
  default: vi.fn(),
}));

describe('Animate', () => {
  beforeEach(() => {
    vi.mocked(useReduceMotion).mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('should render correctly when isVisible is true', () => {
      render(
        <Animate isVisible={true} testId="animate">
          <div>Content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate).toBeInTheDocument();
      expect(animate).toBeVisible();
    });

    it('should not render the content when isVisible is false', () => {
      render(
        <Animate isVisible={false} testId="animate">
          <div>Content</div>
        </Animate>
      );

      const animate = screen.queryByTestId('animate');
      expect(animate).not.toBeInTheDocument();
    });
  });

  describe('Reduced Motion', () => {
    it('should skip animations when reduced motion is enabled', () => {
      vi.mocked(useReduceMotion).mockReturnValue(true);

      render(
        <Animate isVisible={true} testId="animate">
          <div>Content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate).not.toHaveClass('ui-animate-slideDown');
    });

    it('should apply animation when reduced motion is not enabled', () => {
      vi.mocked(useReduceMotion).mockReturnValue(false);

      render(
        <Animate isVisible={true} testId="animate" type={'slideDown'}>
          <div>Content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate).toHaveClass('ui-animate-slideDown');
    });
  });

  describe('useImperativeHandle methods', () => {
    beforeEach(() => {
      vi.mocked(useReduceMotion).mockReturnValue(false);
    });

    it('should call startOpenAnimation and set maxHeight', () => {
      const TestComponent = () => {
        const ref = useRef<any>(null);

        return (
          <div>
            <Animate ref={ref} isVisible={true} useHeightAnimation testId="animate">
              <div style={{ height: 100 }}>Content</div>
            </Animate>
            <button onClick={() => ref.current?.startOpenAnimation()}>Open</button>
          </div>
        );
      };

      render(<TestComponent />);

      const animate = screen.getByTestId('animate');
      const openButton = screen.getByRole('button', { name: /open/i });

      act(() => {
        openButton.click();
      });

      expect(animate.style.maxHeight).toMatch(/px/);
    });

    it('should call startCloseAnimation and set maxHeight to 0px', () => {
      const TestComponent = () => {
        const ref = useRef<any>(null);

        return (
          <div>
            <Animate ref={ref} isVisible={true} useHeightAnimation testId="animate">
              <div style={{ height: 100 }}>Content</div>
            </Animate>
            <button onClick={() => ref.current?.startCloseAnimation()}>Close</button>
          </div>
        );
      };

      render(<TestComponent />);

      const animate = screen.getByTestId('animate');
      const closeButton = screen.getByRole('button', { name: /close/i });

      act(() => {
        closeButton.click();
      });

      expect(animate.style.maxHeight).toBe('0px');
    });
  });

  describe('Timeout Behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers(); // Restores real timers after each test
    });

    it('should call onStart after delay and onEnd after duration', () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();

      render(
        <Animate
          isVisible={true}
          duration={500}
          delay={200}
          onStart={onStart}
          onEnd={onEnd}
          testId="animate-test"
        >
          <div>Content</div>
        </Animate>
      );

      expect(onStart).not.toHaveBeenCalled();

      // Before delay
      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(onStart).not.toHaveBeenCalled();

      // At delay point
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onStart).toHaveBeenCalledTimes(1);

      expect(onEnd).not.toHaveBeenCalled();

      // After animation duration
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(onEnd).toHaveBeenCalledTimes(1);
    });

    it('should clear delay timeout on unmount before animation starts', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <Animate isVisible={true} duration={500} delay={300} testId="animate-test">
          <div>Content</div>
        </Animate>
      );

      // Unmount before delay passes
      unmount();

      // Expect both delay and animationTimeout (even undefined) to be cleared
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    });

    it('should clear animationTimeout if unmounted after delay but before duration', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <Animate isVisible={true} duration={500} delay={100} testId="animate-test">
          <div>Content</div>
        </Animate>
      );

      // Advance past the delay to schedule animationTimeout
      act(() => {
        vi.advanceTimersByTime(100);
      });

      // Unmount before animation completes
      unmount();

      // Expect both timeouts to be cleared
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2);
    });
  });
});
