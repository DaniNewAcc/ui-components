import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { PolymorphicComponent } from "../../utils/types";

const TextVariants = cva("", {
  variants: {},
  defaultVariants: {},
});

type TextProps<C extends React.ElementType> = VariantProps<
  typeof TextVariants
> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Text = <C extends React.ElementType = "span">({
  as,
  testId,
  children,
  ...props
}: TextProps<C>) => {
  const Tag = as || "span";
  return (
    <Tag data-testid={testId} className={cn(TextVariants({}))} {...props}>
      {children}
    </Tag>
  );
};

export default Text;
