import { Modal } from '@/components';
import { fireEvent, render, screen } from '@testing-library/react';

describe('Modal', () => {
  describe('Context Behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      (console.error as any).mockRestore();
    });

    it('should throw an error if modal children are rendered outside of <Modal>', () => {
      expect(() =>
        render(
          <>
            <Modal.Portal>
              <Modal.Content>Content</Modal.Content>
            </Modal.Portal>
          </>
        )
      ).toThrow('Modal components must be wrapped in <Modal>.');
    });
  });

  describe('Rendering', () => {
    it('should render modal when isOpen is true', () => {
      render(
        <Modal isOpen={true} onClose={() => {}}>
          <Modal.Portal testId="modal">
            <Modal.Content>Visible Content</Modal.Content>
          </Modal.Portal>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
      expect(modal).toBeVisible();
    });
  });

  describe('Overlay Behavior', () => {
    it('should call onClose when overlay is clicked and closeOnClickOutside is true', () => {
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} closeOnClickOutside={true}>
          <Modal.Portal>
            <Modal.Overlay data-testid="overlay" />
            <Modal.Content>Modal Content</Modal.Content>
          </Modal.Portal>
        </Modal>
      );

      fireEvent.click(screen.getByTestId('overlay'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when overlay is clicked and closeOnClickOutside is false', () => {
      const onClose = vi.fn();

      render(
        <Modal isOpen={true} onClose={onClose} closeOnClickOutside={false}>
          <Modal.Portal>
            <Modal.Overlay data-testid="overlay" />
            <Modal.Content>Modal Content</Modal.Content>
          </Modal.Portal>
        </Modal>
      );
      const overlay = screen.getByTestId('overlay');

      fireEvent.click(overlay);

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
