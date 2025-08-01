import Animate, { AnimateProps } from '@components/Animate';
import Close, { CloseProps } from '@components/Close';
import Flex, { FlexProps } from '@components/Flex';
import Overlay, { OverlayProps } from '@components/Overlay';
import Portal, { PortalProps } from '@components/Portal';
import Text, { TextProps } from '@components/Text';
import Trigger, { TriggerProps } from '@components/Trigger';
import { useSyncAnimation } from '@hooks/useSyncAnimation';
import { cn } from '@utils/cn';
import { TextVariants } from '@utils/variants';
import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type SidebarSides = 'left' | 'right';

export type SidebarProps = {
  containerId?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  side?: SidebarSides;
  showOverlay?: boolean;
  dismissOnEscape?: boolean;
  dismissOnClickOutside?: boolean;
  trapFocus?: boolean;
  triggerRef?: RefObject<HTMLElement>;
  children: ReactNode;
  portal?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export type SidebarContextProps = {
  containerId?: string;
  isOpen: boolean;
  portal?: boolean;
  side?: SidebarSides;
  showOverlay?: boolean;
  dismissOnClickOutside?: boolean;
  dismissOnEscape?: boolean;
  trapFocus?: boolean;
  triggerRef?: RefObject<HTMLElement>;
  onOpenChange?: (open: boolean) => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

const Sidebar = ({
  isOpen,
  portal = true,
  containerId,
  defaultOpen,
  side = 'right',
  showOverlay = false,
  dismissOnEscape = true,
  dismissOnClickOutside = false,
  trapFocus = true,
  triggerRef,
  children,
  onOpenChange,
}: SidebarProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = isOpen !== undefined;
  const actualIsOpen = isControlled ? isOpen : internalOpen;

  const onOpenChangeHandler = useCallback(
    (newVal: boolean) => {
      if (!isControlled) {
        setInternalOpen(newVal);
      }
      onOpenChange?.(newVal);
    },
    [isControlled, onOpenChange]
  );

  const contextValue = useMemo(
    () => ({
      isOpen: actualIsOpen,
      side,
      showOverlay,
      dismissOnClickOutside,
      dismissOnEscape,
      trapFocus,
      triggerRef,
      portal,
      containerId,
      onOpenChange: onOpenChangeHandler,
    }),
    [
      actualIsOpen,
      side,
      showOverlay,
      dismissOnClickOutside,
      dismissOnEscape,
      trapFocus,
      triggerRef,
      portal,
      containerId,
      onOpenChangeHandler,
    ]
  );

  return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
};

Sidebar.displayName = 'Sidebar';

// helper function for using Sidebar context

export function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('Sidebar components needs to be wrapped in <Sidebar>.');
  }

  return context;
}

// ------------ Trigger component

export type SidebarTriggerProps = TriggerProps & {
  testId?: string;
};

const SidebarTrigger = forwardRef<HTMLElement, SidebarTriggerProps>(
  ({ testId = 'sidebar-trigger', children, ...props }, ref) => {
    const { onOpenChange, triggerRef } = useSidebarContext();

    return (
      <Trigger
        testId={testId}
        ref={ref ?? triggerRef}
        {...props}
        onTrigger={() => onOpenChange?.(true)}
      >
        {children}
      </Trigger>
    );
  }
);

Sidebar.Trigger = SidebarTrigger;
SidebarTrigger.displayName = 'SidebarTrigger';

// ------------ Portal component

export type SidebarPortalProps = PortalProps & {
  testId?: string;
};

const SidebarPortal = ({ testId = 'sidebar-portal', children }: SidebarPortalProps) => {
  const { containerId } = useSidebarContext();
  return (
    <Portal testId={testId} containerId={containerId}>
      {children}
    </Portal>
  );
};

Sidebar.Portal = SidebarPortal;
SidebarPortal.displayName = 'SidebarPortal';

// ------------ Frame component

export type SidebarFrameProps = ComponentPropsWithoutRef<'aside'> & {
  testId?: string;
  animateProps?: Partial<AnimateProps>;
};

const SidebarFrame = ({
  testId = 'sidebar-frame',
  className,
  children,
  animateProps,
  ...props
}: SidebarFrameProps) => {
  const duration = animateProps?.duration ?? 300;
  const { isOpen, portal, side, showOverlay } = useSidebarContext();
  const {
    ref: animationRef,
    maxWidth,
    shouldRender,
  } = useSyncAnimation({
    isOpen,
    duration,
    dimension: 'width',
  });

  if (!shouldRender) return null;

  const content = (
    <>
      {showOverlay && <Sidebar.Overlay />}
      <aside
        data-testid={testId}
        ref={animationRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        aria-describedby="sidebar-desc"
        className={cn(
          'ui:fixed ui:top-0 ui:z-50 ui:shadow-lg',
          { 'ui:right-0': side === 'right', 'ui:left-0': side === 'left' },
          className
        )}
        {...props}
      >
        <Animate
          isVisible={isOpen}
          preset={side === 'right' ? 'sidebarRight' : 'sidebarLeft'}
          animateHeight={false}
          style={{
            maxWidth: `${maxWidth}px`,
            transition: `max-width ${duration}ms ease, opacity ${duration}ms ease, visibility ${duration}ms ease`,
            opacity: isOpen ? 1 : 0,
            visibility: isOpen ? 'visible' : 'hidden',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
          {...animateProps}
        >
          <div className="ui:flex ui:h-screen ui:w-[300px] ui:flex-col ui:bg-white">{children}</div>
        </Animate>
      </aside>
    </>
  );

  return portal ? <SidebarPortal>{content}</SidebarPortal> : content;
};

Sidebar.Frame = SidebarFrame;
SidebarFrame.displayName = 'SidebarFrame';

// ------------ Overlay component

export type SidebarOverlayProps = OverlayProps & {
  testId?: string;
};

const SidebarOverlay = ({ testId }: SidebarOverlayProps) => {
  const { isOpen, dismissOnClickOutside, onOpenChange } = useSidebarContext();

  if (!isOpen) return null;

  return (
    <Overlay
      testId={testId}
      closeOnClickOutside={dismissOnClickOutside}
      onClickOutside={() => onOpenChange?.(false)}
    />
  );
};

Sidebar.Overlay = SidebarOverlay;
SidebarOverlay.displayName = 'SidebarOverlay';

// ------------ Header component

export type SidebarHeaderProps = ComponentPropsWithoutRef<'header'> & {
  testId?: string;
};

const SidebarHeader = forwardRef<HTMLElement, SidebarHeaderProps>(
  ({ children, className, testId = 'sidebar-header', ...props }, ref) => (
    <header
      data-testid={testId}
      ref={ref}
      className={cn(
        'ui:relative ui:flex ui:items-center ui:justify-between ui:border-b ui:border-gray-200 ui:px-4 ui:py-5',
        className
      )}
      {...props}
    >
      {children}
    </header>
  )
);

Sidebar.Header = SidebarHeader;
SidebarHeader.displayName = 'SidebarHeader';

// ------------ Title component

export type SidebarTitleProps = TextProps<'h2'> & {
  testId?: string;
};

const SidebarTitle = ({
  className,
  children,
  testId = 'sidebar-title',
  variant,
  ...props
}: SidebarTitleProps) => {
  return (
    <Text
      testId={testId}
      as="h2"
      variant={'heading'}
      className={cn(TextVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Text>
  );
};

Sidebar.Title = SidebarTitle;
SidebarTitle.displayName = 'SidebarTitle';

// ------------ Close component

export type SidebarCloseProps = Omit<CloseProps, 'onClose'>;

const SidebarClose = ({
  className,
  children,
  asChild = false,
  testId = 'sidebar-close',
  ...props
}: SidebarCloseProps) => {
  const { onOpenChange } = useSidebarContext();

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <Close
      testId={testId}
      asChild={asChild}
      ariaLabel="Close sidebar"
      className={cn('ui:absolute ui:top-4 ui:right-4', className)}
      onClose={handleClose}
      {...props}
    >
      {children}
    </Close>
  );
};

Sidebar.Close = SidebarClose;
SidebarClose.displayName = 'SidebarClose';

// ------------ Content component

export type SidebarContentProps = FlexProps<'div'> & {
  testId?: string;
};

const SidebarContent = ({
  testId = 'sidebar-content',
  className,
  children,
  ...props
}: SidebarContentProps) => {
  return (
    <Flex
      testId={testId}
      direction={'col'}
      gap={'md'}
      scrollable
      scrollableProps={{ className: 'ui:flex-1 ui:min-h-0 ui:overflow-y-auto' }}
      {...props}
    >
      {children}
    </Flex>
  );
};

Sidebar.Content = SidebarContent;
SidebarContent.displayName = 'SidebarContent';

// ------------ Footer component

export type SidebarFooterProps = ComponentPropsWithoutRef<'footer'> & {
  testId?: string;
};

const SidebarFooter = ({ testId, className, children, ...props }: SidebarFooterProps) => {
  return (
    <footer data-testid={testId} className={cn('ui:h-20 ui:px-4 ui:py-5', className)} {...props}>
      {children}
    </footer>
  );
};

Sidebar.Footer = SidebarFooter;
SidebarFooter.displayName = 'SidebarFooter';

export default Sidebar;
