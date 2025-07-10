import { useClickOutside } from '@/hooks/useClickOutside';
import useComponentIds from '@/hooks/useComponentIds';
import { useMergedRefs } from '@/hooks/useMergedRefs';
import useRovingFocus from '@/hooks/useRovingFocus';
import { useSyncAnimation } from '@/hooks/useSyncAnimation';
import useTypeahead from '@/hooks/useTypehead';
import { cn } from '@/utils/cn';
import { applyInitialFocus } from '@/utils/helpers';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/solid';
import React, {
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
import Animate from '../Animate';
import { AnimateProps } from '../Animate/Animate';

type Option = {
  [key: string]: any;
  disabled?: boolean;
};

type ActiveOption = string | number | null;

type SelectProps = ComponentProps<'div'> & {
  options: Option[];
  defaultValue?: string | number | null;
  testId?: string;
  valueKey: string;
  labelKey: string;
  loop?: boolean;
  clearable?: boolean;
  children: ReactNode;
};

type SelectContextProps = {
  options: Option[];
  activeOption: ActiveOption;
  valueKey: string;
  labelKey: string;
  isDropdownOpen: boolean;
  clearable: boolean;
  focusedIndex: number | string | null;
  triggerRef: React.RefObject<HTMLButtonElement>;
  idMap: Record<string, string>;
  isActiveOptionValid: boolean;
  firstFocusableOption: () => string | number;
  moveFocus: (direction: 'next' | 'previous') => void;
  moveToStart: () => void;
  moveToEnd: () => void;
  setFocusedIndex: React.Dispatch<React.SetStateAction<number | string | null>>;
  setFocusRef: (SetFocusRefProps: { index: number | string; element: HTMLElement | null }) => void;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveOption: React.Dispatch<React.SetStateAction<ActiveOption>>;
  resetSelection: () => void;
  handleDropdown: () => void;
  handleOptions: (value: string | number) => void;
};

const SelectContext = createContext<SelectContextProps | null>(null);

const Select = ({
  options,
  defaultValue,
  className,
  testId = 'select',
  valueKey,
  labelKey,
  loop = false,
  clearable = false,
  children,
  ...props
}: SelectProps) => {
  const [activeOption, setActiveOption] = useState<ActiveOption>(defaultValue ?? null);
  const {
    focusedIndex,
    registeredCount,
    clearFocusRefs,
    setFocusedIndex,
    moveFocus,
    moveToStart,
    moveToEnd,
    setFocusRef,
  } = useRovingFocus(activeOption, loop);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isActiveOptionValid = useMemo(() => {
    return (
      activeOption !== null && options.some(opt => opt[valueKey] === activeOption && !opt.disabled)
    );
  }, [activeOption, options, valueKey]);

  const firstFocusableOption = useMemo(() => {
    return options.find(opt => !opt.disabled)?.[valueKey];
  }, [options, valueKey]);

  const idKeys = useMemo(
    () => ['trigger', 'list', ...options.map(opt => `option-${opt[valueKey]}`)],
    [options, valueKey]
  );

  const idMap = useComponentIds('select', idKeys);

  const handleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev);
  }, []);

  const resetSelection = useCallback(() => {
    setActiveOption(null);
    setIsDropdownOpen(false);
    triggerRef.current?.focus();
  }, []);

  const handleOptions = useCallback((value: string | number) => {
    setActiveOption(value);
    setIsDropdownOpen(false);
    triggerRef?.current?.focus();
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) {
      clearFocusRefs();
      setFocusedIndex(null);
      return;
    }

    if (registeredCount !== options.length) return;

    const timeout = setTimeout(() => {
      applyInitialFocus(isActiveOptionValid, activeOption, firstFocusableOption, setFocusedIndex);
    }, 10);

    return () => clearTimeout(timeout);
  }, [
    isDropdownOpen,
    registeredCount,
    isActiveOptionValid,
    activeOption,
    firstFocusableOption,
    options,
    clearFocusRefs,
  ]);

  const contextValue = useMemo(
    () => ({
      options,
      activeOption,
      isDropdownOpen,
      valueKey,
      labelKey,
      focusedIndex,
      triggerRef,
      clearable,
      idMap,
      isActiveOptionValid,
      firstFocusableOption,
      setFocusedIndex,
      moveFocus,
      moveToStart,
      moveToEnd,
      setFocusRef,
      setIsDropdownOpen,
      setActiveOption,
      resetSelection,
      handleDropdown,
      handleOptions,
    }),
    [
      options,
      activeOption,
      isDropdownOpen,
      valueKey,
      labelKey,
      idMap,
      focusedIndex,
      isActiveOptionValid,
      firstFocusableOption,
      setFocusedIndex,
      moveFocus,
      moveToStart,
      moveToEnd,
      setFocusRef,
      setIsDropdownOpen,
      setActiveOption,
      resetSelection,
      handleDropdown,
      handleOptions,
    ]
  );

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
type SelectTriggerProps = ComponentPropsWithoutRef<'button'> & {
  testId?: string;
  placeholderText?: string;
};

const SelectTrigger = forwardRef<React.ElementRef<'button'>, SelectTriggerProps>(
  (
    {
      placeholderText = 'Select an option...',
      className,
      children,
      testId = 'select-trigger',
      ...props
    },
    externalRef
  ) => {
    const {
      activeOption,
      options,
      focusedIndex,
      idMap,
      triggerRef,
      valueKey,
      labelKey,
      clearable,
      isDropdownOpen,
      setIsDropdownOpen,
      resetSelection,
      handleDropdown,
      moveToStart,
    } = useSelectContext();

    const mergedRefs = useMergedRefs(triggerRef, externalRef);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const target = e.target as HTMLElement;

        if (target.getAttribute('aria-label') === 'Clear') return;
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
      [isDropdownOpen, moveToStart]
    );

    const handleClearClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        resetSelection();
      },
      [resetSelection]
    );

    const handleClearKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          resetSelection();
        }
      },
      [resetSelection]
    );

    const selectedOption = useMemo(() => {
      return options.find(opt => opt[valueKey] === activeOption);
    }, [activeOption, options, valueKey]);
    return (
      <div
        className={cn(
          'ui:relative ui:flex ui:w-full ui:items-center ui:justify-between ui:gap-2 ui:rounded-md ui:border-2 ui:focus-within:border-primary-500 ui:focus-within:outline-none',
          {
            'ui:rounded-b-none ui:border-primary-500': isDropdownOpen,
          },
          className
        )}
      >
        <button
          ref={mergedRefs}
          data-testid={testId}
          aria-haspopup="listbox"
          aria-expanded={isDropdownOpen}
          aria-controls={idMap.list}
          aria-activedescendant={
            focusedIndex !== null ? idMap[`option-${focusedIndex}`] : undefined
          }
          aria-label="Select an option"
          id={idMap.trigger}
          role="combobox"
          className="ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:justify-between ui:truncate ui:py-2 ui:ps-3 ui:pe-10 ui:text-left ui:ring-0 ui:outline-none"
          onKeyDown={handleKeyDown}
          onClick={handleDropdown}
          {...props}
        >
          <span className="ui:flex-1 ui:truncate ui:text-left">
            {activeOption ? selectedOption?.[labelKey] : placeholderText}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              'ui:absolute ui:end-1.5 ui:h-4 ui:w-4 ui:transform ui:text-end ui:align-middle ui:transition-transform ui:duration-300',
              {
                'ui:rotate-180': isDropdownOpen,
              }
            )}
          >
            <ChevronDownIcon />
          </span>
        </button>
        {clearable && activeOption ? (
          <button
            type="button"
            data-testid="clear-btn"
            aria-label="Clear"
            onClick={handleClearClick}
            onKeyDown={handleClearKeyDown}
            className="ui:absolute ui:end-6 ui:flex ui:h-6 ui:w-6 ui:cursor-pointer ui:items-center ui:justify-center ui:rounded-full ui:outline-none ui:focus-visible:ring-2 ui:focus-visible:ring-primary-600"
          >
            <XMarkIcon className="ui:pointer-events-none ui:h-5 ui:w-5" />
          </button>
        ) : null}
      </div>
    );
  }
);

Select.Trigger = SelectTrigger;
SelectTrigger.displayName = 'SelectTrigger';

// ------------ Dropdown component
type SelectDropdownProps = ComponentPropsWithoutRef<'ul'> & {
  animateProps?: Partial<AnimateProps>;
  testId?: string;
  children: ReactNode;
};

const SelectDropdown = forwardRef<React.ElementRef<'ul'>, SelectDropdownProps>(
  ({ animateProps, testId = 'select-dropdown', className, children, ...props }, ref) => {
    const {
      isDropdownOpen,
      triggerRef,
      focusedIndex,
      options,
      idMap,
      valueKey,
      labelKey,
      activeOption,
      isActiveOptionValid,
      firstFocusableOption,
      setFocusedIndex,
      setIsDropdownOpen,
      handleOptions,
      moveFocus,
      moveToStart,
      moveToEnd,
    } = useSelectContext();
    const duration = animateProps?.duration ?? 300;
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const {
      ref: animationRef,
      shouldRender,
      maxHeight,
    } = useSyncAnimation<HTMLUListElement>({
      isOpen: isDropdownOpen,
      duration,
    });

    const { handleTypeahead } = useTypeahead({
      options,
      getLabel: item => String(item[labelKey]),
      getValue: item => item[valueKey],
      onMatch: setFocusedIndex,
    });

    const mergedRefs = useMergedRefs(animationRef, ref);

    useEffect(() => {
      if (isDropdownOpen) {
        animationRef.current?.focus();

        applyInitialFocus(isActiveOptionValid, activeOption, firstFocusableOption, setFocusedIndex);
      } else {
        setFocusedIndex(null);
      }
    }, [isDropdownOpen, activeOption, isActiveOptionValid, firstFocusableOption]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const key = e.key;

        if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          if (focusedIndex !== null) {
            handleOptions(focusedIndex);
          }
          return;
        }

        if (key.length === 1 && /^[a-z0-9 ]$/i.test(key)) {
          handleTypeahead(key);
          return;
        }
        switch (key) {
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
          case 'Home':
            e.preventDefault();
            moveToStart();
            break;
          case 'End':
            e.preventDefault();
            moveToEnd();
            break;
          case 'Escape':
            e.preventDefault();
            setIsDropdownOpen(false);
            setTimeout(() => {
              triggerRef.current?.focus();
            }, 0);
            break;
        }
      },
      [moveFocus, moveToStart, moveToEnd, handleOptions, handleTypeahead, focusedIndex]
    );

    const handleAnimationChange = useCallback((animating: boolean) => {
      setIsAnimating(animating);
    }, []);

    return (
      <Animate
        isVisible={isDropdownOpen}
        preset="dropdown"
        onAnimationChange={handleAnimationChange}
      >
        {shouldRender && (
          <ul
            ref={mergedRefs}
            data-testid={testId}
            id={idMap.list}
            className={cn(
              'ui:mt-[-2px] ui:flex ui:flex-col ui:rounded-md ui:border-2 ui:shadow-md',
              { 'ui:rounded-t-none ui:border-primary-500': isDropdownOpen || isAnimating },
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
  }
);

Select.Dropdown = SelectDropdown;
SelectDropdown.displayName = 'SelectDropdown';

// ------------ Option component
type SelectOptionProps = ComponentPropsWithoutRef<'li'> & {
  testId?: string;
  value: string | number;
  disabled?: boolean;
  children: ReactNode;
};

const SelectOption = forwardRef<React.ElementRef<'li'>, SelectOptionProps>(
  ({ value, className, children, disabled, testId = 'select-option', ...props }, ref) => {
    const { focusedIndex, activeOption, idMap, handleOptions, setFocusRef } = useSelectContext();
    const isSelected = activeOption === value;
    const isFocused = focusedIndex === value;

    const optionRefCallback = useCallback(
      (node: HTMLLIElement | null) => {
        setFocusRef({ index: value, element: node });
      },
      [setFocusRef, value]
    );

    const handleClick = useCallback(() => {
      if (disabled) return;
      handleOptions(value);
    }, [disabled, value, handleOptions]);

    const mergedRefs = useMergedRefs(optionRefCallback, ref);
    return (
      <li
        data-testid={testId}
        ref={mergedRefs}
        aria-disabled={disabled ? 'true' : undefined}
        aria-selected={isSelected ? 'true' : 'false'}
        id={idMap[`option-${value}`]}
        className={cn(
          'ui:flex ui:cursor-pointer ui:items-center ui:px-3 ui:pb-2 ui:last:rounded-b-md ui:focus-visible:outline-none',
          { 'ui:bg-primary-600 ui:text-white': isFocused },
          { 'ui:pt-1': !activeOption },
          className
        )}
        role="option"
        tabIndex={disabled ? -1 : isFocused ? 0 : -1}
        onClick={handleClick}
        {...props}
      >
        <span className="ui:flex-1 ui:truncate">{children}</span>
      </li>
    );
  }
);

Select.Option = SelectOption;
SelectOption.displayName = 'SelectOption';

export default Select;
