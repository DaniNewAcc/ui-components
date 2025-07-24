import { Modal } from '@/components';
import { __setReduceMotionForTests } from '@/hooks/useReduceMotion';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act, useState } from 'react';

const renderModal = (props = {}, children?: React.ReactNode) => {
  return render(
    <Modal {...props}>
      <Modal.Trigger testId="trigger">
        <button>Open</button>
      </Modal.Trigger>
      <Modal.Portal testId="portal">
        <Modal.Overlay />
        <Modal.Content testId="content">
          <Modal.Title testId="title">Title</Modal.Title>
          <Modal.Description testId="description">Description</Modal.Description>
          <Modal.Footer testId="footer">Footer</Modal.Footer>
          <Modal.Close testId="close" />
        </Modal.Content>
      </Modal.Portal>
      {children}
    </Modal>
  );
};

beforeEach(() => {
  __setReduceMotionForTests(true);
});

afterEach(() => {
  __setReduceMotionForTests(undefined);
});

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
    it('should render and close uncontrolled modal', () => {
      renderModal();

      fireEvent.click(screen.getByTestId('trigger'));

      expect(screen.getByTestId('portal')).toBeVisible();

      fireEvent.click(screen.getByTestId('close'));

      expect(screen.getByTestId('portal')).toHaveClass('ui:opacity-0');
    });

    it('should render controlled modal', () => {
      renderModal({ isOpen: true, onClose: () => {} });

      const trigger = screen.getByTestId('trigger');
      const content = screen.getByTestId('content');

      expect(trigger).toBeInTheDocument();

      fireEvent.click(trigger);

      expect(content).toBeInTheDocument();
    });

    it('should use provided animateProps duration in ModalContent', () => {
      render(
        <Modal isOpen={true} closeOnClickOutside={true}>
          <Modal.Trigger testId="trigger">
            <button>Open</button>
          </Modal.Trigger>
          <Modal.Portal testId="portal">
            <Modal.Overlay />
            <Modal.Content AnimateProps={{ duration: 500 }} testId="content">
              <Modal.Title testId="title">Title</Modal.Title>
              <Modal.Description testId="description">Description</Modal.Description>
              <Modal.Footer testId="footer">Footer</Modal.Footer>
              <Modal.Close testId="close" />
            </Modal.Content>
          </Modal.Portal>
        </Modal>
      );

      const trigger = screen.getByTestId('trigger');
      fireEvent.click(trigger);

      const content = screen.getByTestId('content');
      expect(content).toHaveStyle(
        'transition: max-height 500ms ease, opacity 500ms ease, visibility 500ms ease'
      );
    });
  });

  describe('Overlay Behavior', () => {
    it('should call onClose when overlay is clicked and closeOnClickOutside is true', () => {
      const onClose = vi.fn();
      renderModal({ isOpen: true, onClose: onClose, closeOnClickOutside: true });

      fireEvent.click(screen.getByTestId('modal-overlay'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when overlay is clicked and closeOnClickOutside is false', () => {
      const onClose = vi.fn();
      renderModal({ isOpen: true, onClose: onClose, closeOnClickOutside: false });

      const overlay = screen.getByTestId('modal-overlay');

      fireEvent.click(overlay);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('asChild Behavior', () => {
    it('should call onClick when using asChild for Modal.Close', async () => {
      const handleClick = vi.fn();
      const handleClose = vi.fn();

      const ModalWrapper = () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              handleClose();
            }}
          >
            <Modal.Trigger testId="trigger">
              <button>Open</button>
            </Modal.Trigger>
            <Modal.Portal testId="portal">
              <Modal.Overlay />
              <Modal.Content testId="content">
                <Modal.Title testId="title">Title</Modal.Title>
                <Modal.Description testId="description">Description</Modal.Description>
                <Modal.Footer testId="footer">
                  <Modal.Close asChild>
                    <button data-testid="close" onClick={handleClick}>
                      Cancel
                    </button>
                  </Modal.Close>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Portal>
          </Modal>
        );
      };

      render(<ModalWrapper />);

      const close = screen.getByTestId('close');

      fireEvent.click(close);

      expect(handleClick).toHaveBeenCalled();
      expect(handleClose).toHaveBeenCalled();
    });

    it('should call onClick for Modal.Trigger', async () => {
      const ModalWrapper = () => {
        const [isOpen, setIsOpen] = useState(true);
        return (
          <Modal
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <Modal.Trigger testId="trigger">
              <button onClick={() => setIsOpen(true)}>Open</button>
            </Modal.Trigger>
            <Modal.Portal testId="portal">
              <Modal.Overlay />
              <Modal.Content testId="content">
                <Modal.Title testId="title">Title</Modal.Title>
                <Modal.Description testId="description">Description</Modal.Description>
                <Modal.Footer testId="footer">
                  <Modal.Close asChild>
                    <button data-testid="close">Cancel</button>
                  </Modal.Close>
                </Modal.Footer>
              </Modal.Content>
            </Modal.Portal>
          </Modal>
        );
      };

      render(<ModalWrapper />);

      const trigger = screen.getByTestId('trigger');

      fireEvent.click(trigger);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should call onClose when Escape key is pressed', async () => {
      const onClose = vi.fn();
      renderModal({ isOpen: true, onClose: onClose });

      const user = userEvent.setup();
      await act(async () => {
        await user.keyboard('{Escape}');
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should move focus between focusable elements when Tab and Shift+Tab are pressed', async () => {
      render(
        <Modal>
          <Modal.Trigger testId="trigger">
            <button>Open</button>
          </Modal.Trigger>
          <Modal.Portal>
            <Modal.Content testId="content">
              <button data-testid="btn1">Button 1</button>
              <button data-testid="btn2">Button 2</button>
              <Modal.Close data-testid="close" />
            </Modal.Content>
          </Modal.Portal>
        </Modal>
      );

      const trigger = screen.getByTestId('trigger');
      fireEvent.click(trigger);

      const btn1 = screen.getByTestId('btn1');
      const btn2 = screen.getByTestId('btn2');

      btn1.focus();
      expect(document.activeElement).toBe(btn1);

      fireEvent.keyDown(btn1, { key: 'Tab', code: 'Tab' });
      await waitFor(() => {
        expect(document.activeElement).toBe(btn2);
      });

      fireEvent.keyDown(btn2, { key: 'Tab', code: 'Tab', shiftKey: true });
      await waitFor(() => {
        expect(document.activeElement).toBe(btn1);
      });
    });

    it('should loop focus backwards with Shift+Tab', async () => {
      render(
        <Modal>
          <Modal.Trigger testId="trigger">
            <button>Open</button>
          </Modal.Trigger>
          <Modal.Portal>
            <Modal.Content testId="content">
              <button data-testid="btn1">Button 1</button>
              <button data-testid="btn2">Button 2</button>
              <Modal.Close data-testid="close" />
            </Modal.Content>
          </Modal.Portal>
        </Modal>
      );

      fireEvent.click(screen.getByTestId('trigger'));

      const btn1 = screen.getByTestId('btn1');
      const btn2 = screen.getByTestId('btn2');
      const closeBtn = screen.getByTestId('close');

      closeBtn.focus();
      expect(document.activeElement).toBe(closeBtn);

      fireEvent.keyDown(closeBtn, { key: 'Tab', code: 'Tab', shiftKey: true });
      await waitFor(() => {
        expect(document.activeElement).toBe(btn2);
      });

      fireEvent.keyDown(btn2, { key: 'Tab', code: 'Tab', shiftKey: true });
      await waitFor(() => {
        expect(document.activeElement).toBe(btn1);
      });

      fireEvent.keyDown(btn1, { key: 'Tab', code: 'Tab', shiftKey: true });
      await waitFor(() => {
        expect(document.activeElement).toBe(closeBtn);
      });
    });
  });
});
