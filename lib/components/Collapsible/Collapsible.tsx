import Trigger, { TriggerProps } from '@components/Trigger';
import { cn } from '@utils/cn';
import {
  forwardRefWithAs,
  PolymorphicComponent,
  PolymorphicProps,
  PolymorphicRef,
} from '@utils/types';
import {
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
} from 'react';

type ActiveItems = string | number | (string | number)[] | null;

export type CollapsibleProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
  value?: ActiveItems;
  defaultValue?: ActiveItems;
  multiple?: boolean;
  children: ReactNode;
  onValueChange?: (value: ActiveItems) => void;
};

export type CollapsibleContextProps = {
  activeItems: ActiveItems;
  value?: ActiveItems;
  multiple?: boolean;
  baseId?: string;
  toggleItems?: (item: string | number) => void;
};

const CollapsibleContext = createContext<CollapsibleContextProps | null>(null);

const CollapsibleRoot = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    { testId = 'collapsible', value, defaultValue, multiple, children, onValueChange, ...props },
    ref
  ) => {
    const baseId = useId();
    const isControlled = value !== undefined;
    const [internalActiveItems, setInternalActiveItems] = useState<ActiveItems>(() => {
      // initialize activeItems based on default value and multiple mode
      if (multiple) {
        if (defaultValue === undefined) return [];
        return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      }
      return defaultValue ?? null;
    });
    const actualActiveItems = isControlled ? value : internalActiveItems;

    // handles collapsible item content toggling through if statement based on multiple prop
    const toggleItems = useCallback(
      (item: string | number) => {
        const current = Array.isArray(actualActiveItems)
          ? actualActiveItems
          : actualActiveItems !== null
            ? [actualActiveItems]
            : [];

        let newItems: ActiveItems;

        if (multiple) {
          const updated = current.includes(item)
            ? current.filter(i => i !== item)
            : [...current, item];

          newItems = updated.filter((i): i is string | number => i !== undefined);
        } else {
          newItems = current.includes(item) ? null : item;
        }

        if (isControlled) {
          onValueChange?.(newItems);
        } else {
          setInternalActiveItems(newItems);
        }
      },
      [actualActiveItems, multiple, isControlled, onValueChange]
    );

    const contextValue = useMemo(
      () => ({
        activeItems: actualActiveItems,
        multiple,
        baseId,
        toggleItems,
      }),
      [actualActiveItems, multiple, baseId, toggleItems]
    );
    return (
      <CollapsibleContext.Provider value={contextValue}>
        <div data-testid={testId} ref={ref} {...props}>
          {children}
        </div>
      </CollapsibleContext.Provider>
    );
  }
);

CollapsibleRoot.displayName = 'Collapsible';

// Helper function for using collapsible context

export function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible components must be wrapped in <Collapsible>.');
  }
  return context;
}

// ------------ Item component

export type CollapsibleOwnItemProps = {
  testId?: string;
  value: string | number;
  disabled?: boolean;
};

export type CollapsibleItemContextProps = {
  value: string | number;
  disabled?: boolean;
  triggerId: string;
  contentId: string;
};

const CollapsibleItemContext = createContext<CollapsibleItemContextProps | null>(null);

export type CollapsibleItemComponent = <C extends React.ElementType = 'div'>(
  props: PolymorphicComponent<C, CollapsibleOwnItemProps> & {
    ref?: PolymorphicRef<C>;
  }
) => React.ReactElement | null;

const CollapsibleItemImpl = <C extends React.ElementType = 'div'>(
  {
    as,
    testId = 'collapsible-item',
    value,
    disabled,
    className,
    children,
    ...props
  }: PolymorphicProps<C, CollapsibleOwnItemProps>,
  ref: PolymorphicRef<C>
) => {
  const Tag = as || 'div';
  const { baseId } = useCollapsibleContext();
  const triggerId = `${baseId}-trigger-${value}`;
  const contentId = `${baseId}-content-${value}`;

  const contextValue = useMemo(
    () => ({ value, disabled, triggerId, contentId }),
    [value, disabled]
  );

  return (
    <CollapsibleItemContext.Provider value={contextValue}>
      <Tag data-testid={testId} ref={ref} className={cn('', className)} {...props}>
        {children}
      </Tag>
    </CollapsibleItemContext.Provider>
  );
};

const CollapsibleItem = forwardRefWithAs(
  CollapsibleItemImpl,
  'Collapsible.Item'
) as CollapsibleItemComponent;

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

const CollapsibleTrigger = forwardRef<HTMLElement, CollapsibleTriggerProps>(
  ({ testId = 'collapsible-trigger', children, ...props }, ref) => {
    const { activeItems, toggleItems } = useCollapsibleContext();
    const { value, disabled, triggerId, contentId } = useCollapsibleItemContext();

    const isActive = Array.isArray(activeItems)
      ? activeItems.includes(value)
      : activeItems === value;

    const handleClick = useCallback(() => {
      if (disabled) return;
      toggleItems?.(value);
    }, [toggleItems, value, disabled]);

    return (
      <Trigger
        ref={ref}
        testId={testId}
        id={triggerId}
        aria-controls={contentId}
        aria-expanded={isActive}
        onTrigger={handleClick}
        {...props}
      >
        {children}
      </Trigger>
    );
  }
);

CollapsibleTrigger.displayName = 'Collapsible.Trigger';

// ------------ Content component

export type CollapsibleContentProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
};

const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ testId = 'collapsible-content', className, children, ...props }, ref) => {
    const { activeItems } = useCollapsibleContext();
    const { value, triggerId, contentId } = useCollapsibleItemContext();

    const isActive = Array.isArray(activeItems)
      ? activeItems.includes(value)
      : activeItems === value;

    return (
      <div
        ref={ref}
        data-testid={testId}
        role="region"
        id={contentId}
        aria-labelledby={triggerId}
        aria-hidden={!isActive}
        hidden={!isActive}
        className={cn('', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CollapsibleContent.displayName = 'Collapsible.Content';

interface CollapsibleCompoundComponent
  extends ForwardRefExoticComponent<CollapsibleProps & RefAttributes<HTMLDivElement>> {
  Item: typeof CollapsibleItem;
  Trigger: typeof CollapsibleTrigger;
  Content: typeof CollapsibleContent;
}

const Collapsible = CollapsibleRoot as CollapsibleCompoundComponent;
Collapsible.Item = CollapsibleItem;
Collapsible.Trigger = CollapsibleTrigger;
Collapsible.Content = CollapsibleContent;

export default Collapsible;
