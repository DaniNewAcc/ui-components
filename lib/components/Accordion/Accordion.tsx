import useComponentIds from '@/hooks/useComponentIds';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import useRovingFocus from '@/hooks/useRovingFocus';
import { useSyncAnimation } from '@/hooks/useSyncAnimation';
import { cn } from '@/utils/cn';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import Animate from '../Animate';
import { AnimateProps } from '../Animate/Animate';
import Flex from '../Flex';

type ActiveItems = string | number | (string | number)[] | null;

type AccordionProps = ComponentProps<'div'> & {
  items: number;
  defaultValue?: string | number | null;
  multiple?: boolean;
  testId?: string;
  valueKey?: string;
  labelKey?: string;
  loop?: boolean;
  children: ReactNode;
};

type AccordionContextProps = {
  activeItems: ActiveItems;
  isMultiple: boolean;
  isFocused: boolean;
  focusedIndex: string | number | null;
  baseId: string;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  setFocusedIndex: React.Dispatch<React.SetStateAction<string | number | null>>;
  setActiveItems: React.Dispatch<React.SetStateAction<ActiveItems>>;
  setFocusRef: (SetFocusRefProps: { index: string | number; element: HTMLElement | null }) => void;
  handleAccordion: (index: string | number) => void;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
};

const AccordionContext = createContext<AccordionContextProps | null>(null);

const Accordion = ({
  items,
  defaultValue,
  multiple = false,
  loop = true,
  testId = 'accordion',
  className,
  valueKey,
  labelKey,
  children,
  ...props
}: AccordionProps) => {
  const baseId = useId();
  const [activeItems, setActiveItems] = useState<ActiveItems>(
    defaultValue ?? (multiple ? [] : null)
  );

  const { focusedIndex, setFocusedIndex, setFocusRef, moveFocus, moveToStart, moveToEnd } =
    useRovingFocus(defaultValue, loop);

  const [isFocused, setIsFocused] = useState<boolean>(false);

  function handleAccordion(index: string | number) {
    const toggleItem = (prev: ActiveItems, index: string | number) => {
      // toggle items inside of activeItems array
      if (multiple) {
        const prevItems = Array.isArray(prev) ? [...prev] : prev === null ? [] : [prev];
        if (prevItems.includes(index)) {
          return prevItems.filter(item => item !== index);
        } else {
          return [...prevItems, index];
        }
      }
      // toggle item for single mode
      return prev === index ? null : index;
    };

    // update activeItems state
    setActiveItems(prev => toggleItem(prev, index));
  }

  const contextValue = useMemo(
    () => ({
      activeItems,
      focusedIndex,
      valueKey,
      labelKey,
      isMultiple: multiple,
      isFocused,
      baseId,
      setIsFocused,
      setFocusRef,
      setFocusedIndex,
      setActiveItems,
      handleAccordion,
      moveFocus,
      moveToStart,
      moveToEnd,
    }),
    [
      activeItems,
      focusedIndex,
      valueKey,
      labelKey,
      multiple,
      isFocused,
      baseId,
      handleAccordion,
      moveFocus,
      moveToStart,
      moveToEnd,
    ]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        data-testid={testId}
        className={cn('ui:flex ui:w-[250px] ui:flex-col ui:rounded-md ui:shadow-md', className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

Accordion.displayName = 'Accordion';

// Helper function for using Accordion context

function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('Accordion components need to be wrapped into <Accordion>.');
  }

  return context;
}

// ------------ Item component

type AccordionItemContextProps = {
  value: string | number;
  idMap: Record<string, string>;
};

const AccordionItemContext = createContext<AccordionItemContextProps | null>(null);

type AccordionItemProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
  value: string | number;
  headingLevel?: number;
  children: ReactNode;
};

const AccordionItem = forwardRef<React.ElementRef<'div'>, AccordionItemProps>(
  ({ headingLevel = 3, testId = 'accordion-item', value, className, children, ...props }, ref) => {
    const {
      focusedIndex,
      baseId,
      setIsFocused,
      setFocusedIndex,
      setFocusRef,
      handleAccordion,
      moveFocus,
      moveToStart,
      moveToEnd,
    } = useAccordionContext();

    const itemRef = useRef<HTMLDivElement | null>(null);

    const mergedRefs = useMergedRefs(itemRef, ref);

    const idMap = useComponentIds(baseId, [`trigger-${value}`, `content-${value}`]);

    useEffect(() => {
      if (itemRef.current) {
        setFocusRef({ index: value, element: itemRef.current });
      }
    }, [value, focusedIndex, setFocusRef]);

    const handleFocus = useCallback(() => {
      setFocusedIndex(value);
      setIsFocused(true);
    }, [value, setFocusedIndex]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            moveFocus('next');
            break;
          case 'ArrowUp':
            e.preventDefault();
            moveFocus('previous');
            break;
          case 'Home':
            e.preventDefault();
            moveToStart();
            break;
          case 'End':
            e.preventDefault();
            moveToEnd();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            handleAccordion(value);
            break;
          default:
            break;
        }
      },
      [value, handleAccordion, moveFocus, moveToStart, moveToEnd]
    );

    const contextValue = {
      value,
      idMap,
    };

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <div
          data-testid={testId}
          ref={mergedRefs}
          role="heading"
          aria-level={headingLevel}
          tabIndex={0}
          className={cn(
            'ui:relative ui:border-b ui:border-gray-300 ui:first:rounded-t-md ui:last:rounded-b-md ui:focus-within:ring-2 ui:focus-within:ring-primary-500 ui:focus-within:outline-none',
            className
          )}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);

Accordion.Item = AccordionItem;
AccordionItem.displayName = 'AccordionItem';

// Helper function for using AccordionItem context

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error('AccordionItem components need to be wrapped into <AccordionItem>.');
  }

  return context;
}

// ------------ Trigger component

type AccordionTriggerProps = ComponentPropsWithoutRef<'div'> & {
  testId?: string;
  iconProps?: React.ComponentProps<typeof ChevronDownIcon>;
  children: ReactNode;
};

const AccordionTrigger = forwardRef<React.ElementRef<'div'>, AccordionTriggerProps>(
  ({ iconProps, testId = 'accordion-trigger', className, children, ...props }, ref) => {
    const { activeItems, handleAccordion } = useAccordionContext();
    const { value, idMap } = useAccordionItemContext();

    const isOpen = Array.isArray(activeItems) ? activeItems.includes(value) : activeItems === value;
    const triggerId = idMap[`trigger-${value}`];
    const contentId = idMap[`content-${value}`];

    return (
      <Flex
        data-testid={testId}
        ref={ref}
        aria-controls={contentId}
        aria-expanded={isOpen ? 'true' : 'false'}
        id={triggerId}
        align={'center'}
        justify={'between'}
        role="button"
        {...props}
        className={cn('ui:h-10 ui:border-gray-300 ui:px-4 ui:py-2 ui:not-last:border-b', className)}
        onClick={() => handleAccordion(value)}
      >
        {children}
        <ChevronDownIcon
          className={cn(
            'ui:h-5 ui:w-5 ui:transform ui:transition-transform ui:duration-300',
            { 'ui:rotate-180': isOpen },
            iconProps?.className
          )}
          {...iconProps}
        />
      </Flex>
    );
  }
);

Accordion.Trigger = AccordionTrigger;
AccordionTrigger.displayName = 'AccordionTrigger';

// ------------ Content component

type AccordionContentProps = ComponentPropsWithoutRef<'div'> & {
  animateProps?: Partial<AnimateProps>;
  testId?: string;
  children: ReactNode;
};

const AccordionContent = forwardRef<React.ElementRef<'div'>, AccordionContentProps>(
  ({ animateProps, testId = 'accordion-content', className, children, ...props }, ref) => {
    const { activeItems } = useAccordionContext();
    const { value, idMap } = useAccordionItemContext();

    const isOpen = Array.isArray(activeItems) ? activeItems.includes(value) : activeItems === value;
    const triggerId = idMap[`trigger-${value}`];
    const duration = animateProps?.duration ?? 300;

    const {
      ref: animationRef,
      shouldRender,
      maxHeight,
    } = useSyncAnimation({
      isOpen,
      duration,
    });

    const mergedRefs = useMergedRefs(animationRef, ref);

    return (
      <Animate isVisible={isOpen} type={'slideDown'} exitType={'fadeOut'} {...animateProps}>
        {shouldRender && (
          <div
            data-testid={testId}
            ref={mergedRefs}
            aria-hidden={!isOpen ? 'true' : 'false'}
            aria-labelledby={triggerId}
            role="region"
            className={cn('ui:relative ui:overflow-hidden', className)}
            style={{
              maxHeight: `${maxHeight}px`,
              transition: `max-height ${duration}ms ease, opacity ${duration}ms ease, visibility ${duration}ms ease`,
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? 'visible' : 'hidden',
            }}
            {...props}
          >
            <div className="ui:px-4 ui:py-2">{children}</div>
          </div>
        )}
      </Animate>
    );
  }
);

Accordion.Content = AccordionContent;
AccordionContent.displayName = 'AccordionContent';

export default Accordion;
