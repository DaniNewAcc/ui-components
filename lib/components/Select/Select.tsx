import { cn } from '@/utils/cn';
import { ComponentProps, createContext, ReactNode, useCallback, useContext, useState } from 'react';

type Option = {
  id: number;
  name: string;
  [key: string]: any;
};

type SelectProps = ComponentProps<'div'> & {
  options: Option[];
  defaultValue?: number | null;
  testId?: string;
  children: ReactNode;
};

type SelectContextProps = {
  options: Option[];
  activeOption: number | null | undefined;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveOption: React.Dispatch<React.SetStateAction<number | null | undefined>>;
  handleDropdown: () => void;
  handleReset: (e: React.MouseEvent<HTMLSpanElement>) => void;
  handleOptions: (value: number) => void;
};

const SelectContext = createContext<SelectContextProps | null>(null);

const Select = ({ options, defaultValue, className, testId, children, ...props }: SelectProps) => {
  const [activeOption, setActiveOption] = useState<number | null | undefined>(defaultValue);
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
    (value: number) => {
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
  };
  return (
    <SelectContext.Provider value={contextValue}>
      <div
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

// helper function for using select context

function useSelectContext() {
  const context = useContext(SelectContext);

  if (!context) {
    throw new Error('Select components need to be wrapped into <Select>.');
  }

  return context;
}

// Trigger component

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
  const { activeOption, options, handleReset, handleDropdown } = useSelectContext();

  const selectedOption = options.find(opt => opt.id === activeOption);
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
      <span>{activeOption ? selectedOption?.name : placeholderText}</span>
      <div className="ui:flex ui:items-end ui:gap-2">
        {/* icona da aggiungere */}
        {activeOption ? <span onClick={e => handleReset(e)}>Clear</span> : null}
        <span>{children}</span>
      </div>
    </button>
  );
};

// Dropdown component

type SelectDropdownProps = ComponentProps<'ul'> & {
  testId?: string;
  children: ReactNode;
};

const SelectDropdown = ({ testId, className, children, ...props }: SelectDropdownProps) => {
  const { isDropdownOpen } = useSelectContext();
  return (
    <>
      {isDropdownOpen ? (
        <ul
          data-testid={testId}
          className={cn(
            'ui:-mx-[0.125rem] ui:mt-1 ui:flex ui:flex-col ui:rounded-md ui:border-2 ui:border-t-0 ui:px-4 ui:py-2',
            { 'ui:rounded-t-none': isDropdownOpen },
            className
          )}
          {...props}
        >
          {children}
        </ul>
      ) : null}
    </>
  );
};

// Option component

type SelectOptionProps = ComponentProps<'li'> & {
  testId?: string;
  value: number;
  children: ReactNode;
};

const SelectOption = ({ value, className, children, testId, ...props }: SelectOptionProps) => {
  const { handleOptions } = useSelectContext();
  return (
    <li
      data-testid={testId}
      className={cn('ui:cursor-pointer', className)}
      onClick={() => handleOptions(value)}
      {...props}
    >
      {children}
    </li>
  );
};

export { Select, SelectDropdown, SelectOption, SelectTrigger };
