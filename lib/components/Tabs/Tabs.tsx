import useComponentIds from '@/hooks/useComponentIds';
import useFocusVisible from '@/hooks/useFocusVisible';
import useKeyboardNavigation from '@/hooks/useKeyboardNavigation';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import useRovingFocus from '@/hooks/useRovingFocus';
import { cn } from '@/utils/cn';
import { ButtonVariants, TabsListVariants, TabsVariants } from '@/utils/variants';
import { VariantProps } from 'class-variance-authority';
import React, {
  Children,
  ComponentProps,
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  idMap: Record<string, string>;
  setActiveTab: React.Dispatch<React.SetStateAction<number | string>>;
  setTabbingDirection: React.Dispatch<React.SetStateAction<TabbingDirection>>;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number | string | null>>;
  setFocusRef: (SetFocusRefProps: { index: number | string; element: HTMLElement | null }) => void;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
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

  const idKeys = useMemo(() => {
    const values = Children.toArray(children)
      .filter(React.isValidElement)
      .filter(child => child.type === Tabs.Trigger || child.type === Tabs.Content)
      .map(child => (child.props as any).value)
      .filter((v): v is number | string => v !== undefined && v !== null);

    return ['list', ...values.map(v => `trigger-${v}`), ...values.map(v => `content-${v}`)];
  }, [children]);

  const idMap = useComponentIds('tabs', idKeys);

  const contextValue = useMemo(
    () => ({
      hasPadding,
      orientation,
      activeTab,
      focusedIndex,
      tabbingDirection,
      panelRefs,
      inputMode,
      idMap,
      setTabbingDirection,
      setActiveTab,
      setFocusRef,
      setFocusedIndex,
      moveFocus,
      moveToStart,
      moveToEnd,
    }),
    [
      hasPadding,
      orientation,
      activeTab,
      focusedIndex,
      tabbingDirection,
      inputMode,
      idMap,
      setTabbingDirection,
      setActiveTab,
      setFocusRef,
      setFocusedIndex,
      moveFocus,
      moveToStart,
      moveToEnd,
    ]
  );
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

type TabsListProps = ComponentPropsWithoutRef<'div'> &
  VariantProps<typeof TabsListVariants> & {
    children: ReactNode;
    testId?: string;
  };

const TabsList = forwardRef<React.ElementRef<'div'>, TabsListProps>(
  ({ variant, className, children, testId, ...props }, ref) => {
    const {
      activeTab,
      hasPadding,
      orientation,
      idMap,
      moveFocus,
      moveToStart,
      moveToEnd,
      setTabbingDirection,
    } = useTabsContext();
    const timeoutRef = useRef<number | null>(null);

    const handleHorizontalKeyDown = useCallback(
      (key: string, e: React.KeyboardEvent) => {
        if (key === 'ArrowRight') {
          e.preventDefault();
          setTabbingDirection(null);
          moveFocus('next');
        } else if (key === 'ArrowLeft') {
          e.preventDefault();
          setTabbingDirection(null);
          moveFocus('previous');
        }
      },
      [moveFocus]
    );

    const handleVerticalKeyDown = useCallback(
      (key: string, e: React.KeyboardEvent) => {
        if (key === 'ArrowDown') {
          e.preventDefault();
          setTabbingDirection(null);
          moveFocus('next');
        } else if (key === 'ArrowUp') {
          e.preventDefault();
          setTabbingDirection(null);
          moveFocus('previous');
        }
      },
      [moveFocus]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const key = e.key;

        switch (key) {
          case 'Home':
            e.preventDefault();
            setTabbingDirection(null);
            moveToStart();
            return;
          case 'End':
            e.preventDefault();
            setTabbingDirection(null);
            moveToEnd();
            return;
          case 'Tab':
            setTabbingDirection(e.shiftKey ? 'backward' : 'forward');
            if (timeoutRef.current !== null) {
              window.clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = window.setTimeout(() => {
              setTabbingDirection(null);
              timeoutRef.current = null;
            }, 10);
            return;
        }

        if (orientation === 'horizontal') {
          handleHorizontalKeyDown(key, e);
        } else if (orientation === 'vertical') {
          handleVerticalKeyDown(key, e);
        }
      },
      [
        orientation,
        handleHorizontalKeyDown,
        handleVerticalKeyDown,
        moveFocus,
        moveToStart,
        moveToEnd,
      ]
    );

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        data-testid={testId}
        ref={ref}
        id={idMap['list']}
        aria-activedescendant={idMap[`trigger-${activeTab}`]}
        aria-label="Tabs"
        aria-orientation={orientation}
        role="tablist"
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
  }
);

Tabs.List = TabsList;
TabsList.displayName = 'TabsList';

// ------------ Trigger component

type TabsTriggerProps = ComponentPropsWithoutRef<'button'> &
  VariantProps<typeof ButtonVariants> & {
    disabled?: boolean;
    value: number | string;
    children: ReactNode;
  };

const TabsTrigger = forwardRef<React.ElementRef<'button'>, TabsTriggerProps>(
  ({ disabled, variant, size, intent, rounded, value, className, children, ...props }, ref) => {
    const {
      activeTab,
      focusedIndex,
      hasPadding,
      orientation,
      inputMode,
      idMap,
      setActiveTab,
      setFocusedIndex,
      setTabbingDirection,
      setFocusRef,
    } = useTabsContext();
    const triggerId = idMap[`trigger-${value}`] ?? `trigger-${value}`;
    const contentId = idMap[`content-${value}`] ?? `content-${value}`;
    const isActive = activeTab === value;
    const isFocused = focusedIndex === value;
    const isFirst = isActive && focusedIndex === null;
    const { isFocusVisible, handleBlur, handleFocus, handleMouseDown } = useFocusVisible(inputMode);

    const handleClick = useCallback(() => {
      if (disabled) return;
      setActiveTab(value);
      setFocusedIndex(value);
      setTabbingDirection(null);
    }, [disabled, value]);

    const handleInternalFocus = useCallback(() => {
      handleFocus();

      if (!isFocused || !isActive) {
        setFocusedIndex(value);
        setActiveTab(value);
      }
    }, [handleFocus, isFocused, isActive, value]);

    const triggerRefCallback = useCallback(
      (node: HTMLButtonElement | null) => {
        setFocusRef({ index: value, element: node });
      },
      [setFocusRef, value]
    );

    const mergedRefs = useMergedRefs(triggerRefCallback, ref);

    return (
      <Button
        ref={mergedRefs}
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
            [`${orientation === 'vertical' ? 'ui:last:rounded-bl-md' : 'ui:last:rounded-tr-sm'}`]:
              true,
          },
          'ui:flex-1 ui:first:rounded-tl-sm',
          className
        )}
        onBlur={handleBlur}
        onClick={handleClick}
        onFocus={handleInternalFocus}
        onMouseDown={handleMouseDown}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

Tabs.Trigger = TabsTrigger;
TabsTrigger.displayName = 'TabsTrigger';

// ------------ Content component

type TabsContentProps = ComponentPropsWithoutRef<'div'> & {
  value: number | string;
  children: ReactNode;
};

const TabsContent = forwardRef<React.ElementRef<'div'>, TabsContentProps>(
  ({ value, className, children, ...props }, ref) => {
    const { activeTab, focusedIndex, orientation, idMap } = useTabsContext();
    const triggerId = idMap[`trigger-${value}`] ?? `trigger-${value}`;
    const contentId = idMap[`content-${value}`] ?? `content-${value}`;
    const isActive = activeTab === value;
    const isFocused = focusedIndex === value;
    const panelRef = useRef<HTMLDivElement | null>(null);
    const mergedRefs = useMergedRefs(panelRef, ref);

    return (
      <>
        {isActive ? (
          <div
            ref={mergedRefs}
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
  }
);

Tabs.Content = TabsContent;
TabsContent.displayName = 'TabsContent';

export default Tabs;
