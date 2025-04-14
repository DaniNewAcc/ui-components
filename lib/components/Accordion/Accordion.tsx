import { cn } from "@/utils/cn";
import Flex from "@components/Flex";
import {
  ComponentProps,
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

type AccordionProps = ComponentProps<"div"> & {
  children: ReactNode;
};

type AccordionContextProps = {
  activeItem: string | null;
  handleAccordion: (id: string | null) => void;
};

const AccordionContext = createContext<AccordionContextProps | null>(null);

const Accordion = ({ className, children, ...props }: AccordionProps) => {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  function handleAccordion(id: string | null) {
    setActiveItem((prev) => (prev === id ? null : id));
  }

  const contextValue = {
    activeItem: activeItem,
    handleAccordion,
  };
  return (
    <AccordionContext.Provider value={contextValue}>
      <div
        id="accordionGroup"
        className={cn(
          "ui:flex ui:w-[250px] ui:flex-col ui:gap-2 ui:rounded-md ui:bg-gray-300 ui:p-4 ui:shadow-md",
          className,
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
    throw new Error(
      "Accordion components need to be wrapped into <Accordion>.",
    );
  }

  return context;
}

// ------------ Item component

type AccordionItemProps = ComponentProps<"div"> & {
  id: string | null;
  children: ReactNode;
};

type AccordionItemContextProps = {
  id: string | null;
};

const AccordionItemContext = createContext<AccordionItemContextProps | null>(
  null,
);

const AccordionItem = ({
  id,
  className,
  children,
  ...props
}: AccordionItemProps) => {
  const contextValue = {
    id,
  };
  return (
    <AccordionItemContext.Provider value={contextValue}>
      <h3 id={id} className={cn("ui:overflow-hidden", className)} {...props}>
        {children}
      </h3>
    </AccordionItemContext.Provider>
  );
};

// helper function for using accordionitem context

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);

  if (!context) {
    throw new Error(
      "AccordionItem components need to be wrapped into <AccordionItem>.",
    );
  }

  return context;
}

// ------------ Trigger component

type AccordionTriggerProps = ComponentProps<"div"> & {
  testId?: string;
  children: ReactNode;
};

const AccordionTrigger = ({
  testId,
  className,
  children,
  ...props
}: AccordionTriggerProps) => {
  const { activeItem, handleAccordion } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = activeItem === id;
  const contentId = `content-${id}`;
  return (
    <Flex
      data-testid={testId}
      aria-expanded={isOpen ? "true" : "false"}
      aria-controls={contentId}
      justify={"between"}
      {...props}
      className={cn("ui:overflow-hidden", className)}
      onClick={() => handleAccordion(id)}
    >
      {children}
    </Flex>
  );
};

// ------------ Content component

type AccordionContentProps = ComponentProps<"div"> & {
  testId?: string;
  children: ReactNode;
};

const AccordionContent = ({
  testId,
  className,
  children,
  ...props
}: AccordionContentProps) => {
  const { activeItem } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = activeItem === id;
  const triggerId = `trigger-${id}`;
  return (
    <>
      {isOpen ? (
        <div
          aria-labelledby={triggerId}
          data-testid={testId}
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

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
