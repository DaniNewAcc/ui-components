import Close from '@/components/Close';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

describe('Close', () => {
  describe('Rendering', () => {
    it('should render the button with default aria-label', () => {
      const onClose = vi.fn();
      render(<Close onClose={onClose} />);
      const button = screen.getByRole('button', { name: /close/i });
      expect(button).toBeInTheDocument();
    });

    it('should render with custom aria-label', () => {
      render(<Close ariaLabel="Dismiss panel" onClose={vi.fn()} />);
      expect(screen.getByRole('button', { name: /dismiss panel/i })).toBeInTheDocument();
    });
  });

  describe('Props Behavior', () => {
    it('should apply custom classes', () => {
      render(<Close className="custom-class" onClose={vi.fn()} />);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should support testId prop', () => {
      const onClose = vi.fn();
      render(<Close testId="close-button" onClose={onClose} />);
      expect(screen.getByTestId('close-button')).toBeInTheDocument();
    });

    it('should call onClose when clicked', async () => {
      const onClose = vi.fn();
      render(<Close onClose={onClose} />);
      const button = screen.getByRole('button', { name: /close/i });
      await userEvent.click(button);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should call handleClick when asChild is true', async () => {
      const onClose = vi.fn();
      const handleClick = vi.fn();

      render(
        <Close asChild onClose={onClose}>
          <button onClick={handleClick}>Custom Close</button>
        </Close>
      );

      await userEvent.click(screen.getByText('Custom Close'));

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
