import { ComponentProps, createContext, ReactNode, RefObject, useContext } from 'react';

type SidebarSides = 'left' | 'right';

type SidebarProps = ComponentProps<'aside'> & {
  testId?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  side?: SidebarSides;
  dismissOnEscape?: boolean;
  dismissOnClickOutside?: boolean;
  trapFocus?: boolean;
  triggerRef?: RefObject<HTMLElement>;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

type SidebarContextProps = Partial<{
  isOpen: boolean;
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
  defaultOpen,
  side = 'right',
  dismissOnEscape = true,
  dismissOnClickOutside = true,
  trapFocus = true,
  triggerRef,
  testId,
  children,
  onOpenChange,
  ...props
}: SidebarProps) => {
  const contextValue = {
    isOpen,
    side,
    dismissOnClickOutside,
    dismissOnEscape,
    trapFocus,
    triggerRef,
    onOpenChange,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <aside data-testid={testId} {...props}>
        {children}
      </aside>
    </SidebarContext.Provider>
  );
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

export default Sidebar;
