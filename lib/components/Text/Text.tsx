import { cva, VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { cn } from "../../utils/cn";

const TextVariants = cva("", {
  variants: {},
  defaultVariants: {},
});

type TextOwnProps<C extends React.ElementType> = {
  as?: C;
  testId: string;
  children?: ReactNode;
};

type TextProps<C extends React.ElementType> = TextOwnProps<C> &
  VariantProps<typeof TextVariants> &
  Omit<React.ComponentProps<C>, keyof TextOwnProps<C>>;

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
