import { cn } from "@/utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import {
  ComponentProps,
  ComponentPropsWithoutRef,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";
import Button from "../Button";

type TabsProps = ComponentProps<"div"> & {
  defaultValue: string;
  children: ReactNode;
};

type TabsContextProps = {
  activeTab: string | null;
  handleTabs: (value: string) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);

const Tabs = ({ defaultValue, className, children, ...props }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(defaultValue);

  function handleTabs(value: string) {
    setActiveTab(value);
  }

  const contextValue = {
    activeTab: activeTab,
    handleTabs,
  };
  return (
    <TabsContext.Provider value={contextValue}>
      <div
        className={cn(
          "ui:flex ui:w-[250px] ui:flex-col ui:justify-between ui:gap-4 ui:rounded-md ui:bg-gray-300 ui:p-4 ui:shadow-md",
          className,
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
    throw new Error("Tabs components need to be wrapped into <Tabs>.");
  }

  return context;
}

// ------------ List component

const TabsListVariants = cva(
  "ui:inline-flex ui:shrink-0 ui:items-center ui:justify-center",
  {
    variants: {
      hasGap: {
        true: "ui:gap-2 ui:rounded-md ui:px-2 ui:py-2 ui:[&>button]:rounded-sm",
      },
    },
    defaultVariants: {
      hasGap: false,
    },
  },
);

type TabsListProps = ComponentProps<"div"> &
  VariantProps<typeof TabsListVariants> & {
    children: ReactNode;
  };

const TabsList = ({ hasGap, className, children, ...props }: TabsListProps) => {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(TabsListVariants({ hasGap }), className)}
      {...props}
    >
      {children}
    </div>
  );
};

// ------------ Trigger component

type TabsTriggerProps = ComponentPropsWithoutRef<"button"> & {
  value: string;
  children: ReactNode;
};

const TabsTrigger = ({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) => {
  const { activeTab, handleTabs } = useTabsContext();
  const triggerId = `trigger-${value}`;
  const contentId = `content-${value}`;
  const isActive = activeTab === value;
  return (
    <Button
      type="button"
      variant={"unstyled"}
      size={"sm"}
      aria-controls={contentId}
      aria-selected={isActive}
      id={triggerId}
      role="tab"
      {...props}
      className={cn(
        `${isActive ? "ui:bg-primary-600 ui:text-primary-50" : "ui:bg-primary-50 ui:text-primary-600"} ui:flex-1`,
        className,
      )}
      onClick={() => handleTabs(value)}
    >
      {children}
    </Button>
  );
};

// ------------ Content component

type TabsContentProps = ComponentProps<"div"> & {
  value: string;
  children: ReactNode;
};

const TabsContent = ({
  value,
  className,
  children,
  ...props
}: TabsContentProps) => {
  const { activeTab } = useTabsContext();
  const triggerId = `trigger-${value}`;
  const contentId = `content-${value}`;
  const isActive = activeTab === value;
  return (
    <>
      {isActive ? (
        <div
          aria-labelledby={triggerId}
          role="tabpanel"
          id={contentId}
          tabIndex={activeTab ? -1 : 0}
          className={cn("", className)}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
