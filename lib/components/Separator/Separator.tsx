import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { PolymorphicComponent } from "../../utils/types";

const SeparatorVariants = cva("ui-bg-gray-300", {
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

type SeparatorProps<C extends React.ElementType> = VariantProps<
  typeof SeparatorVariants
> &
  PolymorphicComponent<C, { as?: C }>;

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
