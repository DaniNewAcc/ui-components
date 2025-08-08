import Trigger, { TriggerProps } from '@components/Trigger';
import {
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export type CollapsibleProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
  isOpen?: boolean;
  defaultOpen?: boolean;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type CollapsibleContextProps = {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CollapsibleContext = createContext<CollapsibleContextProps | null>(null);

const Collapsible = ({
  testId = 'collapsible',
  isOpen,
  defaultOpen = false,
  children,
  onOpenChange,
  ...props
}: CollapsibleProps) => {
  const isControlled = isOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const actualIsOpen = isControlled ? isOpen : internalOpen;

  // handles the open state updates based on the control mode: uncontrolled (internalOpen) or controlled (isOpen)
  const onOpenChangeHandler = useCallback(
    (newVal: boolean) => {
      if (!isControlled) {
        setInternalOpen(newVal);
      } else {
        onOpenChange?.(newVal);
      }
    },
    [isControlled, onOpenChange]
  );

  const contextValue = useMemo(
    () => ({ isOpen: actualIsOpen, defaultOpen, onOpenChange: onOpenChangeHandler }),
    [isOpen, defaultOpen, onOpenChange]
  );
  return (
    <CollapsibleContext.Provider value={contextValue}>
      <div data-testid={testId} {...props}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
};

Collapsible.displayName = 'Collapsible';

// Helper function for using collapsible context

export function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be wrapped in <Collapsible>.');
  }
  return context;
}

// ------------ Trigger component

export type CollapsibleTriggerProps = TriggerProps<HTMLElement> & {
  testId?: string;
};

const CollapsibleTrigger = ({
  testId = 'collapsible-trigger',
  children,
  ...props
}: CollapsibleTriggerProps) => {
  // need to add aria attributes for expanded and controls
  return (
    <Trigger testId={testId} {...props}>
      {children}
    </Trigger>
  );
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
Collapsible.Trigger = CollapsibleTrigger;

export default Collapsible;
