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
          "ui:w-[250px] ui:bg-gray-300 ui:shadow-md ui:rounded-md ui:p-4 ui:flex ui:flex-col ui:gap-2",
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
  children: ReactNode;
};

const AccordionTrigger = ({
  className,
  children,
  ...props
}: AccordionTriggerProps) => {
  const { activeItem, handleAccordion } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = activeItem === id;
  return (
    <Flex
      aria-expanded={isOpen ? "true" : "false"}
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
  children: ReactNode;
};

const AccordionContent = ({
  className,
  children,
  ...props
}: AccordionContentProps) => {
  const { activeItem } = useAccordionContext();
  const { id } = useAccordionItemContext();
  const isOpen = activeItem === id;
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

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
