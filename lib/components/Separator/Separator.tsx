import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { cn } from "../../utils/cn";

const SeparatorVariants = cva("bg-gray-300", {
  variants: {
    variant: {
      horizontalMiddle: "ui-px-4",
      verticalMiddle: "ui-py-4",
    },
    orientation: {
      horizontal: "ui-w-full ui-h-1",
      vertical: "ui-h-full ui-w-1",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorOwnProps<C extends React.ElementType> = {
  as?: C;
  children?: ReactNode;
};

type SeparatorProps<C extends React.ElementType> = SeparatorOwnProps<C> &
  VariantProps<typeof SeparatorVariants> &
  Omit<React.ComponentProps<C>, keyof SeparatorOwnProps<C>>;

const Separator = <C extends React.ElementType = "hr">({
  as,
  variant,
  orientation,
  children,
  ...props
}: SeparatorProps<C>) => {
  let Tag = as || "hr";
  if (orientation === "vertical") {
    Tag = "div";
  }
  return (
    <Tag className={cn(SeparatorVariants({ variant, orientation }))} {...props}>
      {children}
    </Tag>
  );
};

export default Separator;
