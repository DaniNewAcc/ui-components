import { cn } from "@utils/cn";
import { PolymorphicComponent } from "@utils/types";
import { cva, VariantProps } from "class-variance-authority";

const TextVariants = cva("", {
  variants: {
    variant: {
      default: "",
      heading: "ui:scroll-mt-16 ui:tracking-tight",
      list: "ui:list-disc ui:[&>li]:mt-2",
    },
    border: {
      default: "",
      bottom: "ui:border-b ui:pb-2",
      left: "ui:border-l ui:pl-4",
    },
  },
  defaultVariants: {
    variant: "default",
    border: "default",
  },
});

type TextProps<C extends React.ElementType> = VariantProps<
  typeof TextVariants
> &
  PolymorphicComponent<C, { as?: C; testId?: string }>;

const Text = <C extends React.ElementType = "span">({
  as,
  border,
  variant,
  className,
  testId,
  children,
  ...props
}: TextProps<C>) => {
  const Tag = as || "span";
  return (
    <Tag
      data-testid={testId}
      className={cn(TextVariants({ variant, border }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Text;
