import useRovingFocus from '@/hooks/useRovingFocus';
import { cn } from '@/utils/cn';
import { ButtonVariants, TabsListVariants, TabsVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
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

type Orientation = 'horizontal' | 'vertical';

type TabsProps = ComponentProps<'div'> &
  VariantProps<typeof TabsVariants> & {
    defaultValue: number | string;
    testId?: string;
    valueKey?: string;
    labelKey?: string;
    orientation?: Orientation;
    children: ReactNode;
    hasPadding?: boolean;
  };

type TabsContextProps = {
  activeTab: number | string;
  focusedIndex: number | string | null;
  orientation?: Orientation;
  hasPadding?: boolean;
  isTabbing: boolean;
  panelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setActiveTab: React.Dispatch<React.SetStateAction<number | string>>;
  setIsTabbing: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number | string | null>>;
  setFocusRef: (SetFocusRefProps: { index: number | string; element: HTMLElement | null }) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);

const Tabs = ({
  defaultValue,
  testId,
  valueKey,
  labelKey,
  orientation = 'horizontal',
  hasPadding,
  selfAlign,
  className,
  children,
  ...props
}: TabsProps) => {
  const { setFocusRef, moveFocus, moveToStart, moveToEnd, focusedIndex, setFocusedIndex } =
    useRovingFocus();
  const [activeTab, setActiveTab] = useState<number | string>(defaultValue);
  const [isTabbing, setIsTabbing] = useState<boolean>(false);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const contextValue = {
    activeTab: activeTab,
    focusedIndex,
    hasPadding,
    isTabbing,
    panelRefs,
    orientation,
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
      <div
        data-testid={testId}
        className={cn(
          TabsVariants({ hasPadding, selfAlign }),
          `${orientation === 'vertical' ? 'ui:flex-row' : 'ui:flex-col'}`,
          className
        )}
        {...props}
      >
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

type TabsListProps = ComponentProps<'div'> &
  VariantProps<typeof TabsListVariants> & {
    children: ReactNode;
    testId?: string;
  };

const TabsList = ({ variant, className, children, testId, ...props }: TabsListProps) => {
  const {
    activeTab,
    hasPadding,
    panelRefs,
    orientation,
    moveFocus,
    moveToStart,
    moveToEnd,
    setIsTabbing,
  } = useTabsContext();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
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
          setIsTabbing(true);
          break;
        }
      }
      switch (orientation) {
        case 'horizontal': {
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
          }
          break;
        }
        case 'vertical': {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault();
              setIsTabbing(false);
              moveFocus('next');
              break;
            case 'ArrowUp':
              e.preventDefault();
              setIsTabbing(false);
              moveFocus('previous');
              break;
          }
          break;
        }
      }
    },
    [panelRefs, activeTab, setIsTabbing, moveFocus, moveToStart, moveToEnd]
  );

  return (
    <div
      data-testid={testId}
      role="tablist"
      aria-activedescendant={`tab-${activeTab}`}
      aria-orientation={orientation}
      aria-label="Tabs"
      className={cn(
        TabsListVariants({ variant }),
        `${hasPadding ? 'ui:rounded-md ui:px-2 ui:py-2' : 'ui:rounded-t-md ui:bg-transparent'}`,
        `${orientation === 'vertical' ? 'ui:flex-col' : 'ui:flex-row'}`,
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
    value: number | string;
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
  const isFirst = isActive && focusedIndex === null;

  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = useCallback(() => {
    if (disabled) return;
    setActiveTab(value);
    setFocusedIndex(value);
    setIsTabbing(true);
  }, [disabled, setActiveTab, setFocusedIndex, setIsTabbing, value]);

  const handleFocus = useCallback(() => {
    if (!disabled) {
      if (focusedIndex === null) {
        setFocusedIndex(value);
      }
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
      tabIndex={disabled ? -1 : isFocused || isFirst ? 0 : -1}
      className={cn(
        ButtonVariants({ variant, size, intent, rounded }),
        {
          'ui:bg-primary-50 ui:text-primary-600': isFocused || isActive,
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
  value: number | string;
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
    panelRefs.current[Number(activeTab)] = panelRef.current;
    if (isActive && isFocused && isTabbing && panelRef.current) {
      setTimeout(() => {
        panelRef.current?.focus();
      }, 0);
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
