import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps
  extends ComponentProps<"article">,
    VariantProps<typeof CardVariants> {
  testId?: string;
  children: ReactNode;
}

const CardVariants = cva("ui-flex ui-flex-col", {
  variants: {
    size: {
      sm: "",
      md: "",
      lg: "",
    },
  },
  defaultVariants: {},
});

const Card = ({
  ref,
  size,
  testId,
  className,
  children,
  ...props
}: CardProps) => {
  return (
    <article
      ref={ref}
      data-testid={testId}
      className={cn(CardVariants({ size }), className)}
      {...props}
    >
      {children}
    </article>
  );
};

export default Card;
