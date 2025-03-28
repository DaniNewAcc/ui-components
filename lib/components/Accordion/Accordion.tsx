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
      <div id="accordionGroup" className={cn({}, className)} {...props}>
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
  isOpen: boolean;
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
  const { activeItem } = useAccordionContext();
  const isOpen = activeItem === id;
  const contextValue = {
    id,
    isOpen,
  };
  return (
    <AccordionItemContext.Provider value={contextValue}>
      <div id={id} className={cn({}, className)} {...props}>
        {children}
      </div>
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
  const { handleAccordion } = useAccordionContext();
  const { id, isOpen } = useAccordionItemContext();
  return (
    <Flex
      aria-expanded={isOpen ? "true" : "false"}
      justify={"between"}
      {...props}
      className={cn({}, className)}
      onClick={() => handleAccordion(id)}
    >
      {children}
      <span>icon</span>
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
  const { isOpen } = useAccordionItemContext();
  return (
    <>
      {isOpen ? (
        <div role="region" className={cn({}, className)} {...props}>
          {children}
        </div>
      ) : null}
    </>
  );
};

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
