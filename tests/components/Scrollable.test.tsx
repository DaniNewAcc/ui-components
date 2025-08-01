import Scrollable from '@components/Scrollable';
import { fireEvent, render, screen } from '@testing-library/react';

const setup = (props = {}) => {
  render(
    <Scrollable {...props}>
      <div style={{ height: 1000 }}>Content</div>
    </Scrollable>
  );
  return screen.getByTestId('scrollable');
};

describe('Scrollable', () => {
  it('should render correctly', () => {
    const scrollable = setup();
    expect(scrollable).toBeInTheDocument();
  });

  it('should call onScroll when scrolling', () => {
    const onScroll = vi.fn();
    const scrollable = setup({ onScroll });

    Object.defineProperty(scrollable, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(scrollable, 'scrollHeight', { value: 1000 });
    Object.defineProperty(scrollable, 'clientHeight', { value: 200 });

    fireEvent.scroll(scrollable);
    expect(onScroll).toHaveBeenCalled();
  });

  it('should call onScroll when scrolling and throttle is disabled', () => {
    const onScroll = vi.fn();
    const scrollable = setup({ onScroll, disableScrollThrottle: true });

    Object.defineProperty(scrollable, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(scrollable, 'scrollHeight', { value: 1000 });
    Object.defineProperty(scrollable, 'clientHeight', { value: 200 });

    fireEvent.scroll(scrollable);
    expect(onScroll).toHaveBeenCalled();
  });

  it('should call onScrollStateChange with correct scroll state', () => {
    const onScrollStateChange = vi.fn();
    const scrollable = setup({ onScrollStateChange, scrollThreshold: 50 });

    Object.defineProperty(scrollable, 'scrollTop', { value: 100, writable: true });
    Object.defineProperty(scrollable, 'scrollHeight', { value: 1000 });
    Object.defineProperty(scrollable, 'clientHeight', { value: 200 });

    fireEvent.scroll(scrollable);

    expect(onScrollStateChange).toHaveBeenCalledTimes(1);

    const callArg = onScrollStateChange.mock.calls[0][0];

    expect(callArg).toMatchObject({
      scrollTop: 100,
      scrollHeight: 1000,
      clientHeight: 200,
      isAtTop: false,
      isAtBottom: false,
      scrollDirection: 'down',
    });
  });

  it('should call onReachTop when scrolled to top', () => {
    const onReachTop = vi.fn();
    const scrollable = setup({ onReachTop, scrollThreshold: 50 });

    Object.defineProperty(scrollable, 'scrollTop', { value: 0, writable: true });
    Object.defineProperty(scrollable, 'scrollHeight', { value: 1000 });
    Object.defineProperty(scrollable, 'clientHeight', { value: 200 });

    fireEvent.scroll(scrollable);
    expect(onReachTop).toHaveBeenCalled();
  });

  it('should call onReachBottom when scrolled to bottom', () => {
    const onReachBottom = vi.fn();
    const scrollable = setup({ onReachBottom, scrollThreshold: 50 });

    Object.defineProperty(scrollable, 'scrollTop', { value: 800, writable: true });
    Object.defineProperty(scrollable, 'scrollHeight', { value: 1000 });
    Object.defineProperty(scrollable, 'clientHeight', { value: 200 });

    fireEvent.scroll(scrollable);
    expect(onReachBottom).toHaveBeenCalled();
  });

  it('should not call onReachTop or onReachBottom if not near thresholds', () => {
    const onReachTop = vi.fn();
    const onReachBottom = vi.fn();
    const scrollable = setup({ onReachTop, onReachBottom, scrollThreshold: 50 });

    Object.defineProperty(scrollable, 'scrollTop', { value: 400, writable: true });
    Object.defineProperty(scrollable, 'scrollHeight', { value: 1000 });
    Object.defineProperty(scrollable, 'clientHeight', { value: 200 });

    fireEvent.scroll(scrollable);
    expect(onReachTop).not.toHaveBeenCalled();
    expect(onReachBottom).not.toHaveBeenCalled();
  });
});
