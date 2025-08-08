import Animate, { AnimateProps } from '@components/Animate';
import Close, { CloseProps } from '@components/Close';
import Flex, { FlexProps } from '@components/Flex';
import Overlay, { OverlayProps } from '@components/Overlay';
import Portal, { PortalProps } from '@components/Portal';
import Text, { TextProps } from '@components/Text';
import Trigger, { TriggerProps } from '@components/Trigger';
import { useAutoFocus } from '@hooks/useAutoFocus';
import { useScrollLock } from '@hooks/useScrollLock';
import { useSyncAnimation } from '@hooks/useSyncAnimation';
import { useTrapFocus } from '@hooks/useTrapFocus';
import { cn } from '@utils/cn';
import { FlexVariants, TextVariants } from '@utils/variants';
import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

type SidebarSides = 'left' | 'right';

export type SidebarProps = {
  containerId?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  side?: SidebarSides;
  lockScroll?: boolean;
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
  lockScroll,
  showOverlay = false,
  dismissOnEscape = true,
  dismissOnClickOutside = false,
  trapFocus = false,
  triggerRef,
  children,
  onOpenChange,
}: SidebarProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);
  const isControlled = isOpen !== undefined;
  const actualIsOpen = isControlled ? isOpen : internalOpen;
  const shouldScrollLock = lockScroll ?? (actualIsOpen && (dismissOnClickOutside || trapFocus));

  useScrollLock(shouldScrollLock);

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

export type SidebarTriggerProps = TriggerProps<HTMLElement> & {
  testId?: string;
};

const SidebarTrigger = forwardRef<HTMLElement, SidebarTriggerProps>(
  ({ testId = 'sidebar-trigger', children, ...props }, ref) => {
    const { isOpen, triggerRef, onOpenChange } = useSidebarContext();

    return (
      <Trigger
        testId={testId}
        ref={ref ?? triggerRef}
        aria-expanded={isOpen}
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
        tabIndex={-1}
        {...props}
      >
        <Animate
          isVisible={isOpen}
          preset={side === 'right' ? 'sidebarRight' : 'sidebarLeft'}
          className={cn(
            'ui:fixed ui:top-0 ui:z-50 ui:h-screen ui:shadow-lg',
            side === 'right' ? 'ui:right-0' : 'ui:left-0',
            className
          )}
          style={{
            height: '100%',
            maxWidth: `${maxWidth}px`,
            pointerEvents: isOpen ? 'auto' : 'none',
            opacity: isOpen ? 1 : 0,
            transform:
              !isOpen && side === 'left'
                ? 'translateX(-100%)'
                : !isOpen && side === 'right'
                  ? 'translateX(100%)'
                  : 'translateX(0)',
            transition: `max-width ${duration}ms ease, opacity ${duration}ms ease, visibility ${duration}ms ease`,
            visibility: isOpen ? 'visible' : 'hidden',
          }}
          {...animateProps}
        >
          <div className="ui:h-full ui:overflow-hidden">{children}</div>
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
  variant,
  border,
  clamp,
  truncate,
  className,
  children,
  testId = 'sidebar-title',
  ...props
}: SidebarTitleProps) => {
  return (
    <Text
      testId={testId}
      as="h2"
      variant={'heading'}
      className={cn(TextVariants({ variant, border, clamp, truncate }), className)}
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

// ------------ Body component

export type SidebarBodyProps = FlexProps<'div'> & {
  testId?: string;
};

const SidebarBody = ({
  testId = 'sidebar-body',
  direction,
  gap,
  align,
  flexWrap,
  justify,
  className,
  children,
  ...props
}: SidebarBodyProps) => {
  const { isOpen, trapFocus, dismissOnEscape, onOpenChange } = useSidebarContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { moveFocus } = useTrapFocus({ containerRef, loop: trapFocus ?? false });
  useAutoFocus(isOpen, containerRef);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key;

      if (key === 'Escape') {
        e.preventDefault();
        if (dismissOnEscape) {
          onOpenChange?.(false);
        }
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        moveFocus(e.shiftKey ? 'previous' : 'next');
      }
    },
    [dismissOnEscape, moveFocus, onOpenChange]
  );
  return (
    <Flex
      testId={testId}
      ref={containerRef}
      direction={'col'}
      className={cn(
        FlexVariants({ direction, gap, align, flexWrap, justify }),
        'ui:h-full ui:min-h-0 ui:w-[300px] ui:overflow-hidden ui:bg-white',
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </Flex>
  );
};

Sidebar.Body = SidebarBody;
SidebarBody.displayName = 'SidebarBody';

// ------------ Section component

export type SidebarSectionProps = FlexProps<'div'> & {
  testId?: string;
};

const SidebarSection = ({
  testId = 'sidebar-section',
  direction,
  gap,
  align,
  flexWrap,
  justify,
  className,
  children,
  ...props
}: SidebarSectionProps) => {
  return (
    <Flex
      direction={'col'}
      className={cn(FlexVariants({ direction, gap, align, flexWrap, justify }), className)}
      {...props}
    >
      {children}
    </Flex>
  );
};

Sidebar.Section = SidebarSection;
SidebarSection.displayName = 'SidebarSection';

// ------------ Content component

export type SidebarContentProps = FlexProps<'div'> & {
  testId?: string;
};

const SidebarContent = ({
  testId = 'sidebar-content',
  direction,
  gap,
  align,
  flexWrap,
  justify,
  className,
  children,
  ...props
}: SidebarContentProps) => {
  return (
    <Flex
      testId={testId}
      direction={'col'}
      gap={'md'}
      flexWrap="noWrap"
      scrollable
      scrollableProps={{
        direction: 'vertical',
        scrollBar: 'auto',
        smooth: true,
        className: 'ui:h-full',
      }}
      className={cn(
        FlexVariants({ direction, gap, align, flexWrap, justify }),
        'ui:min-h-0 ui:flex-1 ui:p-4',
        className
      )}
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
