import Animate from '@components/Animate';
import { useReduceMotion } from '@hooks/useReduceMotion';
import { render, screen, waitFor } from '@testing-library/react';
import { act, useRef } from 'react';
import { vi } from 'vitest';

// mock reduce motion hook for testing
vi.mock('@hooks/useReduceMotion', () => ({
  __esmodule: true,
  useReduceMotion: vi.fn(),
}));

describe('Animate', () => {
  beforeEach(() => {
    vi.mocked(useReduceMotion).mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('should render correctly when isVisible is true', () => {
      render(
        <Animate isVisible={true}>
          <div>Content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate).toBeInTheDocument();
      expect(animate).toBeVisible();
    });

    it('should not render the content when isVisible is false', () => {
      render(
        <Animate isVisible={false}>
          <div>Content</div>
        </Animate>
      );

      const animate = screen.queryByTestId('animate');
      expect(animate).not.toBeInTheDocument();
    });

    it('should hide the content after collapse animation duration', () => {
      vi.useFakeTimers();
      const duration = 100;

      const { rerender, queryByTestId } = render(
        <Animate isVisible={true} duration={duration}>
          <div>Content</div>
        </Animate>
      );

      expect(queryByTestId('animate')).toBeInTheDocument();

      rerender(
        <Animate isVisible={false} duration={duration}>
          <div>Content</div>
        </Animate>
      );

      expect(queryByTestId('animate')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(duration);
      });

      expect(queryByTestId('animate')).not.toBeInTheDocument();
    });
  });

  describe('Preset Handling', () => {
    beforeEach(() => {
      vi.mocked(useReduceMotion).mockReturnValue(false);
    });

    it('should apply values from a valid preset', () => {
      render(
        <Animate preset="toast" isVisible={true}>
          <div>Toast content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate).toBeInTheDocument();
      expect(animate.className).toContain('fadeIn');
    });

    it('should fallback when unknown preset key is used', () => {
      render(
        <Animate preset={'nonexistent' as any} isVisible={true}>
          <div>Invalid preset content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate).toBeInTheDocument();
    });

    it('should allow overriding preset props with direct props', () => {
      render(
        <Animate preset="toast" type="zoomIn" duration={1000} isVisible={true}>
          <div>Overridden</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate.className).toContain('zoomIn');
    });
  });

  describe('animateHeight Behavior', () => {
    beforeEach(() => {
      vi.mocked(useReduceMotion).mockReturnValue(false);
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call startOpenAnimation and onStart when isVisible is true with animateHeight', () => {
      const onStart = vi.fn();

      const { rerender } = render(
        <Animate isVisible={false} animateHeight onStart={onStart}>
          <div style={{ height: 50 }}>Content</div>
        </Animate>
      );

      rerender(
        <Animate isVisible={true} animateHeight onStart={onStart}>
          <div style={{ height: 50 }}>Content</div>
        </Animate>
      );

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(onStart).toHaveBeenCalled();
    });

    it('should call startCloseAnimation and onStart when isVisible is false with animateHeight', () => {
      const onStart = vi.fn();

      const { rerender } = render(
        <Animate isVisible={true} animateHeight onStart={onStart}>
          <div style={{ height: 50 }}>Content</div>
        </Animate>
      );

      rerender(
        <Animate isVisible={false} animateHeight onStart={onStart}>
          <div style={{ height: 50 }}>Content</div>
        </Animate>
      );

      act(() => {
        vi.advanceTimersByTime(0);
      });

      expect(onStart).toHaveBeenCalled();
    });
  });

  describe('Reduced Motion', () => {
    it('should skip animations when reduced motion is enabled', () => {
      vi.mocked(useReduceMotion).mockReturnValue(true);

      render(
        <Animate isVisible={true}>
          <div>Content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate).not.toHaveClass('ui-animate-slideDown');
    });

    it('should apply animation when reduced motion is not enabled', () => {
      vi.mocked(useReduceMotion).mockReturnValue(false);

      render(
        <Animate isVisible={true} type={'slideDown'}>
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

    it('should call startOpenAnimation and set maxHeight', async () => {
      const TestComponent = () => {
        const ref = useRef<any>(null);

        return (
          <div>
            <Animate ref={ref} isVisible={true} animateHeight duration={100}>
              <div style={{ height: 100 }}>Content</div>
            </Animate>
            <button onClick={() => ref.current?.startOpenAnimation()}>Open</button>
          </div>
        );
      };

      render(<TestComponent />);
      const animate = screen.getByTestId('animate');

      Object.defineProperty(animate, 'scrollHeight', {
        configurable: true,
        get() {
          return 100;
        },
      });

      const openButton = screen.getByRole('button', { name: /open/i });

      act(() => {
        openButton.click();
      });

      await waitFor(() => {
        expect(animate.style.maxHeight).toMatch(/px/);
      });
    });

    it('should call startCloseAnimation and set maxHeight to 0px', () => {
      const TestComponent = () => {
        const ref = useRef<any>(null);

        return (
          <div>
            <Animate ref={ref} isVisible={true} animateHeight>
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

      expect(animate.style.maxHeight).toMatch(/^0(px)?$/);
    });
  });

  describe('Timeout Behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should call onAnimationChange(true) on animation start and onAnimationChange(false) on animation end', () => {
      const onAnimationChange = vi.fn();

      const { rerender } = render(
        <Animate
          isVisible={false}
          onAnimationChange={onAnimationChange}
          animateHeight={false}
          duration={100}
          delay={100}
        >
          <div>Content</div>
        </Animate>
      );

      expect(onAnimationChange).not.toHaveBeenCalled();

      rerender(
        <Animate
          isVisible={true}
          onAnimationChange={onAnimationChange}
          animateHeight={false}
          duration={100}
          delay={100}
        >
          <div>Content</div>
        </Animate>
      );

      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(onAnimationChange).toHaveBeenCalledWith(true);

      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(onAnimationChange).toHaveBeenCalledWith(false);
    });

    it('should trigger exit animation when isVisible changes to false', () => {
      vi.useFakeTimers();

      const { rerender } = render(
        <Animate isVisible={true} duration={300} delay={0}>
          <div>Content</div>
        </Animate>
      );

      rerender(
        <Animate isVisible={false} duration={300} delay={0}>
          <div>Content</div>
        </Animate>
      );

      act(() => {
        vi.advanceTimersByTime(1);
      });

      const animate = screen.getByTestId('animate');
      expect(animate).toHaveClass('is-animating-exit');

      vi.useRealTimers();
    });

    it('should not apply animation class when disabled is true', () => {
      render(
        <Animate isVisible={true} disabled={true} type="slideDown">
          <div>Content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate.className).not.toMatch(/ui-animate/);
    });

    it('should not apply maxHeight or transition styles when animateHeight is false', () => {
      render(
        <Animate isVisible={true} duration={300}>
          <div>Content</div>
        </Animate>
      );

      const animate = screen.getByTestId('animate');
      expect(animate.style.maxHeight).toBe('');
      expect(animate.style.transition).toBe('');
      expect(animate.style.willChange).toBe('');
    });

    it('should call onStart after delay and onEnd after duration', () => {
      const onStart = vi.fn();
      const onEnd = vi.fn();

      render(
        <Animate isVisible={true} duration={500} delay={200} onStart={onStart} onEnd={onEnd}>
          <div>Content</div>
        </Animate>
      );

      expect(onStart).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(199);
      });
      expect(onStart).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(onStart).toHaveBeenCalled();

      expect(onEnd).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(700);
      });
      expect(onEnd).toHaveBeenCalled();
    });

    it('should clear delay timeout on unmount before animation starts', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <Animate isVisible={true} duration={500} delay={300}>
          <div>Content</div>
        </Animate>
      );
      unmount();
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should clear animationTimeout if unmounted after delay but before duration', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <Animate isVisible={true} duration={500} delay={100}>
          <div>Content</div>
        </Animate>
      );
      act(() => {
        vi.advanceTimersByTime(100);
      });
      unmount();
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
