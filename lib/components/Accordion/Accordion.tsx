import useRovingFocus from '@/hooks/useRovingFocus';
import { cn } from '@/utils/cn';
import {
  ComponentProps,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Flex from '../Flex';

type AccordionProps = ComponentProps<'div'> & {
  items: number;
  defaultValue?: number | number[];
  multiple?: boolean;
  testId?: string;
  children: ReactNode;
};

type AccordionContextProps = {
  items: number;
  activeItems: number[] | number | null;
  isMultiple: boolean;
  focusedIndex: number;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveItems: React.Dispatch<React.SetStateAction<number | number[] | null>>;
  setFocusRef: (SetFocusRefProps: { index: number; element: HTMLElement | null }) => void;
  handleAccordion: (index: number) => void;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
};

const AccordionContext = createContext<AccordionContextProps | null>(null);

const Accordion = ({
  items,
  defaultValue,
  multiple = false,
  testId,
  className,
  children,
  ...props
}: AccordionProps) => {
  const [activeItems, setActiveItems] = useState<number[] | number | null>(
    defaultValue ?? (multiple ? [] : null)
  );
  const { focusedIndex, setFocusedIndex, setFocusRef, moveFocus, moveToStart, moveToEnd } =
    useRovingFocus(items, defaultValue);

  function handleAccordion(index: number) {
    const toggleItem = (prev: number | number[] | null, index: number) => {
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

  const contextValue = {
    items,
    activeItems: activeItems,
    isMultiple: multiple,
    focusedIndex,
    setFocusRef,
    setFocusedIndex,
    setActiveItems,
    handleAccordion,
    moveFocus,
    moveToStart,
    moveToEnd,
  };
  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        id="accordionGroup"
        data-testid={testId}
        className={cn(
          'ui:flex ui:w-[250px] ui:flex-col ui:gap-2 ui:rounded-md ui:bg-gray-300 ui:p-4 ui:shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// helper function for using accordion context

function useAccordionContext() {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('Accordion components need to be wrapped into <Accordion>.');
  }

  return context;
}

// ------------ Item component

type AccordionItemContextProps = {
  value: number;
};

const AccordionItemContext = createContext<AccordionItemContextProps | null>(null);

type AccordionItemProps = ComponentProps<'div'> & {
  testId?: string;
  value: number;
  children: ReactNode;
};

const AccordionItem = ({ testId, value, className, children, ...props }: AccordionItemProps) => {
  const {
    focusedIndex,
    setFocusedIndex,
    setFocusRef,
    handleAccordion,
    moveFocus,
    moveToStart,
    moveToEnd,
  } = useAccordionContext();

  const itemRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (itemRef.current) {
      setFocusRef({ index: value, element: itemRef.current });
    }
  }, [value, focusedIndex, setFocusRef]);

  const handleFocus = useCallback(() => {
    setFocusedIndex(value);
  }, [value, setFocusedIndex]);

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

        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            moveFocus('previous');
          } else {
            moveFocus('next');
          }
          break;
        default:
          break;
      }
    },
    [value, handleAccordion, moveFocus, moveToStart, moveToEnd]
  );

  const contextValue = {
    value,
  };

  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div
        data-testid={testId}
        ref={itemRef}
        tabIndex={0}
        className={cn('ui:overflow-hidden', className)}
        {...props}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// helper function for using accordionItem context

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error('AccordionItem components need to be wrapped into <AccordionItem>.');
  }

  return context;
}

// ------------ Trigger component

type AccordionTriggerProps = ComponentProps<'div'> & {
  testId?: string;
  children: ReactNode;
};

const AccordionTrigger = ({ testId, className, children, ...props }: AccordionTriggerProps) => {
  const { activeItems, handleAccordion } = useAccordionContext();
  const { value } = useAccordionItemContext();
  const isOpen = Array.isArray(activeItems) ? activeItems.includes(value) : activeItems === value;
  const contentId = `content-${value}`;

  return (
    <Flex
      data-testid={testId}
      aria-controls={contentId}
      aria-expanded={isOpen ? 'true' : 'false'}
      justify={'between'}
      role="button"
      {...props}
      className={cn('ui:overflow-hidden', className)}
      onClick={() => handleAccordion(value)}
    >
      {children}
    </Flex>
  );
};

// ------------ Content component

type AccordionContentProps = ComponentProps<'div'> & {
  testId?: string;
  children: ReactNode;
};

const AccordionContent = ({ testId, className, children, ...props }: AccordionContentProps) => {
  const { activeItems } = useAccordionContext();
  const { value } = useAccordionItemContext();
  const isOpen = Array.isArray(activeItems) ? activeItems.includes(value) : activeItems === value;
  const triggerId = `trigger-${value}`;
  return (
    <>
      {isOpen ? (
        <div
          data-testid={testId}
          aria-hidden={!isOpen ? 'true' : 'false'}
          aria-labelledby={triggerId}
          hidden={!isOpen}
          role="region"
          className={cn('ui:overflow-hidden', className)}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
