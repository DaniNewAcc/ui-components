import useFocusVisible from '@/hooks/useFocusVisible';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
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

type TabbingDirection = 'forward' | 'backward' | null;

type TabsProps = ComponentProps<'div'> &
  VariantProps<typeof TabsVariants> & {
    defaultValue: number | string;
    testId?: string;
    valueKey?: string;
    labelKey?: string;
    orientation?: Orientation;
    children: ReactNode;
    hasPadding?: boolean;
    loop?: boolean;
  };

type TabsContextProps = {
  activeTab: number | string;
  focusedIndex: number | string | null;
  orientation?: Orientation;
  hasPadding?: boolean;
  tabbingDirection: TabbingDirection;
  inputMode: string;
  panelRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setActiveTab: React.Dispatch<React.SetStateAction<number | string>>;
  setTabbingDirection: React.Dispatch<React.SetStateAction<TabbingDirection>>;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number | string | null>>;
  setFocusRef: (SetFocusRefProps: { index: number | string; element: HTMLElement | null }) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);

const Tabs = ({
  defaultValue,
  testId,
  valueKey,
  labelKey,
  loop = true,
  orientation = 'horizontal',
  hasPadding,
  selfAlign,
  className,
  children,
  ...props
}: TabsProps) => {
  const { setFocusRef, moveFocus, moveToStart, moveToEnd, focusedIndex, setFocusedIndex } =
    useRovingFocus(null, loop);
  const inputMode = useKeyboardNavigation();
  const [activeTab, setActiveTab] = useState<number | string>(defaultValue);
  const [tabbingDirection, setTabbingDirection] = useState<TabbingDirection>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (focusedIndex !== null) {
      setActiveTab(focusedIndex);
    }
  }, [focusedIndex]);

  useEffect(() => {
    if (tabbingDirection !== null) {
      const timeout = setTimeout(() => setTabbingDirection(null), 10);
      return () => clearTimeout(timeout);
    }
  }, [tabbingDirection]);

  const contextValue = {
    activeTab: activeTab,
    focusedIndex,
    hasPadding,
    panelRefs,
    orientation,
    tabbingDirection,
    inputMode,
    setTabbingDirection,
    setActiveTab,
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
          `${orientation === 'vertical' ? 'ui:flex-row ui:gap-0' : 'ui:flex-col'}`,
          className
        )}
        {...props}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

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
    setTabbingDirection,
  } = useTabsContext();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Home': {
          e.preventDefault();
          setTabbingDirection(null);
          moveToStart();
          break;
        }
        case 'End': {
          e.preventDefault();
          setTabbingDirection(null);
          moveToEnd();
          break;
        }
        case 'Tab': {
          setTabbingDirection(e.shiftKey ? 'backward' : 'forward');
          break;
        }
      }
      switch (orientation) {
        case 'horizontal': {
          switch (e.key) {
            case 'ArrowRight': {
              e.preventDefault();
              setTabbingDirection(null);
              moveFocus('next');
              break;
            }
            case 'ArrowLeft': {
              e.preventDefault();
              setTabbingDirection(null);
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
              setTabbingDirection(null);
              moveFocus('next');
              break;
            case 'ArrowUp':
              e.preventDefault();
              setTabbingDirection(null);
              moveFocus('previous');
              break;
          }
          break;
        }
      }
    },
    [panelRefs, activeTab, setTabbingDirection, moveFocus, moveToStart, moveToEnd]
  );

  return (
    <div
      data-testid={testId}
      role="tablist"
      aria-activedescendant={`trigger-${activeTab}`}
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

Tabs.List = TabsList;
TabsList.displayName = 'TabsList';

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
    orientation,
    inputMode,
    setActiveTab,
    setFocusedIndex,
    setTabbingDirection,
    setFocusRef,
  } = useTabsContext();
  const triggerId = `trigger-${value}`;
  const contentId = `content-${value}`;
  const isActive = activeTab === value;
  const isFocused = focusedIndex === value;
  const isFirst = isActive && focusedIndex === null;
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { isFocusVisible, handleBlur, handleFocus, handleMouseDown } = useFocusVisible(inputMode);

  const handleClick = useCallback(() => {
    if (disabled) return;
    setActiveTab(value);
    setFocusedIndex(value);
    setTabbingDirection(null);
  }, [disabled, setActiveTab, setFocusedIndex, setTabbingDirection, value]);

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
      aria-expanded={isActive}
      aria-selected={isActive}
      id={triggerId}
      role="tab"
      tabIndex={disabled ? -1 : isFocused || isFirst ? 0 : -1}
      className={cn(
        ButtonVariants({ variant, size, intent, rounded }),
        {
          'ui:bg-primary-50 ui:text-primary-600':
            (isFocused && inputMode === 'keyboard') || isActive,
          'ui:focus-visible:border-primary-600': isFocusVisible,
          'ui:focus-visible:ring-0': !isFocusVisible,
          'ui:first:rounded-l-sm ui:last:rounded-r-sm': hasPadding,
          [`ui:last:${orientation === 'vertical' ? 'rounded-bl-md' : 'rounded-tr-sm'}`]: true,
        },
        'ui:flex-1 ui:first:rounded-tl-sm',
        className
      )}
      onBlur={handleBlur}
      onClick={handleClick}
      onFocus={handleFocus}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {children}
    </Button>
  );
};

Tabs.Trigger = TabsTrigger;
TabsTrigger.displayName = 'TabsTrigger';

// ------------ Content component

type TabsContentProps = ComponentProps<'div'> & {
  value: number | string;
  children: ReactNode;
};

const TabsContent = ({ value, className, children, ...props }: TabsContentProps) => {
  const { activeTab, focusedIndex, orientation } = useTabsContext();
  const triggerId = `trigger-${value}`;
  const contentId = `content-${value}`;
  const isActive = activeTab === value;
  const isFocused = focusedIndex === value;
  const panelRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {isActive ? (
        <div
          ref={panelRef}
          aria-hidden={!isActive}
          aria-labelledby={triggerId}
          aria-live="polite"
          hidden={!isActive}
          role="tabpanel"
          id={contentId}
          tabIndex={0}
          className={cn(
            {
              'ui:w-[250px] ui:px-4': orientation === 'vertical',
              'ui:z-10': isActive && isFocused,
            },
            'ui:flex-1 ui:overflow-y-auto',
            className
          )}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

Tabs.Content = TabsContent;
TabsContent.displayName = 'TabsContent';

export default Tabs;
