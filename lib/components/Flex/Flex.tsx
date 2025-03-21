import { FlexVariants } from "@/utils/variants";
import { cn } from "@utils/cn";
import { PolymorphicComponent } from "@utils/types";
import { VariantProps } from "class-variance-authority";

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
