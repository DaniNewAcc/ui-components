import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";
import "../../tailwind-entry.css";
import { cn } from "../../utils/cn";

const LoaderVariants = cva("", {
  variants: {
    loaderType: {
      dots: "ui-dots-loader-animation ui-rounded-full ui-bg-gray-500",
      spinner:
        "ui-rounded-full ui-border-2 ui-border-gray-500 ui-border-b-transparent ui-animate-spin",
      line: "",
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

interface LoaderProps
  extends ComponentProps<"div">,
    VariantProps<typeof LoaderVariants> {
  testId?: string;
}

const Loader = ({ loaderType, size, testId, className }: LoaderProps) => {
  function createDots() {
    const dots = [];
    for (let i = 0; i < 3; i++) {
      dots.push(
        <span key={i} className={cn(LoaderVariants({ loaderType, size }))} />,
      );
    }
    return dots;
  }

  return (
    <div data-testid={testId}>
      {loaderType === "dots" ? (
        <div className="ui-flex ui-justify-center ui-gap-2">{createDots()}</div>
      ) : (
        <div className={cn(LoaderVariants({ loaderType, size }), className)} />
      )}
    </div>
  );
};

export default Loader;
