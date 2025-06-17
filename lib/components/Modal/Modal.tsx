import usePortal from '@/hooks/usePortal';
import useScrollLock from '@/hooks/useScrollLock';
import { cn } from '@/utils/cn';
import { ComponentProps, createContext, ReactNode, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  containerId?: string;
  closeOnClickOutside?: boolean;
  testId?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

type ModalContextProps = {
  containerId?: string;
  isOpen: boolean;
  closeOnClickOutside?: boolean;
  onClose: () => void;
};

const ModalContext = createContext<ModalContextProps | null>(null);

const Modal = ({
  containerId,
  testId,
  closeOnClickOutside = false,
  isOpen,
  onClose,
  children,
}: ModalProps) => {
  const contextValue = {
    containerId,
    isOpen,
    closeOnClickOutside,
    onClose,
  };

  useScrollLock(isOpen);

  return (
    <ModalContext.Provider value={contextValue}>
      <Modal.Portal testId={testId}>{children}</Modal.Portal>
    </ModalContext.Provider>
  );
};

Modal.displayName = 'Modal';

// Helper function for using modal context
function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be wrapped in <Modal>.');
  }
  return context;
}

type ModalPortalProps = ComponentProps<'div'> & {
  testId?: string;
  children: ReactNode;
};

const ModalPortal = ({ className, testId, children }: ModalPortalProps) => {
  const { containerId, isOpen } = useModalContext();
  const container = usePortal(containerId);
  if (!container) return null;

  return createPortal(
    <div
      data-testid={testId}
      className={cn(
        'ui:fixed ui:inset-0 ui:z-50 ui:flex ui:items-center ui:justify-center',
        !isOpen && 'ui:pointer-events-none ui:opacity-0',
        className
      )}
    >
      {children}
    </div>,
    container
  );
};

ModalPortal.displayName = 'ModalPortal';
Modal.Portal = ModalPortal;

type ModalOverlayProps = ComponentProps<'div'> & {};

const ModalOverlay = ({ className, ...props }: ModalOverlayProps) => {
  const { closeOnClickOutside, onClose } = useModalContext();

  const handleClick = useCallback(() => {
    if (closeOnClickOutside) {
      onClose();
    }
  }, [closeOnClickOutside, onClose]);

  return (
    <div
      aria-hidden="true"
      className={cn('ui:fixed ui:inset-0 ui:z-40 ui:bg-black ui:opacity-50', className)}
      onClick={handleClick}
      {...props}
    />
  );
};

ModalOverlay.displayName = 'ModalOverlay';
Modal.Overlay = ModalOverlay;

type ModalContentProps = ComponentProps<'div'> & {
  testId?: string;
  children: ReactNode;
};

const ModalContent = ({ className, testId, children }: ModalContentProps) => {
  return (
    <div
      data-testid={testId}
      className={cn(
        'ui:z-50 ui:w-full ui:max-w-lg ui:rounded ui:bg-white ui:p-6 ui:shadow-lg',
        className
      )}
    >
      {children}
    </div>
  );
};

ModalContent.displayName = 'ModalContent';
Modal.Content = ModalContent;

export default Modal;
