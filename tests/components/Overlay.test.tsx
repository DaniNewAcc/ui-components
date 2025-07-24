import { Overlay } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('Overlay', () => {
  it('should render the overlay div', () => {
    render(<Overlay />);
    expect(screen.getByTestId('overlay')).toBeInTheDocument();
  });

  it('should apply default styles and class names', () => {
    render(<Overlay />);
    const overlay = screen.getByTestId('overlay');
    expect(overlay).toHaveClass('ui:fixed');
    expect(overlay).toHaveClass('ui:inset-0');
  });

  it('should apply custom zIndex and opacity', () => {
    render(<Overlay zIndex={50} opacity={0.8} />);
    const overlay = screen.getByTestId('overlay');
    expect(overlay.className).toContain('ui:z-[50]');
    expect(overlay.className).toContain('ui:opacity-80');
  });

  it('should call onClickOutside when clicked and closeOnClickOutside is true', () => {
    const onClickOutside = vi.fn();
    render(<Overlay onClickOutside={onClickOutside} />);
    fireEvent.click(screen.getByTestId('overlay'));
    expect(onClickOutside).toHaveBeenCalled();
  });

  it('should not call onClickOutside when closeOnClickOutside is false', () => {
    const onClickOutside = vi.fn();
    render(<Overlay closeOnClickOutside={false} onClickOutside={onClickOutside} />);
    fireEvent.click(screen.getByTestId('overlay'));
    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
