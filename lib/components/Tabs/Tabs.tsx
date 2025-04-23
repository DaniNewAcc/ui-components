import useRovingFocus from '@/hooks/useRovingFocus';
import { cn } from '@/utils/cn';
import { cva, VariantProps } from 'class-variance-authority';
import React, {
  ComponentProps,
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Button from '../Button';
import { ButtonVariants } from '../Button/Button';

const TabsVariants = cva(
  'ui:flex ui:w-fit ui:flex-col ui:justify-between ui:gap-4 ui:rounded-md ui:shadow-md',
  {
    variants: {
      hasPadding: {
        true: 'ui:p-4',
      },
    },
    defaultVariants: {
      hasPadding: false,
    },
  }
);

type TabsProps = ComponentProps<'div'> &
  VariantProps<typeof TabsVariants> & {
    defaultValue: number;
    tabs: number;
    testId?: string;
    children: ReactNode;
    hasPadding?: boolean;
  };

type TabsContextProps = {
  activeTab: number;
  focusedIndex: number;
  tabs: number;
  hasPadding?: boolean;
  isTabbing: boolean;
  panelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  setIsTabbing: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  setFocusRef: (SetFocusRefProps: { index: number; element: HTMLElement | null }) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);

const Tabs = ({
  defaultValue,
  tabs,
  testId,
  hasPadding,
  className,
  children,
  ...props
}: TabsProps) => {
  const { setFocusRef, moveFocus, moveToStart, moveToEnd, focusedIndex, setFocusedIndex } =
    useRovingFocus(tabs);
  const [activeTab, setActiveTab] = useState<number>(defaultValue);
  const [isTabbing, setIsTabbing] = useState<boolean>(false);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const contextValue = {
    activeTab: activeTab,
    focusedIndex,
    tabs,
    hasPadding,
    isTabbing,
    panelRefs,
    setActiveTab,
    setIsTabbing,
    setFocusRef,
    setFocusedIndex,
    moveFocus,
    moveToStart,
    moveToEnd,
  };
  return (
    <TabsContext.Provider value={contextValue}>
      <div data-testid={testId} className={cn(TabsVariants({ hasPadding }), className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// helper function for using Tabs context

function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tabs components need to be wrapped into <Tabs>.');
  }

  return context;
}

// ------------ List component

const TabsListVariants = cva(
  'ui:inline-flex ui:w-fit ui:shrink-0 ui:items-center ui:justify-center ui:bg-transparent',
  {
    variants: {
      variant: {
        default: '',
        spaced: 'ui:gap-2 ui:bg-primary-300 ui:[&>button]:rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

type TabsListProps = ComponentProps<'div'> &
  VariantProps<typeof TabsListVariants> & {
    children: ReactNode;
  };

const TabsList = ({ variant, className, children, ...props }: TabsListProps) => {
  const { activeTab, hasPadding, panelRefs, moveFocus, moveToStart, moveToEnd, setIsTabbing } =
    useTabsContext();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight': {
          e.preventDefault();
          setIsTabbing(false);
          moveFocus('next');
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          setIsTabbing(false);
          moveFocus('previous');
          break;
        }
        case 'Home': {
          e.preventDefault();
          setIsTabbing(false);
          moveToStart();
          break;
        }
        case 'End': {
          e.preventDefault();
          setIsTabbing(false);
          moveToEnd();
          break;
        }
        case 'Tab': {
          e.preventDefault();
          setIsTabbing(true);
          panelRefs.current[activeTab]?.focus();
          break;
        }
      }
    },
    [panelRefs, activeTab, setIsTabbing, moveFocus, moveToStart, moveToEnd]
  );

  return (
    <div
      role="tablist"
      aria-activedescendant={`tab-${activeTab}`}
      aria-orientation="horizontal"
      aria-label="Tabs"
      className={cn(
        TabsListVariants({ variant }),
        `${hasPadding ? 'ui:rounded-md ui:px-2 ui:py-2' : 'ui:rounded-t-md ui:bg-transparent'}`,
        className
      )}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};

// ------------ Trigger component

type TabsTriggerProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof ButtonVariants> & {
    disabled?: boolean;
    value: number;
    children: ReactNode;
  };

const TabsTrigger = ({
  disabled,
  variant,
  size,
  intent,
  rounded,
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) => {
  const {
    activeTab,
    focusedIndex,
    hasPadding,
    setActiveTab,
    setFocusedIndex,
    setIsTabbing,
    setFocusRef,
  } = useTabsContext();
  const triggerId = `trigger-${value}`;
  const contentId = `content-${value}`;
  const isActive = activeTab === value;
  const isFocused = focusedIndex === value;

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = useCallback(() => {
    if (disabled) return;
    setActiveTab(value);
    setFocusedIndex(value);
    setIsTabbing(true);
  }, [disabled, setActiveTab, setFocusedIndex, setIsTabbing, value]);

  const handleFocus = useCallback(() => {
    if (!disabled) {
      setActiveTab(value);
    }
  }, [disabled, setActiveTab, value]);

  useEffect(() => {
    if (triggerRef.current) {
      setFocusRef({ index: value, element: triggerRef.current });
    }
  }, [setFocusRef, value]);

  return (
    <Button
      ref={triggerRef}
      type="button"
      variant={'unstyled'}
      size={'sm'}
      aria-controls={contentId}
      aria-disabled={disabled}
      aria-selected={isActive}
      disabled={disabled}
      id={triggerId}
      role="tab"
      tabIndex={disabled ? -1 : isFocused ? 0 : -1}
      className={cn(
        ButtonVariants({ variant, size, intent, rounded }),
        {
          'ui:bg-primary-50 ui:text-primary-600': isFocused,
          'ui:first:rounded-l-sm ui:last:rounded-r-sm': hasPadding,
        },
        'ui:flex-1 ui:first:rounded-tl-sm ui:last:rounded-tr-sm',
        className
      )}
      onClick={handleClick}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </Button>
  );
};

// ------------ Content component

type TabsContentProps = ComponentProps<'div'> & {
  value: number;
  children: ReactNode;
};

const TabsContent = ({ value, className, children, ...props }: TabsContentProps) => {
  const { panelRefs, activeTab, isTabbing, focusedIndex, setIsTabbing } = useTabsContext();
  const triggerId = `trigger-${value}`;
  const contentId = `panel-${value}`;
  const isActive = activeTab === value;
  const isFocused = focusedIndex === value;

  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    panelRefs.current[activeTab] = panelRef.current;
    if (isActive && isFocused && isTabbing && panelRef.current) {
      panelRef.current.focus();
    }
  }, [panelRefs, activeTab, isFocused, isActive, isTabbing]);

  const handleFocus = useCallback(() => {
    setIsTabbing(false);
  }, [setIsTabbing]);

  return (
    <>
      {isActive ? (
        <div
          ref={panelRef}
          aria-labelledby={triggerId}
          hidden={!isActive}
          role="tabpanel"
          id={contentId}
          tabIndex={0}
          className={cn('ui:flex', className)}
          onFocus={handleFocus}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
