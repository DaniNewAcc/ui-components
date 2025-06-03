import { Separator } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Separator', () => {
  it('should render with default element when no props provided', () => {
    render(<Separator />);
    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.tagName).toBe('HR');
    expect(separator).toBeInTheDocument();
    expect(separator).not.toHaveAttribute('as');
  });

  it('should render element based on explicit `as` prop', () => {
    render(<Separator as="section" orientation="vertical" />);
    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.tagName).toBe('SECTION');
    expect(separator).toBeInTheDocument();
  });

  it('should render div when orientation is vertical and no `as` prop is provided', () => {
    render(<Separator orientation="vertical" />);
    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.tagName).toBe('DIV');
    expect(separator).toBeInTheDocument();
  });

  it('should render hr when orientation is horizontal and no `as` prop is provided', () => {
    render(<Separator orientation="horizontal" />);
    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.tagName).toBe('HR');
    expect(separator).toBeInTheDocument();
  });
});
