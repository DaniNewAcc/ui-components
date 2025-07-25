import { cn } from '@/utils/cn';
import { TextVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
import {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import Animate from '../Animate';
import { AnimateProps } from '../Animate/Animate';
import Close, { CloseProps } from '../Close/Close';
import Portal from '../Portal';
import Text from '../Text';

type SidebarSides = 'left' | 'right';

type SidebarProps = {
  containerId?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  side?: SidebarSides;
  dismissOnEscape?: boolean;
  dismissOnClickOutside?: boolean;
  trapFocus?: boolean;
  triggerRef?: RefObject<HTMLElement>;
  children: ReactNode;
  portal?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type SidebarContextProps = Partial<{
  containerId: string;
  isOpen: boolean;
  portal: boolean;
  side: SidebarSides;
  dismissOnClickOutside: boolean;
  dismissOnEscape: boolean;
  trapFocus: boolean;
  triggerRef: RefObject<HTMLElement>;
  onOpenChange: (open: boolean) => void;
}>;

const SidebarContext = createContext<SidebarContextProps | null>(null);

const Sidebar = ({
  isOpen,
  portal = true,
  containerId,
  defaultOpen,
  side = 'right',
  dismissOnEscape = true,
  dismissOnClickOutside = true,
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

function useSidebarContext() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('Sidebar components needs to be wrapped in <Sidebar>.');
  }

  return context;
}

// ------------ Portal component

type SidebarPortalProps = {
  children: ReactNode;
};

const SidebarPortal = ({ children }: SidebarPortalProps) => {
  const { containerId } = useSidebarContext();
  return <Portal containerId={containerId}>{children}</Portal>;
};

// ------------ Frame component

type SidebarFrameProps = ComponentPropsWithoutRef<'aside'> & {
  AnimateProps?: Partial<AnimateProps>;
};

const SidebarFrame = ({ children, ...props }: SidebarFrameProps) => {
  const { isOpen, portal } = useSidebarContext();

  if (!isOpen) return null;

  const content = (
    <Animate isVisible={isOpen}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        aria-describedby="sidebar-desc"
        {...props}
      >
        {children}
      </aside>
    </Animate>
  );

  return portal ? <SidebarPortal>{content}</SidebarPortal> : content;
};

Sidebar.Frame = SidebarFrame;
SidebarFrame.displayName = 'SidebarFrame';

// ------------ Overlay component

const SidebarOverlay = () => {};

Sidebar.Overlay = SidebarOverlay;
SidebarOverlay.displayName = 'SidebarOverlay';

// ------------ Header component

const SidebarHeader = () => {};

Sidebar.Header = SidebarHeader;
SidebarHeader.displayName = 'SidebarHeader';

// ------------ Title component

type SidebarTitleProps = ComponentPropsWithoutRef<'h2'> &
  VariantProps<typeof TextVariants> & {
    testId?: string;
  };

const SidebarTitle = ({ className, children, testId, variant, ...props }: SidebarTitleProps) => {
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

type SidebarCloseProps = Omit<CloseProps, 'onClose'>;

const SidebarClose = ({ className, testId = 'sidebar-close', ...props }: SidebarCloseProps) => {
  const { side, onOpenChange } = useSidebarContext();

  const handleClose = useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  return (
    <Close
      testId={testId}
      ariaLabel="Close sidebar"
      className={cn(
        'ui:absolute ui:top-4',
        side === 'left' ? 'ui:left-4' : 'ui:right-4',
        className
      )}
      onClose={handleClose}
      {...props}
    />
  );
};

Sidebar.Close = SidebarClose;
SidebarClose.displayName = 'SidebarClose';

// ------------ Content component

const SidebarContent = () => {};

Sidebar.Content = SidebarContent;
SidebarContent.displayName = 'SidebarContent';

// ------------ Footer component

const SidebarFooter = () => {};

Sidebar.Footer = SidebarFooter;
SidebarFooter.displayName = 'SidebarFooter';

export default Sidebar;
