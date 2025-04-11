import { cn } from "@utils/cn";
import { PolymorphicComponent } from "@utils/types";
import { cva, VariantProps } from "class-variance-authority";

const SeparatorVariants = cva("ui:bg-gray-300", {
  variants: {
    variant: {
      horizontalMiddle: "ui:px-4",
      verticalMiddle: "ui:py-4",
    },
    orientation: {
      horizontal: "ui:h-1 ui:w-full",
      vertical: "ui:h-full ui:w-1",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type SeparatorProps<C extends React.ElementType> = VariantProps<
  typeof SeparatorVariants
> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Separator = <C extends React.ElementType = "hr">({
  testId,
  as,
  variant,
  orientation,
  className,
  ...props
}: SeparatorProps<C>) => {
  let Tag = as || "hr";
  if (orientation === "vertical") {
    Tag = "div";
  }
  return (
    <Tag
      data-testId={testId}
      className={cn(SeparatorVariants({ variant, orientation }), className)}
      {...props}
    />
  );
};

export default Separator;
