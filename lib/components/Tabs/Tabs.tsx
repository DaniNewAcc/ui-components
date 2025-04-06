import { cn } from "@/utils/cn";
import Flex from "@components/Flex";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

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
          "ui:flex ui:w-[250px] ui:justify-between ui:gap-2 ui:rounded-md ui:bg-gray-300 ui:p-4 ui:shadow-md",
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

type TabsListProps = ComponentProps<"div"> & {
  children: ReactNode;
};

const TabsList = ({ className, children, ...props }: TabsListProps) => {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={cn("ui:overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// ------------ Trigger component

type TabsTriggerProps = ComponentProps<"div"> & {
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
  const isActive = activeTab === value;
  return (
    <Flex
      aria-selected={isActive}
      role="tab"
      justify={"between"}
      {...props}
      className={cn("ui:overflow-hidden", className)}
      onClick={() => handleTabs(value)}
    >
      {children}
    </Flex>
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
  const isActive = activeTab === value;
  return (
    <>
      {isActive ? (
        <div
          role="tabpanel"
          aria-labelledby={value}
          className={cn("ui:overflow-hidden", className)}
          {...props}
        >
          {children}
        </div>
      ) : null}
    </>
  );
};

export { Tabs, TabsContent, TabsList, TabsTrigger };
