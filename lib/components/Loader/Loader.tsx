import "@/index.css";
import { FlexVariants } from "@/utils/variants";
import Flex from "@components/Flex";
import { cn } from "@utils/cn";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, ReactNode } from "react";

const LoaderVariants = cva("ui:rounded-full", {
  variants: {
    loaderType: {
      dots: "ui-dots-loader-animation ui:bg-gray-500",
      spinner: "ui:animate-spin ui:border-2",
    },
    size: {
      sm: "ui:h-2 ui:w-2",
      md: "ui:h-4 ui:w-4",
      lg: "ui:h-8 ui:w-8",
    },
    borderColor: {
      gray: "ui:border-gray-500",
      primary: "ui:border-primary-500",
      white: "ui:border-white",
    },
  },
  compoundVariants: [
    {
      loaderType: "spinner",
      borderColor: ["gray", "primary", "white"],
      class: "ui:border-b-transparent",
    },
  ],
  defaultVariants: {
    loaderType: "spinner",
    size: "md",
    borderColor: "gray",
  },
});

type LoaderProps = ComponentProps<"div"> &
  VariantProps<typeof LoaderVariants> &
  VariantProps<typeof FlexVariants> & {
    testId?: string;
    children?: ReactNode;
  };

const Loader = ({
  loaderType,
  size,
  borderColor,
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
          className={cn(
            LoaderVariants({ borderColor, loaderType, size }),
            className,
          )}
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
      role="status"
      className={cn(FlexVariants)}
      {...props}
    >
      <Flex gap={"sm"}>
        {loaderType === "dots" ? (
          createDots()
        ) : (
          <span
            className={cn(
              LoaderVariants({ borderColor, loaderType, size }),
              className,
            )}
          />
        )}
      </Flex>
      {children}
    </Flex>
  );
};

export default Loader;
