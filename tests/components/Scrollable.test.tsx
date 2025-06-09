import { Scrollable } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';

const setup = (props = {}) => {
  render(
    <Scrollable testId="scroll" {...props}>
      <div style={{ height: 1000 }}>Content</div>
    </Scrollable>
  );
  return screen.getByTestId('scroll');
};

describe('Scrollable', () => {
  it('should render correctly', () => {
    setup();
    expect(screen.getByTestId('scroll')).toBeInTheDocument();
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
