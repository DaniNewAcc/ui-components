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
    render(<Separator as="div" orientation={'vertical'} />);

    const separator = screen.getByRole('separator', { hidden: true });
    expect(separator.hasAttribute('orientation'));
    expect(separator.tagName).toBe('DIV');
    expect(separator).toBeInTheDocument();
  });
});
