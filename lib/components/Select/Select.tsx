import { useClickOutside } from '@/hooks/useClickOutside';
import { useSyncAnimation } from '@/hooks/useSyncAnimation';
import { cn } from '@/utils/cn';
import { ComponentProps, createContext, ReactNode, useCallback, useContext, useState } from 'react';
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
  children: ReactNode;
};

type SelectContextProps = {
  options: Option[];
  activeOption: ActiveOption;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveOption: React.Dispatch<React.SetStateAction<ActiveOption>>;
  handleDropdown: () => void;
  handleReset: (e: React.MouseEvent<HTMLSpanElement>) => void;
  handleOptions: (value: string | number) => void;
  valueKey: string;
  labelKey: string;
};

const SelectContext = createContext<SelectContextProps | null>(null);

const Select = ({
  options,
  defaultValue,
  className,
  testId,
  valueKey,
  labelKey,
  children,
  ...props
}: SelectProps) => {
  const [activeOption, setActiveOption] = useState<ActiveOption>(defaultValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

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
    },
    [activeOption]
  );

  const contextValue = {
    options,
    activeOption,
    isDropdownOpen,
    setIsDropdownOpen,
    setActiveOption,
    handleDropdown,
    handleOptions,
    handleReset,
    valueKey,
    labelKey,
  };

  const ref = useClickOutside<HTMLDivElement>(() => setIsDropdownOpen(false), isDropdownOpen);
  return (
    <SelectContext.Provider value={contextValue}>
      <div
        ref={ref}
        data-testid={testId}
        className={cn(
          'ui:h-10 ui:w-48 ui:rounded-md ui:border-2',
          { 'ui:rounded-b-none ui:border-b-0': isDropdownOpen },
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
};

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
  children: ReactNode;
};

const SelectTrigger = ({
  placeholderText = 'Select an option...',
  className,
  children,
  testId,
  ...props
}: SelectTriggerProps) => {
  const { activeOption, options, handleReset, handleDropdown, valueKey, labelKey } =
    useSelectContext();

  const selectedOption = options.find(opt => opt[valueKey] === activeOption);
  return (
    <button
      data-testid={testId}
      className={cn(
        'ui:flex ui:w-full ui:cursor-pointer ui:justify-between ui:gap-4 ui:px-4 ui:pt-2',
        className
      )}
      onClick={handleDropdown}
      {...props}
    >
      <span>{activeOption ? selectedOption?.[labelKey] : placeholderText}</span>
      <div className="ui:flex ui:items-end ui:gap-2">
        {activeOption ? <span onClick={e => handleReset(e)}>Clear</span> : null}
        <span>{children}</span>
      </div>
    </button>
  );
};

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
  const { isDropdownOpen } = useSelectContext();
  const duration = animateProps?.duration ?? 300;

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
          className={cn(
            'ui:-mx-[0.125rem] ui:flex ui:flex-col ui:rounded-md ui:border-2 ui:border-t-0 ui:px-4',
            { 'ui:rounded-t-none': isDropdownOpen },
            className
          )}
          style={{
            maxHeight: `${maxHeight}px`,
            transition: `max-height ${duration}ms ease, opacity ${duration}ms ease, visibility ${duration}ms ease`,
            opacity: isDropdownOpen ? 1 : 0,
            visibility: isDropdownOpen ? 'visible' : 'hidden',
          }}
          {...props}
        >
          {children}
        </ul>
      )}
    </Animate>
  );
};

// ------------ Option component
type SelectOptionProps = ComponentProps<'li'> & {
  testId?: string;
  value: string | number;
  children: ReactNode;
};

const SelectOption = ({ value, className, children, testId, ...props }: SelectOptionProps) => {
  const { handleOptions } = useSelectContext();

  return (
    <li
      data-testid={testId}
      className={cn('ui:cursor-pointer ui:first:pt-2 ui:last:pb-4', className)}
      onClick={() => handleOptions(value)}
      {...props}
    >
      {children}
    </li>
  );
};

export { Select, SelectDropdown, SelectOption, SelectTrigger };
