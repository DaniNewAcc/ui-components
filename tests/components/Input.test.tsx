import { Input } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Input', () => {
  it('should render', () => {
    render(<Input></Input>);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });
  it('should render with error message and aria-invalid', () => {
    render(<Input error></Input>);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toBeInTheDocument();
  });
});
