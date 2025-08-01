import Animate, { AnimateProps } from '@components/Animate';
import Close, { CloseProps } from '@components/Close';
import Overlay, { OverlayProps } from '@components/Overlay';
import Portal, { PortalProps } from '@components/Portal';
import Text, { TextProps } from '@components/Text';
import Trigger, { TriggerProps } from '@components/Trigger';
import { useAutoFocus } from '@hooks/useAutoFocus';
import { useComponentIds } from '@hooks/useComponentIds';
import { useMergedRefs } from '@hooks/useMergedRefs';
import { useScrollLock } from '@hooks/useScrollLock';
import { useSyncAnimation } from '@hooks/useSyncAnimation';
import { useTrapFocus } from '@hooks/useTrapFocus';
import { cn } from '@utils/cn';
import React, {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type ModalProps = {
  containerId?: string;
  closeOnClickOutside?: boolean;
  isOpen?: boolean;
  children: ReactNode;
  onClose?: () => void;
};

export type ModalContextProps = {
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
export function useModalContext() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('Modal components must be wrapped in <Modal>.');
  }
  return context;
}

// ------------ Portal component

export type ModalPortalProps = PortalProps & {
  testId?: string;
};

const ModalPortal = ({
  className,
  testId = 'modal-portal',
  children,
  ...props
}: ModalPortalProps) => {
  const { containerId, isOpen, ids } = useModalContext();

  return (
    <Portal
      testId={testId}
      containerId={containerId}
      isOpen={isOpen}
      role="dialog"
      ariaLabelledby={ids.title}
      ariaDescribedby={ids.description}
      className={cn(
        'ui:fixed ui:inset-0 ui:z-50 ui:flex ui:items-center ui:justify-center',
        className
      )}
      {...props}
    >
      {children}
    </Portal>
  );
};

ModalPortal.displayName = 'ModalPortal';
Modal.Portal = ModalPortal;

// ------------ Trigger component

export type ModalTriggerProps = TriggerProps & {
  testId?: string;
  children: React.ReactElement;
};

const ModalTrigger = forwardRef<HTMLElement, ModalTriggerProps>(
  ({ children, testId = 'modal-trigger', ...props }, ref) => {
    const { open } = useModalContext();

    return (
      <Trigger testId={testId} ref={ref} {...props} onTrigger={open}>
        {children}
      </Trigger>
    );
  }
);

ModalTrigger.displayName = 'ModalTrigger';
Modal.Trigger = ModalTrigger;

// ------------ Overlay component

export type ModalOverlayProps = OverlayProps & {
  testId?: string;
};

const ModalOverlay = ({ className, testId = 'modal-overlay', ...props }: ModalOverlayProps) => {
  const { closeOnClickOutside, onClose } = useModalContext();

  return (
    <Overlay
      testId={testId}
      closeOnClickOutside={closeOnClickOutside}
      onClickOutside={onClose}
      className={cn('', className)}
      {...props}
    />
  );
};

ModalOverlay.displayName = 'ModalOverlay';
Modal.Overlay = ModalOverlay;

// ------------ Content component

export type ModalContentProps = ComponentPropsWithoutRef<'div'> & {
  animateProps?: Partial<AnimateProps>;
  testId?: string;
};

const ModalContent = forwardRef<React.ElementRef<'div'>, ModalContentProps>(
  ({ animateProps, className, testId = 'modal-content', children, ...props }, ref) => {
    const { isOpen, onClose } = useModalContext();
    const duration = animateProps?.duration ?? 300;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const { moveFocus } = useTrapFocus({ containerRef, loop: true });
    const { ref: animationRef, shouldRender, maxHeight } = useSyncAnimation({ isOpen, duration });

    const mergedRefs = useMergedRefs(animationRef, containerRef, ref);
    useAutoFocus(isOpen && shouldRender, containerRef);

    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation();
          onClose();
        }
        if (e.key === 'Tab') {
          e.preventDefault();
          moveFocus(e.shiftKey ? 'previous' : 'next');
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [isOpen, onClose, moveFocus]);

    return (
      <Animate
        isVisible={isOpen}
        preset="modal"
        className={cn(
          'ui:relative ui:z-50 ui:w-full ui:max-w-lg ui:rounded ui:bg-white ui:p-6 ui:shadow-lg',
          className
        )}
      >
        {shouldRender && (
          <div
            ref={mergedRefs}
            data-testid={testId}
            role="document"
            style={{
              maxHeight: `${maxHeight}px`,
              transition: `max-height ${duration}ms ease, opacity ${duration}ms ease, visibility ${duration}ms ease`,
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? 'visible' : 'hidden',
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
            tabIndex={-1}
            {...props}
          >
            {children}
          </div>
        )}
      </Animate>
    );
  }
);

ModalContent.displayName = 'ModalContent';
Modal.Content = ModalContent;

// ------------ Title component

export type ModalTitleProps = TextProps<'h2'> & {
  testId?: string;
};

const ModalTitle = forwardRef<React.ElementRef<'h2'>, ModalTitleProps>(
  ({ className, testId = 'modal-title', children, ...props }, ref) => {
    const { ids } = useModalContext();
    return (
      <Text
        as="h2"
        ref={ref}
        id={ids.title}
        testId={testId}
        className={cn('', className)}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

ModalTitle.displayName = 'ModalTitle';
Modal.Title = ModalTitle;

// ------------ Description component

export type ModalDescriptionProps = TextProps<'p'> & {
  testId?: string;
};

const ModalDescription = forwardRef<React.ElementRef<'p'>, ModalDescriptionProps>(
  ({ className, testId = 'modal-description', children, ...props }, ref) => {
    const { ids } = useModalContext();
    return (
      <Text
        as="p"
        ref={ref}
        id={ids.description}
        testId={testId}
        className={cn('', className)}
        {...props}
      >
        {children}
      </Text>
    );
  }
);

ModalDescription.displayName = 'ModalDescription';
Modal.Description = ModalDescription;

// ------------ Footer component

export type ModalFooterProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
};

const ModalFooter = forwardRef<React.ElementRef<'div'>, ModalFooterProps>(
  ({ className, children, testId = 'modal-footer', ...props }, ref) => {
    return (
      <div
        data-testid={testId}
        ref={ref}
        className={cn('ui:flex ui:justify-end ui:gap-4', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = 'ModalFooter';
Modal.Footer = ModalFooter;

// ------------ Close component

export type ModalCloseProps = Omit<CloseProps, 'onClose'> & {
  testId?: string;
};

const ModalClose = forwardRef<React.ElementRef<'button'>, ModalCloseProps>(
  (
    {
      variant,
      size,
      intent,
      rounded,
      testId = 'modal-close',
      className,
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const { onClose } = useModalContext();

    return (
      <Close
        testId={testId}
        ref={ref}
        asChild={asChild}
        ariaLabel="Close modal"
        variant="unstyled"
        intent="icon"
        size="sm"
        rounded="full"
        className={cn('ui:absolute ui:top-4 ui:right-4 ui:z-60', className)}
        onClose={onClose}
        {...props}
      >
        {children}
      </Close>
    );
  }
);

ModalClose.displayName = 'ModalClose';
Modal.Close = ModalClose;

export default Modal;
