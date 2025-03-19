import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { PolymorphicComponent } from "../../utils/types";

export const FlexVariants = cva("ui-flex", {
  variants: {
    align: {
      default: "",
      baseline: "ui-items-baseline",
      start: "ui-items-start",
      center: "ui-items-center",
      end: "ui-items-end",
      stretch: "ui-items-stretch",
    },
    direction: {
      default: "",
      col: "ui-flex-col",
      row: "ui-flex-row",
    },
    gap: {
      default: "",
      xs: "ui-gap-1",
      sm: "ui-gap-2",
      md: "ui-gap-4",
      lg: "ui-gap-8",
      xl: "ui-gap-12",
      xxl: "ui-gap-16",
    },
    justify: {
      default: "",
      around: "ui-justify-around",
      between: "ui-justify-between",
      evenly: "ui-justify-evenly",
      start: "ui-justify-start",
      center: "ui-justify-center",
      end: "ui-justify-end",
    },
    flexWrap: {
      default: "",
      wrap: "ui-flex-wrap",
      noWrap: "ui-flex-nowrap",
      reverse: "ui-flex-wrap-reverse",
    },
  },
  defaultVariants: {
    align: "default",
    direction: "default",
    flexWrap: "default",
    gap: "default",
    justify: "default",
  },
});

type FlexProps<C extends React.ElementType> = VariantProps<
  typeof FlexVariants
> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Flex = <C extends React.ElementType = "div">({
  as,
  align,
  direction,
  flexWrap,
  gap,
  justify,
  testId,
  className,
  children,
  ...props
}: FlexProps<C>) => {
  const Tag = as || "div";

  return (
    <Tag
      data-testid={testId}
      className={cn(
        FlexVariants({
          align,
          direction,
          flexWrap,
          gap,
          justify,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Flex;
