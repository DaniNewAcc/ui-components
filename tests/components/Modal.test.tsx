import { Modal } from '@/components';
import { render, screen } from '@testing-library/react';

describe('Modal', () => {
  describe('Context Behavior', () => {
    beforeEach(() => {
      vi.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => {
      (console.error as any).mockRestore();
    });
    it('should throw an error when components are not wrapped into modal', () => {
      try {
        render(
          <>
            <Modal.Portal>
              <Modal.Content>Content</Modal.Content>
            </Modal.Portal>
          </>
        );
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Modal components need to be wrapped into <Modal>.');
      }
    });
  });

  describe('Rendering', () => {
    it('should render', () => {
      render(
        <Modal testId="modal">
          <Modal.Content>Content</Modal.Content>
        </Modal>
      );

      const modal = screen.getByTestId('modal');
      expect(modal).toBeInTheDocument();
    });
  });
});
