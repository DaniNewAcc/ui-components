import Trigger, { TriggerProps } from '@components/Trigger';
import { cn } from '@utils/cn';
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
  value?: string | number;
  defaultValues?: string | number | (string | number)[];
  defaultOpen?: boolean;
  multiple?: boolean;
  children: ReactNode;
  onOpenChange?: (open: boolean) => void;
};

export type CollapsibleContextProps = {
  isOpen?: boolean;
  value?: string | number;
  defaultValues?: string | number | (string | number)[];
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const CollapsibleContext = createContext<CollapsibleContextProps | null>(null);

const Collapsible = ({
  testId = 'collapsible',
  isOpen,
  defaultOpen = false,
  multiple,
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

export type CollapsibleItemProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
  value: string | number;
};

export type CollapsibleItemContextProps = {
  value: string | number;
};

const CollapsibleItemContext = createContext<CollapsibleItemContextProps | null>(null);

const CollapsibleItem = ({
  testId = 'collapsible-item',
  value,
  className,
  children,
  ...props
}: CollapsibleItemProps) => {
  const contextValue = useMemo(
    () => ({
      value,
    }),
    [value]
  );
  return (
    <CollapsibleItemContext.Provider value={contextValue}>
      <div data-testid={testId} className={cn('', className)} {...props}>
        {children}
      </div>
    </CollapsibleItemContext.Provider>
  );
};

CollapsibleItem.displayName = 'CollapsibleItem';
Collapsible.Item = CollapsibleItem;

// Helper function for using collapsible item context

export function useCollapsibleItemContext() {
  const context = useContext(CollapsibleItemContext);
  if (!context) {
    throw new Error('CollapsibleItem components must be wrapped in <CollapsibleItem>.');
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
  const { onOpenChange } = useCollapsibleContext();
  const handleClick = useCallback(() => {
    onOpenChange?.(true);
  }, [onOpenChange]);

  // need to add aria attributes for expanded and controls
  return (
    <Trigger testId={testId} onTrigger={handleClick} {...props}>
      {children}
    </Trigger>
  );
};

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
Collapsible.Trigger = CollapsibleTrigger;

// ------------ Content component

export type CollapsibleContentProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
};

const CollapsibleContent = ({
  testId = 'collapsible-content',
  className,
  children,
  ...props
}: CollapsibleContentProps) => {
  return (
    <div data-testid={testId} className={cn('', className)} {...props}>
      {children}
    </div>
  );
};

CollapsibleContent.displayName = 'CollapsibleContent';
Collapsible.Content = CollapsibleContent;

export default Collapsible;
