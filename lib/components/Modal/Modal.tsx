import usePortal from '@/hooks/usePortal';
import useScrollLock from '@/hooks/useScrollLock';
import { cn } from '@/utils/cn';
import { ComponentProps, createContext, ReactNode, useCallback, useContext } from 'react';
import { createPortal } from 'react-dom';
import Text from '../Text';

type ModalProps = {
  containerId?: string;
  closeOnClickOutside?: boolean;
  testId?: string;
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
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
  children,
  onClose,
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

// ------------ Portal component

type ModalPortalProps = ComponentProps<'div'> & {
  testId?: string;
};

const ModalPortal = ({ className, testId, children, ...props }: ModalPortalProps) => {
  const { containerId, isOpen } = useModalContext();
  const container = usePortal(containerId);
  if (!container) return null;

  return createPortal(
    <div
      data-testid={testId}
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      role="dialog"
      className={cn(
        'ui:fixed ui:inset-0 ui:z-50 ui:flex ui:items-center ui:justify-center',
        !isOpen && 'ui:pointer-events-none ui:opacity-0',
        className
      )}
      {...props}
    >
      {children}
    </div>,
    container
  );
};

ModalPortal.displayName = 'ModalPortal';
Modal.Portal = ModalPortal;

// ------------ Overlay component

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

// ------------ Content component

type ModalContentProps = ComponentProps<'div'> & {
  testId?: string;
};

const ModalContent = ({ className, testId, children, ...props }: ModalContentProps) => {
  return (
    <div
      data-testid={testId}
      role="document"
      className={cn(
        'ui:z-50 ui:w-full ui:max-w-lg ui:rounded ui:bg-white ui:p-6 ui:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

ModalContent.displayName = 'ModalContent';
Modal.Content = ModalContent;

// ------------ Title component

type ModalTitleProps = ComponentProps<'h2'> & {
  testId?: string;
};

const ModalTitle = ({ className, testId, children, ...props }: ModalTitleProps) => {
  return (
    <Text as="h2" testId={testId} className={cn('', className)} {...props}>
      {children}
    </Text>
  );
};

ModalTitle.displayName = 'ModalTitle';
Modal.Title = ModalTitle;

// ------------ Description component

type ModalDescriptionProps = ComponentProps<'p'> & {
  testId?: string;
};

const ModalDescription = ({ className, testId, children, ...props }: ModalDescriptionProps) => {
  return (
    <Text as="p" testId={testId} className={cn('', className)} {...props}>
      {children}
    </Text>
  );
};

ModalDescription.displayName = 'ModalDescription';
Modal.Description = ModalDescription;

// ------------ Footer component

type ModalFooterProps = ComponentProps<'div'> & {
  testId?: string;
};

const ModalFooter = ({ className, children, testId, ...props }: ModalFooterProps) => {
  return (
    <div
      data-testid={testId}
      className={cn('ui:flex ui:justify-end ui:gap-4', className)}
      {...props}
    >
      {children}
    </div>
  );
};

ModalFooter.displayName = 'ModalFooter';
Modal.Footer = ModalFooter;

// ------------ Close component

export default Modal;
