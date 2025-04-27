import { Separator } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Separator', () => {
  it('should render', () => {
    render(<Separator />);

    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.hasAttribute('as'));
    expect(separator).toBeInTheDocument();
  });
  it('should render based on as prop', () => {
    render(<Separator as="section" orientation="vertical" />);

    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.tagName).toBe('SECTION');
    expect(separator).toBeInTheDocument();
  });
  it('should render based on default as prop value', () => {
    render(<Separator orientation={'horizontal'} />);

    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.tagName).toBe('HR');
    expect(separator).toBeInTheDocument();
  });
});
