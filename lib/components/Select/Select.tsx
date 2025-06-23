import { useClickOutside } from '@/hooks/useClickOutside';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import useRovingFocus from '@/hooks/useRovingFocus';
import { useSyncAnimation } from '@/hooks/useSyncAnimation';
import { cn } from '@/utils/cn';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, {
  ComponentProps,
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
import Animate from '../Animate';
import { AnimateProps } from '../Animate/Animate';

type Option = {
  [key: string]: any;
};

type ActiveOption = string | number | null | undefined;

type SelectProps = ComponentProps<'div'> & {
  options: Option[];
  defaultValue?: string | number | null;
  testId?: string;
  valueKey: string;
  labelKey: string;
  loop?: boolean;
  children: ReactNode;
};

type SelectContextProps = {
  options: Option[];
  activeOption: ActiveOption;
  valueKey: string;
  labelKey: string;
  isDropdownOpen: boolean;
  focusedIndex: number | string | null;
  triggerRef: React.RefObject<HTMLButtonElement>;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number | string | null>>;
  setFocusRef: (SetFocusRefProps: { index: number | string; element: HTMLElement | null }) => void;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveOption: React.Dispatch<React.SetStateAction<ActiveOption>>;
  handleDropdown: () => void;
  handleReset: (e: React.MouseEvent<HTMLSpanElement>) => void;
  handleOptions: (value: string | number) => void;
};

const SelectContext = createContext<SelectContextProps | null>(null);

const Select = ({
  options,
  defaultValue,
  className,
  testId,
  valueKey,
  labelKey,
  loop = false,
  children,
  ...props
}: SelectProps) => {
  const {
    focusedIndex,
    registeredCount,
    setFocusedIndex,
    moveFocus,
    moveToStart,
    moveToEnd,
    setFocusRef,
    clearFocusRefs,
  } = useRovingFocus(null, loop);
  const [activeOption, setActiveOption] = useState<ActiveOption>(defaultValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const handleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const handleReset = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setActiveOption(null);
    setIsDropdownOpen(false);
  }, []);

  const handleOptions = useCallback(
    (value: string | number) => {
      if (activeOption !== value) {
        setActiveOption(value);
        setIsDropdownOpen(false);
      } else {
        setIsDropdownOpen(false);
      }
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    },
    [activeOption]
  );

  const contextValue = useMemo(
    () => ({
      options,
      activeOption,
      isDropdownOpen,
      valueKey,
      labelKey,
      focusedIndex,
      triggerRef,
      setFocusedIndex,
      moveFocus,
      moveToStart,
      moveToEnd,
      setFocusRef,
      setIsDropdownOpen,
      setActiveOption,
      handleDropdown,
      handleOptions,
      handleReset,
    }),
    [
      options,
      activeOption,
      isDropdownOpen,
      valueKey,
      labelKey,
      focusedIndex,
      setFocusedIndex,
      moveFocus,
      moveToStart,
      moveToEnd,
      setFocusRef,
      setIsDropdownOpen,
      setActiveOption,
      handleDropdown,
      handleOptions,
      handleReset,
    ]
  );

  useEffect(() => {
    if (isDropdownOpen && registeredCount === options.length) {
      requestAnimationFrame(() => {
        moveToStart();
      });
    } else if (!isDropdownOpen) {
      clearFocusRefs();
      setFocusedIndex(null);
    }
  }, [isDropdownOpen, registeredCount, options.length]);

  const ref = useClickOutside<HTMLDivElement>(() => setIsDropdownOpen(false), isDropdownOpen);
  return (
    <SelectContext.Provider value={contextValue}>
      <div ref={ref} data-testid={testId} className={cn('ui:h-10 ui:w-48', className)} {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  );
};

Select.displayName = 'Select';

// Helper function for using select context
function useSelectContext() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('Select components need to be wrapped into <Select>.');
  }

  return context;
}

// ------------ Trigger component
type SelectTriggerProps = ComponentProps<'button'> & {
  testId?: string;
  placeholderText?: string;
};

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    { placeholderText = 'Select an option...', className, children, testId, ...props },
    externalRef
  ) => {
    const {
      activeOption,
      options,
      focusedIndex,
      handleReset,
      handleDropdown,
      triggerRef,
      valueKey,
      labelKey,
      isDropdownOpen,
      setIsDropdownOpen,
      moveToStart,
    } = useSelectContext();

    const mergedRefs = useMergedRefs(triggerRef, externalRef);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowUp':
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (!isDropdownOpen) {
              setIsDropdownOpen(true);
              moveToStart();
            }
            break;
          default:
            break;
        }
      },
      [moveToStart]
    );

    const selectedOption = options.find(opt => opt[valueKey] === activeOption);
    return (
      <button
        ref={mergedRefs}
        data-testid={testId}
        aria-haspopup="listbox"
        aria-expanded={isDropdownOpen}
        aria-controls="dropdown"
        aria-activedescendant={focusedIndex !== null ? `option-${focusedIndex}` : undefined}
        className={cn(
          'ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:justify-between ui:gap-4 ui:rounded-md ui:border-2 ui:px-3 ui:py-2 ui:focus-visible:border-primary-500 ui:focus-visible:outline-none',
          { 'ui:rounded-b-none ui:border-primary-500': isDropdownOpen },
          className
        )}
        role="combobox"
        onKeyDown={handleKeyDown}
        onClick={handleDropdown}
        {...props}
      >
        <span>{activeOption ? selectedOption?.[labelKey] : placeholderText}</span>
        <div className="ui:flex ui:items-center ui:gap-2 ui:pt-1">
          {activeOption ? (
            <span className="ui:h-4 ui:w-4" onClick={e => handleReset(e)}>
              <XMarkIcon />
            </span>
          ) : null}
          <span
            className={cn('ui:h-4 ui:w-4 ui:transform ui:transition-transform ui:duration-300', {
              'ui:rotate-180': isDropdownOpen,
            })}
          >
            <ChevronDownIcon />
          </span>
        </div>
      </button>
    );
  }
);

Select.Trigger = SelectTrigger;
SelectTrigger.displayName = 'SelectTrigger';

// ------------ Dropdown component
type SelectDropdownProps = ComponentProps<'ul'> & {
  animateProps?: Partial<AnimateProps>;
  testId?: string;
  children: ReactNode;
};

const SelectDropdown = ({
  animateProps,
  testId,
  className,
  children,
  ...props
}: SelectDropdownProps) => {
  const { isDropdownOpen, triggerRef, focusedIndex, setIsDropdownOpen, handleOptions, moveFocus } =
    useSelectContext();
  const duration = animateProps?.duration ?? 300;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'Tab':
          e.preventDefault();
          break;
        case 'ArrowDown':
          e.preventDefault();
          moveFocus('next');
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveFocus('previous');
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex !== null) {
            handleOptions(focusedIndex);
          }
          break;
        case 'Escape':
          setIsDropdownOpen(false);
          if (triggerRef?.current) {
            triggerRef.current.focus();
          }
          break;
      }
    },
    [moveFocus, handleOptions, focusedIndex]
  );

  const { ref, shouldRender, maxHeight } = useSyncAnimation<HTMLUListElement>({
    isOpen: isDropdownOpen,
    duration,
  });

  return (
    <Animate isVisible={isDropdownOpen} preset="dropdown">
      {shouldRender && (
        <ul
          ref={ref}
          data-testid={testId}
          id="dropdown"
          className={cn(
            'ui:mt-[-2px] ui:flex ui:flex-col ui:rounded-md ui:border-2 ui:shadow-md',
            { 'ui:rounded-t-none ui:border-primary-500': isDropdownOpen },
            className
          )}
          style={{
            maxHeight: `${maxHeight}px`,
            transition: `max-height ${duration}ms ease, opacity ${duration}ms ease, visibility ${duration}ms ease`,
            opacity: isDropdownOpen ? 1 : 0,
            visibility: isDropdownOpen ? 'visible' : 'hidden',
          }}
          role="listbox"
          tabIndex={-1}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </ul>
      )}
    </Animate>
  );
};

Select.Dropdown = SelectDropdown;
SelectDropdown.displayName = 'SelectDropdown';

// ------------ Option component
type SelectOptionProps = ComponentProps<'li'> & {
  testId?: string;
  value: string | number;
  children: ReactNode;
};

const SelectOption = ({ value, className, children, testId, ...props }: SelectOptionProps) => {
  const { isDropdownOpen, focusedIndex, handleOptions, setFocusRef } = useSelectContext();
  const optionRef = useRef<HTMLLIElement | null>(null);
  const isFocused = focusedIndex === value;

  useEffect(() => {
    setFocusRef({ index: value, element: optionRef.current });
  }, [setFocusRef, value]);

  return (
    <li
      ref={optionRef}
      data-testid={testId}
      aria-selected={isFocused ? 'true' : 'false'}
      id={`option-${value}`}
      className={cn(
        { 'ui:bg-primary-600 ui:text-white': isFocused },
        'ui:cursor-pointer ui:px-3 ui:pt-1 ui:pb-2 ui:last:rounded-b-md ui:focus-visible:outline-none',
        className
      )}
      role="option"
      tabIndex={isDropdownOpen && isFocused ? 0 : -1}
      onClick={() => handleOptions(value)}
      {...props}
    >
      {children}
    </li>
  );
};

Select.Option = SelectOption;
SelectOption.displayName = 'SelectOption';

export default Select;
