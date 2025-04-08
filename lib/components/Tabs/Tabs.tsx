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

const TabsVariants = cva(
  "ui:flex ui:w-fit ui:flex-col ui:justify-between ui:gap-4 ui:rounded-md ui:shadow-md",
  {
    variants: {
      hasPadding: {
        true: "ui:p-4",
      },
    },
    defaultVariants: {
      hasPadding: false,
    },
  },
);

type TabsProps = ComponentProps<"div"> &
  VariantProps<typeof TabsVariants> & {
    defaultValue: string;
    children: ReactNode;
  };

type TabsContextProps = {
  activeTab: string | null;
  handleTabs: (value: string) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);

const Tabs = ({
  defaultValue,
  hasPadding,
  className,
  children,
  ...props
}: TabsProps) => {
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
      <div className={cn(TabsVariants({ hasPadding }), className)} {...props}>
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
  "ui:inline-flex ui:w-fit ui:shrink-0 ui:items-center ui:justify-center ui:bg-transparent",
  {
    variants: {
      hasGap: {
        true: "ui:gap-2 ui:rounded-md ui:bg-primary-300 ui:[&>button]:rounded-sm",
      },
      hasPadding: {
        true: "ui:px-2 ui:py-2",
      },
    },
    defaultVariants: {
      hasGap: false,
      hasPadding: false,
    },
  },
);

type TabsListProps = ComponentProps<"div"> &
  VariantProps<typeof TabsListVariants> & {
    children: ReactNode;
  };

const TabsList = ({
  hasGap,
  hasPadding,
  className,
  children,
  ...props
}: TabsListProps) => {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn(TabsListVariants({ hasGap, hasPadding }), className)}
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
        `${isActive ? "ui:bg-primary-600 ui:text-primary-50" : "ui:bg-primary-50 ui:text-primary-600"} ui:flex-1 ui:first:rounded-l-sm ui:last:rounded-r-sm`,
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
          className={cn("ui:flex-1", className)}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
