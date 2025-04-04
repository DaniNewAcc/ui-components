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
  children: ReactNode;
};

type TabsContextProps = {
  activeTab: string | null;
  handleTabs: (id: string | null) => void;
};

const TabsContext = createContext<TabsContextProps | null>(null);

const Tabs = ({ className, children, ...props }: TabsProps) => {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  function handleTabs(id: string | null) {
    setActiveTab((prev) => (prev === id ? null : id));
  }

  const contextValue = {
    activeTab: activeTab,
    handleTabs,
  };
  return (
    <TabsContext.Provider value={contextValue}>
      <div
        id="TabsGroup"
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
  id: string | null;
  children: ReactNode;
};

type TabsListContextProps = {
  id: string | null;
};

const TabsListContext = createContext<TabsListContextProps | null>(null);

const TabsList = ({ id, className, children, ...props }: TabsListProps) => {
  const contextValue = {
    id,
  };
  return (
    <TabsListContext.Provider value={contextValue}>
      <h3 id={id} className={cn("ui:overflow-hidden", className)} {...props}>
        {children}
      </h3>
    </TabsListContext.Provider>
  );
};

// helper function for using TabsList context

function useTabsListContext() {
  const context = useContext(TabsListContext);

  if (!context) {
    throw new Error("TabsList components need to be wrapped into <TabsList>.");
  }

  return context;
}

// ------------ Trigger component

type TabsTriggerProps = ComponentProps<"div"> & {
  children: ReactNode;
};

const TabsTrigger = ({ className, children, ...props }: TabsTriggerProps) => {
  const { activeTab, handleTabs } = useTabsContext();
  const { id } = useTabsListContext();
  const isOpen = activeTab === id;
  return (
    <Flex
      aria-expanded={isOpen ? "true" : "false"}
      justify={"between"}
      {...props}
      className={cn("ui:overflow-hidden", className)}
      onClick={() => handleTabs(id)}
    >
      {children}
    </Flex>
  );
};

// ------------ Content component

type TabsContentProps = ComponentProps<"div"> & {
  children: ReactNode;
};

const TabsContent = ({ className, children, ...props }: TabsContentProps) => {
  const { activeTab } = useTabsContext();
  const { id } = useTabsListContext();
  const isOpen = activeTab === id;
  return (
    <>
      {isOpen ? (
        <div
          role="region"
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
