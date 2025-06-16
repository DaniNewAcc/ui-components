import usePortal from '@/hooks/usePortal';
import { createContext, ReactNode, useContext } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  containerId?: string;
  testId?: string;
  children: ReactNode;
};

type ModalContextProps = {
  containerId?: string;
};

const ModalContext = createContext<ModalContextProps | null>(null);

const Modal = ({ containerId, testId, children }: ModalProps) => {
  const contextValue = {
    containerId,
  };

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
    throw new Error('Modal components need to be wrapped into <Modal>.');
  }

  return context;
}

type ModalPortalProps = {
  testId?: string;
  children: ReactNode;
};

const ModalPortal = ({ testId, children }: ModalPortalProps) => {
  const { containerId } = useModalContext();
  const container = usePortal(containerId);

  if (!container) return null;

  return createPortal(<div data-testid={testId}>{children}</div>, container);
};

ModalPortal.displayName = 'ModalPortal';
Modal.Portal = ModalPortal;

type ModalContentProps = {
  testId?: string;
  children: ReactNode;
};

const ModalContent = ({ testId, children }: ModalContentProps) => {
  return <div data-testid={testId}>{children}</div>;
};

ModalContent.displayName = 'ModalContent';
Modal.Content = ModalContent;

export default Modal;
