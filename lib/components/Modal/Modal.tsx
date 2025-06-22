import useComponentIds from '@/hooks/useComponentIds';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import usePortal from '@/hooks/usePortal';
import useScrollLock from '@/hooks/useScrollLock';
import { useSyncAnimation } from '@/hooks/useSyncAnimation';
import useTrapFocus from '@/hooks/useTrapFocus';
import { cn } from '@/utils/cn';
import { getFocusableElements } from '@/utils/helpers';
import { ButtonVariants } from '@/utils/variants';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { VariantProps } from 'class-variance-authority';
import React, {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import Animate from '../Animate';
import { AnimateProps } from '../Animate/Animate';
import Button from '../Button';
import Text from '../Text';

type ModalProps = {
  containerId?: string;
  closeOnClickOutside?: boolean;
  isOpen?: boolean;
  children: ReactNode;
  onClose?: () => void;
};

type ModalContextProps = {
  containerId?: string;
  isOpen: boolean;
  closeOnClickOutside?: boolean;
  ids: {
    title: string;
    description: string;
  };
  onClose: () => void;
  open: () => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextProps | null>(null);

const Modal = ({
  containerId,
  closeOnClickOutside = false,
  isOpen,
  children,
  onClose,
}: ModalProps) => {
  const ids = useComponentIds('modal', ['title', 'description']) as {
    title: string;
    description: string;
  };
  const isControlled = isOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);

  const actualIsOpen = isControlled ? isOpen : internalOpen;

  const open = useCallback(() => {
    if (!isControlled) setInternalOpen(true);
  }, [isControlled]);

  const close = useCallback(() => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  }, [isControlled, onClose]);

  const contextValue = useMemo(
    () => ({
      containerId,
      isOpen: actualIsOpen,
      closeOnClickOutside,
      ids,
      open,
      close,
      onClose: close,
    }),
    [containerId, actualIsOpen, closeOnClickOutside, close, open]
  );

  useScrollLock(actualIsOpen);

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>;
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

type ModalPortalProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
};

const ModalPortal = ({ className, testId, children, ...props }: ModalPortalProps) => {
  const { containerId, isOpen, ids } = useModalContext();
  const container = usePortal(containerId);
  if (!container) return null;

  return createPortal(
    <div
      data-testid={testId}
      aria-modal="true"
      aria-labelledby={ids.title}
      aria-describedby={ids.description}
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

// ------------ Trigger component

type ModalTriggerProps = {
  children: React.ReactElement;
};

const ModalTrigger = ({ children }: ModalTriggerProps) => {
  const { open } = useModalContext();

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      children.props.onClick?.(e);
      open();
    },
  });
};

ModalTrigger.displayName = 'ModalTrigger';
Modal.Trigger = ModalTrigger;

// ------------ Overlay component

type ModalOverlayProps = ComponentPropsWithoutRef<'div'> & {};

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

type ModalContentProps = ComponentPropsWithoutRef<'div'> & {
  AnimateProps?: Partial<AnimateProps>;
  testId?: string;
};

const ModalContent = ({
  AnimateProps,
  className,
  testId,
  children,
  ...props
}: ModalContentProps) => {
  const { isOpen, onClose } = useModalContext();
  const duration = AnimateProps?.duration ?? 300;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { moveFocus } = useTrapFocus({ containerRef, loop: true });
  const {
    ref: animationRef,
    shouldRender,
    maxHeight,
  } = useSyncAnimation({
    isOpen: isOpen,
    duration,
  });

  const mergedRefs = useMergedRefs(animationRef, containerRef);

  useLayoutEffect(() => {
    if (isOpen && shouldRender && containerRef.current) {
      const focusables = getFocusableElements(containerRef.current);

      if (focusables.length > 0 && document.activeElement !== focusables[0]) {
        const timer = setTimeout(() => {
          focusables[0].focus();
        }, 0);
        return () => clearTimeout(timer);
      } else {
        containerRef.current.focus();
      }
    }
  }, [isOpen, shouldRender]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        moveFocus(e.shiftKey ? 'previous' : 'next');
      }
    },
    [moveFocus, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  return (
    <Animate
      isVisible={isOpen}
      preset="modal"
      className={cn(
        'ui:relative ui:z-50 ui:w-full ui:max-w-lg ui:rounded ui:bg-white ui:p-6 ui:shadow-lg',
        className
      )}
    >
      {shouldRender ? (
        <div
          ref={mergedRefs}
          data-testid={testId}
          role="document"
          style={{
            maxHeight: `${maxHeight}px`,
            transition: `max-height ${duration}ms ease, opacity ${duration}ms ease, visibility ${duration}ms ease`,
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden',
          }}
          tabIndex={-1}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </Animate>
  );
};

ModalContent.displayName = 'ModalContent';
Modal.Content = ModalContent;

// ------------ Title component

type ModalTitleProps = ComponentPropsWithoutRef<'h2'> & {
  testId?: string;
};

const ModalTitle = ({ className, testId, children, ...props }: ModalTitleProps) => {
  const { ids } = useModalContext();
  return (
    <Text as="h2" id={ids.title} testId={testId} className={cn('', className)} {...props}>
      {children}
    </Text>
  );
};

ModalTitle.displayName = 'ModalTitle';
Modal.Title = ModalTitle;

// ------------ Description component

type ModalDescriptionProps = ComponentPropsWithoutRef<'p'> & {
  testId?: string;
};

const ModalDescription = ({ className, testId, children, ...props }: ModalDescriptionProps) => {
  const { ids } = useModalContext();
  return (
    <Text as="p" id={ids.description} testId={testId} className={cn('', className)} {...props}>
      {children}
    </Text>
  );
};

ModalDescription.displayName = 'ModalDescription';
Modal.Description = ModalDescription;

// ------------ Footer component

type ModalFooterProps = ComponentPropsWithoutRef<'div'> & {
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

type ModalCloseProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof ButtonVariants> & {
    testId?: string;
  };

const ModalClose = ({
  variant,
  size,
  intent,
  rounded,
  testId,
  className,
  children,
  ...props
}: ModalCloseProps) => {
  const { onClose } = useModalContext();

  return (
    <Button
      type="button"
      intent={'icon'}
      rounded={'full'}
      size={'sm'}
      variant={'unstyled'}
      aria-label="Close modal"
      onClick={onClose}
      data-testid={testId}
      className={cn(
        ButtonVariants({ variant, size, intent, rounded }),
        'ui:absolute ui:top-4 ui:right-4 ui:z-60 ui:text-gray-500 ui:hover:bg-gray-100',
        className
      )}
      {...props}
    >
      <XMarkIcon className="ui:h-5 ui:w-5" aria-hidden="true" />
    </Button>
  );
};

ModalClose.displayName = 'ModalClose';
Modal.Close = ModalClose;

export default Modal;
