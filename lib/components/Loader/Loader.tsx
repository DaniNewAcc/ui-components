import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, ReactNode } from "react";
import "../../tailwind-entry.css";
import { cn } from "../../utils/cn";
import Flex from "../Flex";
import { FlexVariants } from "../Flex/Flex";

const LoaderVariants = cva("", {
  variants: {
    loaderType: {
      dots: "ui-dots-loader-animation ui-rounded-full ui-bg-gray-500",
      spinner:
        "ui-rounded-full ui-border-2 ui-border-gray-500 ui-border-b-transparent ui-animate-spin",
    },
    size: {
      sm: "ui-w-2 ui-h-2",
      md: "ui-w-4 ui-h-4",
      lg: "ui-w-8 ui-h-8",
    },
  },
  defaultVariants: {
    loaderType: "spinner",
    size: "md",
  },
});

type LoaderProps = ComponentProps<"div"> &
  VariantProps<typeof LoaderVariants> &
  VariantProps<typeof FlexVariants> & {
    testId?: string;
    children: ReactNode;
  };

const Loader = ({
  loaderType,
  size,
  testId,
  className,
  children,
  ...props
}: LoaderProps) => {
  function createDots() {
    const dots = [];
    for (let i = 0; i < 3; i++) {
      dots.push(
        <span
          key={i}
          className={cn(LoaderVariants({ loaderType, size }), className)}
        />,
      );
    }
    return dots;
  }

  return (
    <Flex
      align={"center"}
      gap={"sm"}
      justify={"center"}
      data-testid={testId}
      className={cn(FlexVariants)}
      {...props}
    >
      <Flex gap={"sm"}>
        {loaderType === "dots" ? (
          createDots()
        ) : (
          <span
            className={cn(LoaderVariants({ loaderType, size }), className)}
          />
        )}
      </Flex>
      {children}
    </Flex>
  );
};

export default Loader;
