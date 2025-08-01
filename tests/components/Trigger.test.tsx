import Trigger from '@components/Trigger';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Trigger', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      render(
        <Trigger>
          <button>Click</button>
        </Trigger>
      );
      expect(screen.getByText('Click')).toBeInTheDocument();
    });
  });
  describe('Props behavior', () => {
    it('should apply the provided data-testid', () => {
      render(
        <Trigger testId="new-trigger">
          <button>Click</button>
        </Trigger>
      );

      expect(screen.getByTestId('new-trigger')).toBeInTheDocument();
    });
    it('should call onTrigger when clicked', () => {
      const onTriggerMock = vi.fn();
      render(
        <Trigger onTrigger={onTriggerMock}>
          <button>Click</button>
        </Trigger>
      );

      const button = screen.getByText('Click');
      fireEvent.click(button);

      expect(onTriggerMock).toHaveBeenCalledTimes(1);
    });
    it('should call handleClick from inner element when clicked', () => {
      const handleClickMock = vi.fn();
      render(
        <Trigger>
          <button onClick={handleClickMock}>Click</button>
        </Trigger>
      );

      const button = screen.getByText('Click');
      fireEvent.click(button);

      expect(handleClickMock).toHaveBeenCalledTimes(1);
    });
  });
});
